import type { RaceCatalogEntry, RaceProfile } from "@/lib/data/race-profile";

export const FEATURED_RACE_ID = "monaco-gp";
export const CURRENT_SEASON = 2025;

export const RACE_CATALOG: RaceCatalogEntry[] = [
  { id: "australian-gp", apiCompetitionId: 1, name: "Australian Grand Prix", shortName: "Australia", country: "Australia", city: "Melbourne", region: "oceania", round: 1, season: 2025, weekendStatus: "finished" },
  { id: "chinese-gp", apiCompetitionId: 2, name: "Chinese Grand Prix", shortName: "China", country: "China", city: "Shanghai", region: "asia", round: 2, season: 2025, weekendStatus: "finished" },
  { id: "japanese-gp", apiCompetitionId: 3, name: "Japanese Grand Prix", shortName: "Japan", country: "Japan", city: "Suzuka", region: "asia", round: 3, season: 2025, weekendStatus: "finished" },
  { id: "bahrain-gp", apiCompetitionId: 4, name: "Bahrain Grand Prix", shortName: "Bahrain", country: "Bahrain", city: "Sakhir", region: "middle-east", round: 4, season: 2025, weekendStatus: "finished" },
  { id: "saudi-arabian-gp", apiCompetitionId: 5, name: "Saudi Arabian Grand Prix", shortName: "Saudi Arabia", country: "Saudi Arabia", city: "Jeddah", region: "middle-east", round: 5, season: 2025, weekendStatus: "finished" },
  { id: "miami-gp", apiCompetitionId: 6, name: "Miami Grand Prix", shortName: "Miami", country: "USA", city: "Miami", region: "americas", round: 6, season: 2025, weekendStatus: "finished" },
  { id: "emilia-romagna-gp", apiCompetitionId: 7, name: "Emilia Romagna Grand Prix", shortName: "Imola", country: "Italy", city: "Imola", region: "europe", round: 7, season: 2025, weekendStatus: "finished" },
  { id: "monaco-gp", apiCompetitionId: 8, name: "Monaco Grand Prix", shortName: "Monaco", country: "Monaco", city: "Monte Carlo", region: "europe", round: 8, season: 2025, weekendStatus: "active" },
  { id: "canadian-gp", apiCompetitionId: 9, name: "Canadian Grand Prix", shortName: "Canada", country: "Canada", city: "Montreal", region: "americas", round: 9, season: 2025, weekendStatus: "upcoming" },
  { id: "spanish-gp", apiCompetitionId: 10, name: "Spanish Grand Prix", shortName: "Spain", country: "Spain", city: "Barcelona", region: "europe", round: 10, season: 2025, weekendStatus: "upcoming" },
  { id: "austrian-gp", apiCompetitionId: 11, name: "Austrian Grand Prix", shortName: "Austria", country: "Austria", city: "Spielberg", region: "europe", round: 11, season: 2025, weekendStatus: "upcoming" },
  { id: "british-gp", apiCompetitionId: 12, name: "British Grand Prix", shortName: "Britain", country: "Great Britain", city: "Silverstone", region: "europe", round: 12, season: 2025, weekendStatus: "upcoming" },
];

export function getCatalogEntryById(id: string): RaceCatalogEntry | null {
  return RACE_CATALOG.find((entry) => entry.id === id) ?? null;
}

export function buildRaceCatalogShell(entry: RaceCatalogEntry): RaceProfile {
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
      id: entry.apiCompetitionId,
      name: entry.city,
      image: null,
      length: null,
      laps: null,
      latitude: 0,
      longitude: 0,
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
  };
}

export function getRaceCatalogShells(): RaceProfile[] {
  return RACE_CATALOG.map(buildRaceCatalogShell);
}
