/**
 * Shapes mirrored from API-Sports Formula-1 v1
 * @see https://api-sports.io/documentation/formula-1/v1
 * Base URL: https://v1.formula-1.api-sports.io
 *
 * Endpoints used by F1 Terminal:
 * - GET /competitions
 * - GET /circuits
 * - GET /races?season={year}
 * - GET /rankings/drivers?season={year}
 * - GET /rankings/teams?season={year}
 * - GET /rankings/races?race={id}
 * - GET /rankings/fastestlaps?race={id}
 */

export type ApiSportsEnvelope<T> = {
  get: string;
  parameters: Record<string, string | number | boolean>;
  errors: string[];
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
  status: ApiSportsRaceStatus;
};

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

export type ApiSportsDriverRanking = {
  position: number;
  driver: ApiSportsDriverRef;
  team: ApiSportsTeamRef;
  points: number;
  wins: number;
  behind: number | null;
  position_change: number | null;
};

export type ApiSportsTeamRanking = {
  position: number;
  team: ApiSportsTeamRef;
  points: number;
  wins: number;
  behind: number | null;
  position_change: number | null;
};
