/**
 * Shapes mirrored from API-Sports Formula-1 v1
 * @see https://api-sports.io/documentation/formula-1/v1
 * @see https://v1.formula-1.api-sports.io/
 *
 * Endpoints used by F1 Terminal:
 * - GET /competitions?id={id}
 * - GET /circuits?id={id}
 * - GET /races?season={year}[&type={session}][&competition={id}][&circuit={id}]
 * - GET /teams
 * - GET /rankings/drivers?season={year}
 * - GET /rankings/teams?season={year}
 * - GET /rankings/races?race={sessionId}
 * - GET /rankings/fastestlaps?race={sessionId}
 */

import { API_SPORTS_BASE_URL, API_SPORTS_DOCS_URL } from "@/lib/f1/api-sports-endpoints";

export { API_SPORTS_BASE_URL, API_SPORTS_DOCS_URL };

export type ApiSportsEnvelope<T> = {
  get: string;
  parameters: Record<string, string | number | boolean>;
  errors: string[] | Record<string, string>;
  results: number;
  response: T[];
};

export type ApiSportsLocation = {
  country: string;
  city: string;
};

export type ApiSportsCompetition = {
  id: number;
  name: string;
  location: ApiSportsLocation;
};

export type ApiSportsCircuit = {
  id: number;
  name: string;
  image: string | null;
  competition: ApiSportsCompetition;
  first_grand_prix: number | null;
  laps: number | null;
  length: string | null;
  race_distance: string | null;
  lap_record: {
    time: string | null;
    driver: string | null;
    year: string | null;
  } | null;
  capacity: number | null;
  opened: number | null;
};

export type ApiSportsRaceType =
  | "1st Practice"
  | "2nd Practice"
  | "3rd Practice"
  | "1st Qualifying"
  | "2nd Qualifying"
  | "3rd Qualifying"
  | "Sprint Qualifying"
  | "Sprint"
  | "Race";

export type ApiSportsRaceStatus =
  | "Scheduled"
  | "Live"
  | "Completed"
  | "Cancelled"
  | "Postponed";

export type ApiSportsDriverRef = {
  id: number;
  name: string;
  abbr: string;
  number: number | null;
  image: string | null;
};

export type ApiSportsTeamRef = {
  id: number;
  name: string;
  logo: string | null;
};

/** GET /teams */
export type ApiSportsTeam = ApiSportsTeamRef;

export type ApiSportsRace = {
  id: number;
  competition: ApiSportsCompetition;
  circuit: Pick<ApiSportsCircuit, "id" | "name" | "image">;
  season: number;
  type: ApiSportsRaceType;
  date: string;
  distance: string | null;
  timezone: string | null;
  laps: {
    current: number | null;
    total: number | null;
  } | null;
  fastest_lap?: {
    driver: Pick<ApiSportsDriverRef, "id">;
    time: string;
  } | null;
  status: ApiSportsRaceStatus;
};

export type ApiSportsDriverRanking = {
  position: number;
  driver: ApiSportsDriverRef;
  team: ApiSportsTeamRef;
  points: number;
  wins: number;
  behind: number | null;
  position_change?: number | null;
  season?: number;
};

export type ApiSportsTeamRanking = {
  position: number;
  team: ApiSportsTeamRef;
  points: number;
  wins?: number;
  behind?: number | null;
  position_change?: number | null;
  season?: number;
};

/** GET /rankings/races?race={sessionId} */
export type ApiSportsSessionRanking = {
  race: { id: number };
  position: number | null;
  driver: ApiSportsDriverRef;
  team: ApiSportsTeamRef;
  time: string | null;
  /** Completed laps count (number), not the nested laps object on /races. */
  laps: number | null;
  pits: number | null;
  /** Grid slot as string in API responses, e.g. "1". */
  grid: string | number | null;
  gap: string | null;
  status?: string | null;
  points?: number | null;
};

/** GET /rankings/fastestlaps?race={sessionId} */
export type ApiSportsFastestLapRanking = {
  race: { id: number };
  position: number;
  driver: ApiSportsDriverRef;
  team: ApiSportsTeamRef;
  time: string;
  lap: number;
  avg_speed?: string | null;
};
