import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { LiveSession } from "@/lib/data/live-session";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import type {
  ConstructorStandingRow,
  DriverStandingRow,
  FastestLapRow,
  LapLeaderRow,
  RaceProfile,
  WeatherSummary,
} from "@/lib/data/race-profile";
import { RACE_CATALOG } from "@/lib/f1/race-catalog";
import type { LiveCircuitsSnapshot } from "@/lib/data/provider";

type CircuitGeo = {
  circuitId: number;
  raceId: string;
  name: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
};

/** Circuit coordinates for map pins — not always present in API-Sports; enrich locally. */
export const CIRCUIT_GEO: CircuitGeo[] = [
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
];

const MOCK_DRIVER_STANDINGS: DriverStandingRow[] = [
  { position: 1, driverId: 1, driverName: "Max Verstappen", driverAbbr: "VER", driverNumber: 1, teamId: 1, teamName: "Red Bull Racing", points: 136, wins: 4 },
  { position: 2, driverId: 2, driverName: "Lando Norris", driverAbbr: "NOR", driverNumber: 4, teamId: 2, teamName: "McLaren", points: 118, wins: 1 },
  { position: 3, driverId: 3, driverName: "Charles Leclerc", driverAbbr: "LEC", driverNumber: 16, teamId: 3, teamName: "Ferrari", points: 98, wins: 0 },
  { position: 4, driverId: 4, driverName: "Oscar Piastri", driverAbbr: "PIA", driverNumber: 81, teamId: 2, teamName: "McLaren", points: 92, wins: 1 },
  { position: 5, driverId: 5, driverName: "George Russell", driverAbbr: "RUS", driverNumber: 63, teamId: 4, teamName: "Mercedes", points: 84, wins: 1 },
];

const MOCK_CONSTRUCTOR_STANDINGS: ConstructorStandingRow[] = [
  { position: 1, teamId: 2, teamName: "McLaren", points: 210, wins: 2 },
  { position: 2, teamId: 1, teamName: "Red Bull Racing", points: 190, wins: 4 },
  { position: 3, teamId: 3, teamName: "Ferrari", points: 165, wins: 0 },
  { position: 4, teamId: 4, teamName: "Mercedes", points: 142, wins: 1 },
  { position: 5, teamId: 5, teamName: "Aston Martin", points: 58, wins: 0 },
];

const MONACO_WEATHER: WeatherSummary = {
  airTempC: 22,
  trackTempC: 38,
  condition: "Partly cloudy",
  rainProbability: 15,
  wind: "12 km/h NE",
};

const MONACO_LAP_LEADERS: LapLeaderRow[] = [
  { position: 1, driverName: "Charles Leclerc", teamName: "Ferrari", gap: "Leader", lastLap: "1:12.909" },
  { position: 2, driverName: "Lando Norris", teamName: "McLaren", gap: "+0.412", lastLap: "1:13.021" },
  { position: 3, driverName: "Max Verstappen", teamName: "Red Bull Racing", gap: "+0.891", lastLap: "1:13.104" },
  { position: 4, driverName: "Oscar Piastri", teamName: "McLaren", gap: "+1.204", lastLap: "1:13.188" },
  { position: 5, driverName: "George Russell", teamName: "Mercedes", gap: "+1.887", lastLap: "1:13.301" },
];

const MONACO_FASTEST_LAPS: FastestLapRow[] = [
  { position: 1, driverName: "Charles Leclerc", teamName: "Ferrari", time: "1:12.909", lap: 14 },
  { position: 2, driverName: "Max Verstappen", teamName: "Red Bull Racing", time: "1:13.011", lap: 13 },
  { position: 3, driverName: "Lando Norris", teamName: "McLaren", time: "1:13.045", lap: 15 },
];

function geoForRace(raceId: string) {
  return CIRCUIT_GEO.find((circuit) => circuit.raceId === raceId);
}

function buildSessions(): LiveSession[] {
  const now = Date.now();
  const inHours = (hours: number) => new Date(now + hours * 3_600_000).toISOString();
  const agoHours = (hours: number) => new Date(now - hours * 3_600_000).toISOString();

  return [
    {
      id: 801,
      raceId: "monaco-gp",
      sessionType: "FP3",
      typeLabel: "3rd Practice",
      meetingName: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      circuitId: 8,
      country: "Monaco",
      city: "Monte Carlo",
      latitude: 43.7347,
      longitude: 7.4206,
      status: "Live",
      statusShort: "LIVE",
      startTime: agoHours(0.5),
      weekendStatus: "active",
      round: 8,
      season: 2025,
      lapsCurrent: 12,
      lapsTotal: null,
    },
    {
      id: 802,
      raceId: "monaco-gp",
      sessionType: "Q",
      typeLabel: "1st Qualifying",
      meetingName: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      circuitId: 8,
      country: "Monaco",
      city: "Monte Carlo",
      latitude: 43.7347,
      longitude: 7.4206,
      status: "Scheduled",
      statusShort: "SCH",
      startTime: inHours(4),
      weekendStatus: "active",
      round: 8,
      season: 2025,
      lapsCurrent: null,
      lapsTotal: null,
    },
    {
      id: 803,
      raceId: "monaco-gp",
      sessionType: "R",
      typeLabel: "Race",
      meetingName: "Monaco Grand Prix",
      circuit: "Circuit de Monaco",
      circuitId: 8,
      country: "Monaco",
      city: "Monte Carlo",
      latitude: 43.7347,
      longitude: 7.4206,
      status: "Scheduled",
      statusShort: "SCH",
      startTime: inHours(28),
      weekendStatus: "active",
      round: 8,
      season: 2025,
      lapsCurrent: null,
      lapsTotal: 78,
    },
    {
      id: 901,
      raceId: "canadian-gp",
      sessionType: "FP1",
      typeLabel: "1st Practice",
      meetingName: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      circuitId: 9,
      country: "Canada",
      city: "Montreal",
      latitude: 45.5008,
      longitude: -73.5228,
      status: "Scheduled",
      statusShort: "SCH",
      startTime: inHours(96),
      weekendStatus: "upcoming",
      round: 9,
      season: 2025,
      lapsCurrent: null,
      lapsTotal: null,
    },
    {
      id: 902,
      raceId: "canadian-gp",
      sessionType: "Q",
      typeLabel: "1st Qualifying",
      meetingName: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      circuitId: 9,
      country: "Canada",
      city: "Montreal",
      latitude: 45.5008,
      longitude: -73.5228,
      status: "Scheduled",
      statusShort: "SCH",
      startTime: inHours(120),
      weekendStatus: "upcoming",
      round: 9,
      season: 2025,
      lapsCurrent: null,
      lapsTotal: null,
    },
    {
      id: 903,
      raceId: "canadian-gp",
      sessionType: "R",
      typeLabel: "Race",
      meetingName: "Canadian Grand Prix",
      circuit: "Circuit Gilles Villeneuve",
      circuitId: 9,
      country: "Canada",
      city: "Montreal",
      latitude: 45.5008,
      longitude: -73.5228,
      status: "Scheduled",
      statusShort: "SCH",
      startTime: inHours(144),
      weekendStatus: "upcoming",
      round: 9,
      season: 2025,
      lapsCurrent: null,
      lapsTotal: 70,
    },
  ];
}

const ALL_SESSIONS = buildSessions();

function buildSnapshot(mode: MapSessionMode): LiveCircuitsSnapshot {
  const sessions =
    mode === "live"
      ? ALL_SESSIONS.filter((session) => session.status === "Live")
      : ALL_SESSIONS.filter((session) => session.status === "Scheduled");

  const sessionsByCircuit: Record<string, LiveSession[]> = {};
  const circuitMap = new Map<number, CircuitActivity>();

  for (const session of sessions) {
    const key = String(session.circuitId);
    sessionsByCircuit[key] ??= [];
    sessionsByCircuit[key].push(session);

    const geo = geoForRace(session.raceId);
    if (!geo) continue;

    const existing = circuitMap.get(session.circuitId);
    if (existing) {
      existing.sessionCount += 1;
      if (session.weekendStatus === "active") existing.weekendStatus = "active";
    } else {
      circuitMap.set(session.circuitId, {
        circuitId: session.circuitId,
        raceId: session.raceId,
        name: geo.name,
        country: geo.country,
        city: geo.city,
        longitude: geo.longitude,
        latitude: geo.latitude,
        sessionCount: 1,
        weekendStatus: session.weekendStatus,
      });
    }
  }

  return {
    mode,
    circuits: [...circuitMap.values()],
    sessionsByCircuit,
    updatedAt: new Date().toISOString(),
    provider: "mock",
  };
}

export function getMockMapCircuits(mode: MapSessionMode): LiveCircuitsSnapshot {
  return buildSnapshot(mode);
}

export function getMockRaceProfile(raceId: string): RaceProfile | null {
  const entry = RACE_CATALOG.find((race) => race.id === raceId);
  const geo = geoForRace(raceId);
  if (!entry || !geo) return null;

  const sessionsForRace = ALL_SESSIONS.filter((session) => session.raceId === raceId);
  const isMonaco = raceId === "monaco-gp";
  const isCanada = raceId === "canadian-gp";

  const monacoSessions = [
    { id: 791, type: "FP1" as const, typeLabel: "1st Practice", date: new Date(Date.now() - 48 * 3_600_000).toISOString(), status: "Completed" as const, lapsCurrent: null, lapsTotal: null },
    { id: 792, type: "FP2" as const, typeLabel: "2nd Practice", date: new Date(Date.now() - 24 * 3_600_000).toISOString(), status: "Completed" as const, lapsCurrent: null, lapsTotal: null },
    { id: 801, type: "FP3" as const, typeLabel: "3rd Practice", date: new Date(Date.now() - 0.5 * 3_600_000).toISOString(), status: "Live" as const, lapsCurrent: 12, lapsTotal: null },
    { id: 802, type: "Q" as const, typeLabel: "1st Qualifying", date: new Date(Date.now() + 4 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: null },
    { id: 803, type: "R" as const, typeLabel: "Race", date: new Date(Date.now() + 28 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: 78 },
  ];

  const canadaSessions = [
    { id: 901, type: "FP1" as const, typeLabel: "1st Practice", date: new Date(Date.now() + 96 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: null },
    { id: 902, type: "FP2" as const, typeLabel: "2nd Practice", date: new Date(Date.now() + 108 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: null },
    { id: 903, type: "FP3" as const, typeLabel: "3rd Practice", date: new Date(Date.now() + 114 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: null },
    { id: 904, type: "Q" as const, typeLabel: "1st Qualifying", date: new Date(Date.now() + 120 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: null },
    { id: 905, type: "R" as const, typeLabel: "Race", date: new Date(Date.now() + 144 * 3_600_000).toISOString(), status: "Scheduled" as const, lapsCurrent: null, lapsTotal: 70 },
  ];

  const finishedSessions = [
    { id: 701, type: "R" as const, typeLabel: "Race", date: new Date(Date.now() - 14 * 24 * 3_600_000).toISOString(), status: "Completed" as const, lapsCurrent: 63, lapsTotal: 63 },
  ];

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
      id: geo.circuitId,
      name: geo.name,
      image: `https://media.api-sports.io/formula-1/circuits/${geo.circuitId}.png`,
      length: isMonaco ? "3.337 km" : isCanada ? "4.361 km" : "5.000 km",
      laps: isMonaco ? 78 : isCanada ? 70 : 58,
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    weekendStatus: entry.weekendStatus,
    liveSessions: sessionsForRace.filter((session) => session.status === "Live").length,
    hasSprint: false,
    sessions: isMonaco ? monacoSessions : isCanada ? canadaSessions : finishedSessions,
    driverStandings: MOCK_DRIVER_STANDINGS,
    constructorStandings: MOCK_CONSTRUCTOR_STANDINGS,
    fastestLaps: isMonaco ? MONACO_FASTEST_LAPS : [],
    lapLeaders: isMonaco ? MONACO_LAP_LEADERS : [],
    weather: isMonaco ? MONACO_WEATHER : isCanada ? { airTempC: 18, trackTempC: 32, condition: "Overcast", rainProbability: 40, wind: "18 km/h SW" } : null,
  };
}

export function getMockWeekendSessions() {
  return ALL_SESSIONS.filter(
    (session) => session.weekendStatus === "active" || session.weekendStatus === "upcoming",
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export function getMockAllCircuitMarkers(): CircuitActivity[] {
  return CIRCUIT_GEO.map((geo) => {
    const entry = RACE_CATALOG.find((race) => race.id === geo.raceId);
    const liveCount = ALL_SESSIONS.filter(
      (session) => session.raceId === geo.raceId && session.status === "Live",
    ).length;
    const upcomingCount = ALL_SESSIONS.filter(
      (session) => session.raceId === geo.raceId && session.status === "Scheduled",
    ).length;

    return {
      circuitId: geo.circuitId,
      raceId: geo.raceId,
      name: geo.name,
      country: geo.country,
      city: geo.city,
      longitude: geo.longitude,
      latitude: geo.latitude,
      sessionCount: liveCount > 0 ? liveCount : upcomingCount,
      weekendStatus: entry?.weekendStatus ?? "finished",
    };
  });
}
