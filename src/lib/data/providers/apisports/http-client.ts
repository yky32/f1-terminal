import "server-only";

import type { ApiSportsEnvelope } from "@/lib/f1/api-sports-types";
import { API_SPORTS_BASE_URL } from "@/lib/f1/api-sports-endpoints";
import {
  apiSportsCacheKey,
  readApiSportsCache,
} from "@/lib/data/providers/apisports/cache";
import { API_SPORTS_FETCH_REVALIDATE_SEC } from "@/lib/f1/refresh-policy";

function extractErrors(errors: ApiSportsEnvelope<unknown>["errors"]): string[] {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map(String);
  if (typeof errors === "object") {
    return Object.values(errors as Record<string, string>).map(String);
  }
  return [String(errors)];
}

export class ApiSportsClient {
  private readonly baseUrl: string;

  constructor(private readonly apiKey: string) {
    this.baseUrl = process.env.API_SPORTS_BASE_URL?.trim() || API_SPORTS_BASE_URL;
  }

  async get<T>(path: string, query?: Record<string, string | number | boolean>) {
    const cacheKey = apiSportsCacheKey(path, query);

    return readApiSportsCache(cacheKey, () => this.fetch<T>(path, query));
  }

  private async fetch<T>(path: string, query?: Record<string, string | number | boolean>) {
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

    const body = (await response.json()) as ApiSportsEnvelope<T>;
    const errors = extractErrors(body.errors);

    if (!response.ok) {
      throw new Error(errors[0] ?? `API-Sports request failed (${response.status})`);
    }

    if (errors.length > 0) {
      throw new Error(errors.join("; "));
    }

    return body.response;
  }
}
