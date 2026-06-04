import type { RaceCatalogEntry, RaceProfile } from "@/lib/data/race-profile";
import { GLOBAL_SEASON, SEASON_CALENDAR, geoForRaceId } from "@/lib/f1/season-calendar";

export const FEATURED_RACE_ID = "monaco-gp";
export const CURRENT_SEASON = GLOBAL_SEASON;

export const RACE_CATALOG: RaceCatalogEntry[] = SEASON_CALENDAR;

export function getCatalogEntryById(id: string): RaceCatalogEntry | null {
  return RACE_CATALOG.find((entry) => entry.id === id) ?? null;
}

export function getCatalogEntryByCompetitionId(competitionId: number): RaceCatalogEntry | null {
  return RACE_CATALOG.find((entry) => entry.apiCompetitionId === competitionId) ?? null;
}

export function buildRaceCatalogShell(entry: RaceCatalogEntry): RaceProfile {
  const geo = geoForRaceId(entry.id);

  return {
    id: entry.id,
    apiCompetitionId: entry.apiCompetitionId,
    name: entry.name,
    shortName: entry.shortName,
    season: entry.season,
    round: entry.round,
    region: entry.region,
    country: entry.country,
    city: entry.city,
    circuit: {
      id: geo?.circuitId ?? entry.apiCompetitionId,
      name: geo?.name ?? entry.city,
      image: geo ? `https://media.api-sports.io/formula-1/circuits/${geo.circuitId}.png` : null,
      length: null,
      laps: null,
      latitude: geo?.latitude ?? 0,
      longitude: geo?.longitude ?? 0,
    },
    weekendStatus: entry.weekendStatus,
    liveSessions: entry.weekendStatus === "active" ? 1 : 0,
    hasSprint: false,
    sessions: [],
    driverStandings: [],
    constructorStandings: [],
    fastestLaps: [],
    lapLeaders: [],
    weather: null,
    circuitInfo: {
      name: geo?.name ?? entry.city,
      length: null,
      laps: null,
      lapRecord: null,
      lapRecordHolder: null,
      lapRecordYear: null,
      location: `${entry.city}, ${entry.country}`,
      firstGrandPrix: null,
      direction: null,
      circuitType: null,
    },
    raceResults: [],
    driverPerformance: [],
    circuitHistory: [],
    standingsImpact: null,
  };
}

export function getRaceCatalogShells(): RaceProfile[] {
  return RACE_CATALOG.map(buildRaceCatalogShell);
}
