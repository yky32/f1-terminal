import "server-only";

import { API_SPORTS_CACHE_MS, API_SPORTS_STALE_MS } from "@/lib/f1/refresh-policy";

function configuredCacheTtl() {
  const configured = Number(process.env.API_SPORTS_CACHE_TTL_MS?.trim());
  return Number.isFinite(configured) && configured > 0 ? configured : API_SPORTS_CACHE_MS;
}

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  staleUntil: number;
};

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export function apiSportsCacheKey(
  path: string,
  query?: Record<string, string | number | boolean>,
) {
  const url = new URL(path, "https://v1.formula-1.api-sports.io");

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  return `${url.pathname}?${url.searchParams.toString()}`;
}

export function isApiSportsRateLimitError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /too many requests|rate limit|ratelimit/i.test(message);
}

export async function readApiSportsCache<T>(
  key: string,
  loader: () => Promise<T>,
  ttlMs = configuredCacheTtl(),
  staleMs = API_SPORTS_STALE_MS,
): Promise<T> {
  const now = Date.now();
  const cached = store.get(key) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) {
    return pending;
  }

  const request = loader()
    .then((value) => {
      store.set(key, {
        value,
        expiresAt: now + ttlMs,
        staleUntil: now + staleMs,
      });
      inflight.delete(key);
      return value;
    })
    .catch((error) => {
      inflight.delete(key);

      if (cached && cached.staleUntil > now) {
        console.warn(`[api-sports] serving stale cache for ${key}`);
        return cached.value;
      }

      throw error;
    });

  inflight.set(key, request);
  return request;
}

export function peekApiSportsCache<T>(key: string): T | null {
  const cached = store.get(key) as CacheEntry<T> | undefined;
  if (!cached || cached.staleUntil <= Date.now()) {
    return null;
  }

  return cached.value;
}

export function writeApiSportsCache<T>(
  key: string,
  value: T,
  ttlMs = configuredCacheTtl(),
  staleMs = API_SPORTS_STALE_MS,
) {
  const now = Date.now();
  store.set(key, {
    value,
    expiresAt: now + ttlMs,
    staleUntil: now + staleMs,
  });
}
