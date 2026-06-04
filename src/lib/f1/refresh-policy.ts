export const ROUTE_REVALIDATE_MAP_SEC = 60;
export const ROUTE_REVALIDATE_RACE_SEC = 120;
export const CLIENT_MAP_REFRESH_MS = 60_000;
export const MAP_LOCAL_TTL_MS = 45_000;
export const RACE_LOCAL_TTL_MS = 120_000;

/** In-memory API-Sports response cache (free tier: 10 req/min). */
export const API_SPORTS_CACHE_MS = 15 * 60_000;
/** Serve stale API-Sports data up to this age when rate-limited. */
export const API_SPORTS_STALE_MS = 24 * 60 * 60_000;
/** Minimum spacing between outbound API-Sports calls (10/min free tier). */
export const API_SPORTS_MIN_REQUEST_INTERVAL_MS = 6_500;
export const API_SPORTS_FETCH_REVALIDATE_SEC = Math.max(
  60,
  Math.floor(API_SPORTS_CACHE_MS / 1000),
);
