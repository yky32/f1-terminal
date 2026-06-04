import type { SessionType, WeekendStatus } from "@/lib/data/live-session";
import type { ApiSportsRaceStatus } from "@/lib/f1/api-sports-types";

export type RaceRegion = "europe" | "americas" | "asia" | "middle-east" | "oceania";

export type RaceSession = {
  id: number;
  type: SessionType;
  typeLabel: string;
  date: string;
  status: ApiSportsRaceStatus;
  lapsCurrent: number | null;
  lapsTotal: number | null;
};

export type DriverStandingRow = {
  position: number;
  driverId: number;
  driverName: string;
  driverAbbr: string;
  driverNumber: number | null;
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
};

export type ConstructorStandingRow = {
  position: number;
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
};

export type FastestLapRow = {
  position: number;
  driverName: string;
  teamName: string;
  time: string;
  lap: number;
};

export type LapLeaderRow = {
  position: number;
  driverName: string;
  teamName: string;
  gap: string;
  lastLap: string;
};

export type WeatherSummary = {
  airTempC: number;
  trackTempC: number;
  condition: string;
  rainProbability: number;
  wind: string;
};

/** API-Sports Circuits — enriched locally where needed. */
export type RaceCircuitInfo = {
  name: string;
  length: string | null;
  laps: number | null;
  lapRecord: string | null;
  lapRecordHolder: string | null;
  lapRecordYear: number | null;
  location: string;
  firstGrandPrix: number | null;
  direction: string | null;
  circuitType: string | null;
};

/** Final classification (rankings/races after session). */
export type RaceResultRow = {
  position: number;
  driverName: string;
  driverAbbr: string;
  teamName: string;
  grid: number;
  status: string;
  points: number;
};

/** Grid vs finish — API-Sports race result fields. */
export type DriverPerformanceRow = {
  driverId: number;
  driverName: string;
  driverAbbr: string;
  teamName: string;
  grid: number;
  finish: number | null;
  points: number;
  positionsGained: number | null;
};

export type CircuitWinnerRow = {
  season: number;
  driverName: string;
  teamName: string;
};

export type StandingsImpactRow = {
  name: string;
  pointsBefore: number;
  pointsAfter: number;
  delta: number;
  positionChange: number | null;
};

export type StandingsImpact = {
  round: number;
  label: string;
  drivers: StandingsImpactRow[];
  constructors: StandingsImpactRow[];
};

export type RaceProfile = {
  id: string;
  apiCompetitionId: number;
  name: string;
  shortName: string;
  season: number;
  round: number;
  region: RaceRegion;
  country: string;
  city: string;
  circuit: {
    id: number;
    name: string;
    image: string | null;
    length: string | null;
    laps: number | null;
    latitude: number;
    longitude: number;
  };
  weekendStatus: WeekendStatus;
  liveSessions: number;
  hasSprint: boolean;
  sessions: RaceSession[];
  driverStandings: DriverStandingRow[];
  constructorStandings: ConstructorStandingRow[];
  fastestLaps: FastestLapRow[];
  lapLeaders: LapLeaderRow[];
  weather: WeatherSummary | null;
  circuitInfo: RaceCircuitInfo;
  raceResults: RaceResultRow[];
  driverPerformance: DriverPerformanceRow[];
  circuitHistory: CircuitWinnerRow[];
  standingsImpact: StandingsImpact | null;
};

export type RaceCatalogEntry = {
  id: string;
  apiCompetitionId: number;
  name: string;
  shortName: string;
  country: string;
  city: string;
  region: RaceRegion;
  round: number;
  season: number;
  weekendStatus: WeekendStatus;
};

export const RACE_REGION_LABELS: Record<RaceRegion, string> = {
  europe: "Europe",
  americas: "Americas",
  asia: "Asia",
  "middle-east": "Middle East",
  oceania: "Oceania",
};
