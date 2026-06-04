import "server-only";

import {
  apiSportsCacheKey,
  isApiSportsRateLimitError,
  readApiSportsCache,
} from "@/lib/data/providers/apisports/cache";
import { enqueueApiSportsRequest } from "@/lib/data/providers/apisports/request-queue";
import { updateApiSportsRateLimit } from "@/lib/data/providers/apisports/rate-limit";
import type {
  ApiSportsEnvelope,
  ApiSportsStatusPayload,
} from "@/lib/f1/api-sports-types";
import { API_SPORTS_BASE_URL, API_SPORTS_PATHS } from "@/lib/f1/api-sports-endpoints";
import { API_SPORTS_FETCH_REVALIDATE_SEC } from "@/lib/f1/refresh-policy";

function extractErrors(errors: ApiSportsEnvelope<unknown>["errors"]): string[] {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map(String);
  if (typeof errors === "object") {
    return Object.values(errors as Record<string, string>).map(String);
  }
  return [String(errors)];
}

function hasEnvelopeErrors(errors: ApiSportsEnvelope<unknown>["errors"]) {
  return extractErrors(errors).length > 0;
}

export class ApiSportsClient {
  private readonly baseUrl: string;

  constructor(private readonly apiKey: string) {
    this.baseUrl = process.env.API_SPORTS_BASE_URL?.trim() || API_SPORTS_BASE_URL;
  }

  /** Cached GET — follows API-Sports envelope + paging when present. */
  async get<T>(path: string, query?: Record<string, string | number | boolean>) {
    const cacheKey = apiSportsCacheKey(path, query);

    return readApiSportsCache(cacheKey, () => this.getAllPages<T>(path, query));
  }

  /** GET /status — account, subscription, and daily usage (not cached). */
  async getStatus() {
    return enqueueApiSportsRequest(() => this.fetchStatus());
  }

  private async getAllPages<T>(
    path: string,
    query?: Record<string, string | number | boolean>,
  ) {
    const items: T[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const pageQuery =
        page > 1 ? ({ ...query, page } as Record<string, string | number | boolean>) : query;

      const envelope = await enqueueApiSportsRequest(() =>
        this.fetchEnvelope<T>(path, pageQuery),
      );

      items.push(...envelope.response);

      const pagingTotal = envelope.paging?.total;
      if (pagingTotal != null && pagingTotal > 1) {
        totalPages = pagingTotal;
        page += 1;
        continue;
      }

      break;
    }

    return items;
  }

  private async fetchEnvelope<T>(
    path: string,
    query?: Record<string, string | number | boolean>,
    retryOnRateLimit = true,
  ): Promise<ApiSportsEnvelope<T>> {
    const url = new URL(path, this.baseUrl);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      headers: {
        "x-apisports-key": this.apiKey,
      },
      next: { revalidate: API_SPORTS_FETCH_REVALIDATE_SEC },
    });

    updateApiSportsRateLimit(response.headers);

    if (response.status === 429 && retryOnRateLimit) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 60_000);
      });
      return this.fetchEnvelope<T>(path, query, false);
    }

    const body = (await response.json()) as ApiSportsEnvelope<T>;
    const errors = extractErrors(body.errors);

    if (!response.ok) {
      const message = errors[0] ?? `API-Sports request failed (${response.status})`;
      if (response.status === 429 || isApiSportsRateLimitError(message)) {
        throw new Error(`API-Sports rate limit: ${message}`);
      }
      throw new Error(message);
    }

    if (hasEnvelopeErrors(body.errors)) {
      throw new Error(errors.join("; "));
    }

    return {
      ...body,
      response: Array.isArray(body.response) ? body.response : [],
    };
  }

  private async fetchStatus(): Promise<ApiSportsStatusPayload> {
    const url = new URL(API_SPORTS_PATHS.status, this.baseUrl);
    const response = await fetch(url, {
      headers: {
        "x-apisports-key": this.apiKey,
      },
      cache: "no-store",
    });

    updateApiSportsRateLimit(response.headers);

    const body = (await response.json()) as ApiSportsEnvelope<never> & {
      response: ApiSportsStatusPayload;
    };
    const errors = extractErrors(body.errors);

    if (!response.ok || hasEnvelopeErrors(body.errors)) {
      throw new Error(errors[0] ?? `API-Sports status failed (${response.status})`);
    }

    return body.response;
  }
}
