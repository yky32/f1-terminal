/**
 * API-Sports Formula-1 v1
 * @see https://api-sports.io/documentation/formula-1/v1
 * @see https://v1.formula-1.api-sports.io/
 *
 * Auth header: `x-apisports-key: <API_SPORTS_KEY>`
 */

export const API_SPORTS_BASE_URL = "https://v1.formula-1.api-sports.io";
export const API_SPORTS_DOCS_URL = "https://api-sports.io/documentation/formula-1/v1";

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

/** Free tier seasons are typically 2022–2024; paid plans unlock current season. */
export const API_SPORTS_FREE_TIER_SEASONS = [2024, 2023, 2022] as const;
