import type { RaceCatalogEntry } from "@/lib/data/race-profile";

export const GLOBAL_SEASON = 2026;

/** 24-round calendar — aligned with API-Sports Races + local circuit coordinates. */
export const SEASON_CALENDAR: RaceCatalogEntry[] = [
  { id: "australian-gp", apiCompetitionId: 1, name: "Australian Grand Prix", shortName: "Australia", country: "Australia", city: "Melbourne", region: "oceania", round: 1, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "chinese-gp", apiCompetitionId: 2, name: "Chinese Grand Prix", shortName: "China", country: "China", city: "Shanghai", region: "asia", round: 2, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "japanese-gp", apiCompetitionId: 3, name: "Japanese Grand Prix", shortName: "Japan", country: "Japan", city: "Suzuka", region: "asia", round: 3, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "bahrain-gp", apiCompetitionId: 4, name: "Bahrain Grand Prix", shortName: "Bahrain", country: "Bahrain", city: "Sakhir", region: "middle-east", round: 4, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "saudi-arabian-gp", apiCompetitionId: 5, name: "Saudi Arabian Grand Prix", shortName: "Saudi Arabia", country: "Saudi Arabia", city: "Jeddah", region: "middle-east", round: 5, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "miami-gp", apiCompetitionId: 6, name: "Miami Grand Prix", shortName: "Miami", country: "USA", city: "Miami", region: "americas", round: 6, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "emilia-romagna-gp", apiCompetitionId: 7, name: "Emilia Romagna Grand Prix", shortName: "Imola", country: "Italy", city: "Imola", region: "europe", round: 7, season: GLOBAL_SEASON, weekendStatus: "finished" },
  { id: "monaco-gp", apiCompetitionId: 8, name: "Monaco Grand Prix", shortName: "Monaco", country: "Monaco", city: "Monte Carlo", region: "europe", round: 8, season: GLOBAL_SEASON, weekendStatus: "active" },
  { id: "canadian-gp", apiCompetitionId: 9, name: "Canadian Grand Prix", shortName: "Canada", country: "Canada", city: "Montreal", region: "americas", round: 9, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "spanish-gp", apiCompetitionId: 10, name: "Spanish Grand Prix", shortName: "Spain", country: "Spain", city: "Barcelona", region: "europe", round: 10, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "austrian-gp", apiCompetitionId: 11, name: "Austrian Grand Prix", shortName: "Austria", country: "Austria", city: "Spielberg", region: "europe", round: 11, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "british-gp", apiCompetitionId: 12, name: "British Grand Prix", shortName: "Britain", country: "Great Britain", city: "Silverstone", region: "europe", round: 12, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "belgian-gp", apiCompetitionId: 13, name: "Belgian Grand Prix", shortName: "Belgium", country: "Belgium", city: "Spa", region: "europe", round: 13, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "hungarian-gp", apiCompetitionId: 14, name: "Hungarian Grand Prix", shortName: "Hungary", country: "Hungary", city: "Budapest", region: "europe", round: 14, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "dutch-gp", apiCompetitionId: 15, name: "Dutch Grand Prix", shortName: "Netherlands", country: "Netherlands", city: "Zandvoort", region: "europe", round: 15, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "italian-gp", apiCompetitionId: 16, name: "Italian Grand Prix", shortName: "Italy", country: "Italy", city: "Monza", region: "europe", round: 16, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "azerbaijan-gp", apiCompetitionId: 17, name: "Azerbaijan Grand Prix", shortName: "Azerbaijan", country: "Azerbaijan", city: "Baku", region: "middle-east", round: 17, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "singapore-gp", apiCompetitionId: 18, name: "Singapore Grand Prix", shortName: "Singapore", country: "Singapore", city: "Singapore", region: "asia", round: 18, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "united-states-gp", apiCompetitionId: 19, name: "United States Grand Prix", shortName: "USA", country: "USA", city: "Austin", region: "americas", round: 19, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "mexican-gp", apiCompetitionId: 20, name: "Mexico City Grand Prix", shortName: "Mexico", country: "Mexico", city: "Mexico City", region: "americas", round: 20, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "brazilian-gp", apiCompetitionId: 21, name: "São Paulo Grand Prix", shortName: "Brazil", country: "Brazil", city: "São Paulo", region: "americas", round: 21, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "las-vegas-gp", apiCompetitionId: 22, name: "Las Vegas Grand Prix", shortName: "Las Vegas", country: "USA", city: "Las Vegas", region: "americas", round: 22, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "qatar-gp", apiCompetitionId: 23, name: "Qatar Grand Prix", shortName: "Qatar", country: "Qatar", city: "Lusail", region: "middle-east", round: 23, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
  { id: "abu-dhabi-gp", apiCompetitionId: 24, name: "Abu Dhabi Grand Prix", shortName: "Abu Dhabi", country: "UAE", city: "Yas Island", region: "middle-east", round: 24, season: GLOBAL_SEASON, weekendStatus: "upcoming" },
];

export type SeasonCircuitGeo = {
  circuitId: number;
  raceId: string;
  name: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

/** Circuit lat/long for map markers (API-Sports Circuits + local enrichment). */
export const SEASON_CIRCUIT_GEO: SeasonCircuitGeo[] = [
  { circuitId: 1, raceId: "australian-gp", name: "Albert Park", country: "Australia", city: "Melbourne", latitude: -37.8497, longitude: 144.968 },
  { circuitId: 2, raceId: "chinese-gp", name: "Shanghai International Circuit", country: "China", city: "Shanghai", latitude: 31.3389, longitude: 121.22 },
  { circuitId: 3, raceId: "japanese-gp", name: "Suzuka", country: "Japan", city: "Suzuka", latitude: 34.8431, longitude: 136.541 },
  { circuitId: 4, raceId: "bahrain-gp", name: "Bahrain International Circuit", country: "Bahrain", city: "Sakhir", latitude: 26.0325, longitude: 50.5106 },
  { circuitId: 5, raceId: "saudi-arabian-gp", name: "Jeddah Corniche", country: "Saudi Arabia", city: "Jeddah", latitude: 21.6319, longitude: 39.1044 },
  { circuitId: 6, raceId: "miami-gp", name: "Miami International Autodrome", country: "USA", city: "Miami", latitude: 25.958, longitude: -80.2389 },
  { circuitId: 7, raceId: "emilia-romagna-gp", name: "Autodromo Enzo e Dino Ferrari", country: "Italy", city: "Imola", latitude: 44.3439, longitude: 11.7167 },
  { circuitId: 8, raceId: "monaco-gp", name: "Circuit de Monaco", country: "Monaco", city: "Monte Carlo", latitude: 43.7347, longitude: 7.4206 },
  { circuitId: 9, raceId: "canadian-gp", name: "Circuit Gilles Villeneuve", country: "Canada", city: "Montreal", latitude: 45.5008, longitude: -73.5228 },
  { circuitId: 10, raceId: "spanish-gp", name: "Circuit de Barcelona-Catalunya", country: "Spain", city: "Barcelona", latitude: 41.57, longitude: 2.2611 },
  { circuitId: 11, raceId: "austrian-gp", name: "Red Bull Ring", country: "Austria", city: "Spielberg", latitude: 47.2197, longitude: 14.7647 },
  { circuitId: 12, raceId: "british-gp", name: "Silverstone Circuit", country: "Great Britain", city: "Silverstone", latitude: 52.0786, longitude: -1.0169 },
  { circuitId: 13, raceId: "belgian-gp", name: "Circuit de Spa-Francorchamps", country: "Belgium", city: "Spa", latitude: 50.4372, longitude: 5.9714 },
  { circuitId: 14, raceId: "hungarian-gp", name: "Hungaroring", country: "Hungary", city: "Budapest", latitude: 47.5789, longitude: 19.2488 },
  { circuitId: 15, raceId: "dutch-gp", name: "Circuit Zandvoort", country: "Netherlands", city: "Zandvoort", latitude: 52.3888, longitude: 4.5409 },
  { circuitId: 16, raceId: "italian-gp", name: "Autodromo Nazionale Monza", country: "Italy", city: "Monza", latitude: 45.6156, longitude: 9.2811 },
  { circuitId: 17, raceId: "azerbaijan-gp", name: "Baku City Circuit", country: "Azerbaijan", city: "Baku", latitude: 40.3725, longitude: 49.8533 },
  { circuitId: 18, raceId: "singapore-gp", name: "Marina Bay Street Circuit", country: "Singapore", city: "Singapore", latitude: 1.2914, longitude: 103.8644 },
  { circuitId: 19, raceId: "united-states-gp", name: "Circuit of the Americas", country: "USA", city: "Austin", latitude: 30.1328, longitude: -97.6411 },
  { circuitId: 20, raceId: "mexican-gp", name: "Autódromo Hermanos Rodríguez", country: "Mexico", city: "Mexico City", latitude: 19.4042, longitude: -99.0907 },
  { circuitId: 21, raceId: "brazilian-gp", name: "Interlagos", country: "Brazil", city: "São Paulo", latitude: -23.7036, longitude: -46.6999 },
  { circuitId: 22, raceId: "las-vegas-gp", name: "Las Vegas Street Circuit", country: "USA", city: "Las Vegas", latitude: 36.1147, longitude: -115.1731 },
  { circuitId: 23, raceId: "qatar-gp", name: "Lusail International Circuit", country: "Qatar", city: "Lusail", latitude: 25.49, longitude: 51.454 },
  { circuitId: 24, raceId: "abu-dhabi-gp", name: "Yas Marina Circuit", country: "UAE", city: "Yas Island", latitude: 24.4672, longitude: 54.6031 },
];

export function geoForRaceId(raceId: string) {
  return SEASON_CIRCUIT_GEO.find((circuit) => circuit.raceId === raceId);
}
