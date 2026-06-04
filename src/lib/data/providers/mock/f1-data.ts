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
import type { GlobalOverviewPayload, RegionRaceStat } from "@/lib/data/global-overview";
import { GLOBAL_SEASON, SEASON_CALENDAR, SEASON_CIRCUIT_GEO, geoForRaceId } from "@/lib/f1/season-calendar";
import {
  buildRaceCircuitInfo,
  getRaceDetailEnrichment,
} from "@/lib/data/providers/mock/race-detail-data";
import { RACE_CATALOG } from "@/lib/f1/race-catalog";
import { RACE_REGION_LABELS, type RaceRegion } from "@/lib/data/race-profile";
import type { LiveCircuitsSnapshot } from "@/lib/data/provider";

export const CIRCUIT_GEO = SEASON_CIRCUIT_GEO;

const MOCK_DRIVER_STANDINGS: DriverStandingRow[] = [
  { position: 1, driverId: 1, driverName: "Max Verstappen", driverAbbr: "VER", driverNumber: 1, teamId: 1, teamName: "Red Bull Racing", points: 142, wins: 4 },
  { position: 2, driverId: 2, driverName: "Lando Norris", driverAbbr: "NOR", driverNumber: 4, teamId: 2, teamName: "McLaren", points: 124, wins: 2 },
  { position: 3, driverId: 4, driverName: "Oscar Piastri", driverAbbr: "PIA", driverNumber: 81, teamId: 2, teamName: "McLaren", points: 108, wins: 1 },
  { position: 4, driverId: 3, driverName: "Charles Leclerc", driverAbbr: "LEC", driverNumber: 16, teamId: 3, teamName: "Ferrari", points: 102, wins: 0 },
  { position: 5, driverId: 5, driverName: "George Russell", driverAbbr: "RUS", driverNumber: 63, teamId: 5, teamName: "Mercedes", points: 88, wins: 1 },
  { position: 6, driverId: 6, driverName: "Lewis Hamilton", driverAbbr: "HAM", driverNumber: 44, teamId: 3, teamName: "Ferrari", points: 76, wins: 0 },
  { position: 7, driverId: 7, driverName: "Kimi Antonelli", driverAbbr: "ANT", driverNumber: 12, teamId: 5, teamName: "Mercedes", points: 54, wins: 0 },
  { position: 8, driverId: 8, driverName: "Carlos Sainz", driverAbbr: "SAI", driverNumber: 55, teamId: 12, teamName: "Williams", points: 41, wins: 0 },
  { position: 9, driverId: 9, driverName: "Alexander Albon", driverAbbr: "ALB", driverNumber: 23, teamId: 12, teamName: "Williams", points: 32, wins: 0 },
  { position: 10, driverId: 10, driverName: "Liam Lawson", driverAbbr: "LAW", driverNumber: 30, teamId: 1, teamName: "Red Bull Racing", points: 28, wins: 0 },
];

const MOCK_CONSTRUCTOR_STANDINGS: ConstructorStandingRow[] = [
  { position: 1, teamId: 2, teamName: "McLaren", points: 210, wins: 2 },
  { position: 2, teamId: 1, teamName: "Red Bull Racing", points: 190, wins: 4 },
  { position: 3, teamId: 3, teamName: "Ferrari", points: 165, wins: 0 },
  { position: 4, teamId: 5, teamName: "Mercedes", points: 142, wins: 1 },
  { position: 5, teamId: 17, teamName: "Aston Martin", points: 58, wins: 0 },
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
  return geoForRaceId(raceId);
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
      season: GLOBAL_SEASON,
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
      season: GLOBAL_SEASON,
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
      season: GLOBAL_SEASON,
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
      season: GLOBAL_SEASON,
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
      season: GLOBAL_SEASON,
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
      season: GLOBAL_SEASON,
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

  const circuitLength = isMonaco ? "3.337 km" : isCanada ? "4.361 km" : "5.000 km";
  const circuitLaps = isMonaco ? 78 : isCanada ? 70 : 58;
  const enrichment = getRaceDetailEnrichment(entry.id, entry.round, entry.weekendStatus);

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
      length: circuitLength,
      laps: circuitLaps,
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
    circuitInfo: buildRaceCircuitInfo(
      entry.id,
      entry.country,
      entry.city,
      geo.name,
      circuitLength,
      circuitLaps,
    ),
    raceResults: enrichment.raceResults,
    driverPerformance: enrichment.driverPerformance,
    circuitHistory: enrichment.circuitHistory,
    standingsImpact: enrichment.standingsImpact,
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

function buildRegionStats(): RegionRaceStat[] {
  const regions = Object.keys(RACE_REGION_LABELS) as RaceRegion[];

  return regions.map((region) => {
    const races = SEASON_CALENDAR.filter((race) => race.region === region);
    const circuits = SEASON_CIRCUIT_GEO.filter((geo) =>
      races.some((race) => race.id === geo.raceId),
    );

    return {
      region,
      label: RACE_REGION_LABELS[region],
      raceCount: races.length,
      circuitCount: circuits.length,
      liveWeekends: races.filter((race) => race.weekendStatus === "active").length,
    };
  });
}

function buildCalendarEntries() {
  const now = Date.now();
  const dayMs = 24 * 3_600_000;

  return SEASON_CALENDAR.map((race) => {
    const geo = geoForRaceId(race.id);
    const offset =
      race.weekendStatus === "finished"
        ? -((SEASON_CALENDAR.length - race.round + 2) * 14 * dayMs)
        : race.weekendStatus === "active"
          ? 0
          : (race.round - 8) * 14 * dayMs;

    return {
      id: race.id,
      round: race.round,
      name: race.name,
      shortName: race.shortName,
      country: race.country,
      city: race.city,
      region: race.region,
      weekendStatus: race.weekendStatus,
      raceDate: new Date(now + offset).toISOString(),
      circuitId: geo?.circuitId ?? race.apiCompetitionId,
    };
  });
}

export function getMockGlobalOverview(): GlobalOverviewPayload {
  const leader = MOCK_DRIVER_STANDINGS[0];
  const activeRace =
    SEASON_CALENDAR.find((race) => race.weekendStatus === "active") ??
    SEASON_CALENDAR.find((race) => race.weekendStatus === "upcoming")!;
  const activeGeo = geoForRaceId(activeRace.id)!;
  const liveSessions = ALL_SESSIONS.filter(
    (session) => session.raceId === activeRace.id && session.status === "Live",
  );
  const nextSession = ALL_SESSIONS.filter(
    (session) => session.raceId === activeRace.id && session.status === "Scheduled",
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  return {
    season: GLOBAL_SEASON,
    championship: {
      season: GLOBAL_SEASON,
      seasonLabel: `${GLOBAL_SEASON} FIA Formula One World Championship`,
      driverId: leader.driverId,
      driverName: leader.driverName,
      driverAbbr: leader.driverAbbr,
      teamName: leader.teamName,
      teamId: leader.teamId,
      points: leader.points,
      wins: leader.wins,
    },
    circuits: getMockAllCircuitMarkers(),
    calendar: buildCalendarEntries(),
    weekendHighlight: {
      raceId: activeRace.id,
      name: activeRace.name,
      shortName: activeRace.shortName,
      round: activeRace.round,
      country: activeRace.country,
      city: activeRace.city,
      circuitName: activeGeo.name,
      weekendStatus: activeRace.weekendStatus,
      liveSessions: liveSessions.length,
      nextSessionLabel: nextSession?.typeLabel ?? liveSessions[0]?.typeLabel ?? null,
      nextSessionStart: nextSession?.startTime ?? liveSessions[0]?.startTime ?? null,
    },
    driverStandings: MOCK_DRIVER_STANDINGS,
    constructorStandings: MOCK_CONSTRUCTOR_STANDINGS,
    regionStats: buildRegionStats(),
    updatedAt: new Date().toISOString(),
    provider: "mock",
  };
}
