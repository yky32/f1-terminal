import type {
  ConstructorStandingRow,
  DriverStandingRow,
  RaceRegion,
} from "@/lib/data/race-profile";
import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { WeekendStatus } from "@/lib/data/live-session";
import type { DataProviderId } from "@/lib/data/types";

export type ChampionshipLeader = {
  season: number;
  seasonLabel: string;
  driverName: string;
  driverAbbr: string;
  teamName: string;
  points: number;
  wins: number;
};

export type GlobalRaceCalendarEntry = {
  id: string;
  round: number;
  name: string;
  shortName: string;
  country: string;
  city: string;
  region: RaceRegion;
  weekendStatus: WeekendStatus;
  raceDate: string;
  circuitId: number;
};

export type WeekendHighlight = {
  raceId: string;
  name: string;
  shortName: string;
  round: number;
  country: string;
  city: string;
  circuitName: string;
  weekendStatus: WeekendStatus;
  liveSessions: number;
  nextSessionLabel: string | null;
  nextSessionStart: string | null;
};

export type RegionRaceStat = {
  region: RaceRegion;
  label: string;
  raceCount: number;
  circuitCount: number;
  liveWeekends: number;
};

export type GlobalOverviewPayload = {
  season: number;
  championship: ChampionshipLeader;
  circuits: CircuitActivity[];
  calendar: GlobalRaceCalendarEntry[];
  weekendHighlight: WeekendHighlight;
  driverStandings: DriverStandingRow[];
  constructorStandings: ConstructorStandingRow[];
  regionStats: RegionRaceStat[];
  updatedAt: string;
  provider: DataProviderId;
};
