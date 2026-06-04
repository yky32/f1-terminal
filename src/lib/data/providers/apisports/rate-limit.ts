import "server-only";

/**
 * API-Sports rate-limit headers (Formula-1 v1 free tier: 10/min, 100/day).
 * @see https://api-sports.io/documentation/formula-1/v1#section/Architecture
 */
export type ApiSportsRateLimitSnapshot = {
  minuteLimit: number | null;
  minuteRemaining: number | null;
  dailyLimit: number | null;
  dailyRemaining: number | null;
  updatedAt: string;
};

let snapshot: ApiSportsRateLimitSnapshot = {
  minuteLimit: null,
  minuteRemaining: null,
  dailyLimit: null,
  dailyRemaining: null,
  updatedAt: new Date(0).toISOString(),
};

function readHeader(headers: Headers, names: string[]) {
  for (const name of names) {
    const value = headers.get(name);
    if (value != null && value !== "") {
      return value;
    }
  }

  return null;
}

function parseCount(value: string | null) {
  if (value == null) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function updateApiSportsRateLimit(headers: Headers) {
  snapshot = {
    minuteLimit: parseCount(readHeader(headers, ["x-ratelimit-limit", "X-RateLimit-Limit"])),
    minuteRemaining: parseCount(
      readHeader(headers, ["x-ratelimit-remaining", "X-RateLimit-Remaining"]),
    ),
    dailyLimit: parseCount(
      readHeader(headers, ["x-ratelimit-requests-limit", "X-RateLimit-Requests-Limit"]),
    ),
    dailyRemaining: parseCount(
      readHeader(headers, ["x-ratelimit-requests-remaining", "X-RateLimit-Requests-Remaining"]),
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function getApiSportsRateLimitSnapshot(): ApiSportsRateLimitSnapshot {
  return snapshot;
}

export function apiSportsMinuteQuotaExhausted() {
  return snapshot.minuteRemaining != null && snapshot.minuteRemaining <= 0;
}

export function apiSportsDailyQuotaExhausted() {
  return snapshot.dailyRemaining != null && snapshot.dailyRemaining <= 0;
}
