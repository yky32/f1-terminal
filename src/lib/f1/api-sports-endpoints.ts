/**
 * API-Sports Formula-1 v1
 * @see https://api-sports.io/documentation/formula-1/v1
 * @see https://api-sports.io/documentation/formula-1/v1#section/Architecture
 * @see https://v1.formula-1.api-sports.io/
 *
 * Architecture:
 * - GET-only REST; auth via `x-apisports-key` header (no OAuth).
 * - Every response: { get, parameters, errors, results, paging?, response }.
 * - Check `errors` first, then `paging`, then read `response`.
 * - Rate limits (response headers): x-ratelimit-remaining (per minute),
 *   x-ratelimit-requests-remaining (per day). HTTP 429 when exceeded.
 * - GET /status — account, subscription, and daily usage (does not consume quota
 *   on some plans; safe health check).
 */

export const API_SPORTS_BASE_URL = "https://v1.formula-1.api-sports.io";
export const API_SPORTS_DOCS_URL =
  "https://api-sports.io/documentation/formula-1/v1#section/Architecture";

/** Free tier: 10 requests/minute, 100 requests/day (2022–2024 seasons). */
export const API_SPORTS_FREE_TIER_MINUTE_LIMIT = 10;
export const API_SPORTS_FREE_TIER_DAILY_LIMIT = 100;

/** Paths used by F1 Terminal (query params documented in api-sports-types.ts). */
export const API_SPORTS_PATHS = {
  status: "/status",
  competitions: "/competitions",
  circuits: "/circuits",
  drivers: "/drivers",
  teams: "/teams",
  races: "/races",
  rankingsDrivers: "/rankings/drivers",
  rankingsTeams: "/rankings/teams",
  rankingsRaces: "/rankings/races",
  rankingsFastestLaps: "/rankings/fastestlaps",
} as const;

/** Official logo CDN pattern from GET /teams — team.logo or this URL. */
export function apiSportsTeamLogoUrl(teamId: number) {
  return `https://media.api-sports.io/formula-1/teams/${teamId}.png`;
}

/** Official driver headshot CDN pattern from GET /drivers — driver.image or this URL. */
export function apiSportsDriverImageUrl(driverId: number) {
  return `https://media.api-sports.io/formula-1/drivers/${driverId}.png`;
}

/** Free tier seasons are typically 2022–2024; paid plans unlock current season. */
export const API_SPORTS_FREE_TIER_SEASONS = [2024, 2023, 2022] as const;
