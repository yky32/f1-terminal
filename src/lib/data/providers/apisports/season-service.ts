import "server-only";

import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { GlobalOverviewPayload, GlobalRaceCalendarEntry, RegionRaceStat } from "@/lib/data/global-overview";
import type { LiveSession, WeekendStatus } from "@/lib/data/live-session";
import { sessionTypeFromApi } from "@/lib/data/live-session";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import type { LiveCircuitsSnapshot } from "@/lib/data/provider";
import type {
  ConstructorStandingRow,
  DriverStandingRow,
  DriverPerformanceRow,
  FastestLapRow,
  LapLeaderRow,
  RaceProfile,
  RaceResultRow,
  RaceSession,
} from "@/lib/data/race-profile";
import { RACE_REGION_LABELS, type RaceRegion } from "@/lib/data/race-profile";
import type {
  ApiSportsCircuit,
  ApiSportsDriverRanking,
  ApiSportsFastestLapRanking,
  ApiSportsRace,
  ApiSportsSessionRanking,
  ApiSportsTeamRanking,
} from "@/lib/f1/api-sports-types";
import { GLOBAL_SEASON, geoForRaceId } from "@/lib/f1/season-calendar";
import {
  buildRaceCatalogShell,
  getCatalogEntryByCompetitionId,
  getCatalogEntryById,
  RACE_CATALOG,
} from "@/lib/f1/race-catalog";
import { normalizeRaceProfile } from "@/lib/data/normalize-race-profile";
import { ApiSportsClient } from "@/lib/data/providers/apisports/http-client";
import { readApiSportsCache } from "@/lib/data/providers/apisports/cache";
import { API_SPORTS_FREE_TIER_SEASONS, API_SPORTS_PATHS } from "@/lib/f1/api-sports-endpoints";

type WeekendBundle = {
  competitionId: number;
  raceId: string;
  round: number;
  sessions: ApiSportsRace[];
  weekendStatus: WeekendStatus;
  raceSession: ApiSportsRace | null;
};

export type ApiSportsSeasonBundle = {
  season: number;
  races: ApiSportsRace[];
  weekends: WeekendBundle[];
  driverStandings: DriverStandingRow[];
  constructorStandings: ConstructorStandingRow[];
  circuitsById: Map<number, ApiSportsCircuit>;
  liveSessions: LiveSession[];
  updatedAt: string;
};

const SESSION_ORDER = new Map<string, number>([
  ["1st Practice", 1],
  ["2nd Practice", 2],
  ["3rd Practice", 3],
  ["Sprint Qualifying", 4],
  ["Sprint", 5],
  ["1st Qualifying", 6],
  ["2nd Qualifying", 7],
  ["3rd Qualifying", 8],
  ["Race", 9],
]);

function sortSessions(a: ApiSportsRace, b: ApiSportsRace) {
  const left = SESSION_ORDER.get(a.type) ?? 99;
  const right = SESSION_ORDER.get(b.type) ?? 99;
  if (left !== right) return left - right;
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export function weekendStatusFromSessions(sessions: ApiSportsRace[]): WeekendStatus {
  if (sessions.some((session) => session.status === "Live")) {
    return "active";
  }

  const raceSession = sessions.find((session) => session.type === "Race") ?? null;
  if (raceSession?.status === "Completed") {
    return "finished";
  }

  const hasCompleted = sessions.some((session) => session.status === "Completed");
  const hasScheduled = sessions.some((session) => session.status === "Scheduled");

  if (hasCompleted && hasScheduled) {
    return "active";
  }

  if (hasScheduled) {
    return "upcoming";
  }

  if (hasCompleted) {
    return "finished";
  }

  return "upcoming";
}

function toDriverStandings(rows: ApiSportsDriverRanking[]): DriverStandingRow[] {
  return rows.map((row) => ({
    position: row.position,
    driverId: row.driver.id,
    driverName: row.driver.name,
    driverAbbr: row.driver.abbr,
    driverNumber: row.driver.number,
    driverImage: row.driver.image,
    teamId: row.team.id,
    teamName: row.team.name,
    teamLogo: row.team.logo,
    points: row.points,
    wins: row.wins,
  }));
}

function toConstructorStandings(rows: ApiSportsTeamRanking[]): ConstructorStandingRow[] {
  return rows.map((row) => ({
    position: row.position,
    teamId: row.team.id,
    teamName: row.team.name,
    teamLogo: row.team.logo,
    points: row.points,
    wins: row.wins ?? 0,
  }));
}

function parseGridValue(grid: string | number | null | undefined): number | null {
  if (grid == null || grid === "") return null;
  const parsed = typeof grid === "number" ? grid : Number.parseInt(grid, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toRaceSession(session: ApiSportsRace): RaceSession {
  return {
    id: session.id,
    type: sessionTypeFromApi(session.type),
    typeLabel: session.type,
    date: session.date,
    status: session.status,
    lapsCurrent: session.laps?.current ?? null,
    lapsTotal: session.laps?.total ?? null,
  };
}

function toLiveSession(
  session: ApiSportsRace,
  weekend: WeekendBundle,
): LiveSession | null {
  const catalog = getCatalogEntryByCompetitionId(session.competition.id);
  const geo = catalog ? geoForRaceId(catalog.id) : null;
  if (!catalog || !geo) return null;

  return {
    id: session.id,
    raceId: catalog.id,
    sessionType: sessionTypeFromApi(session.type),
    typeLabel: session.type,
    meetingName: catalog.name,
    circuit: geo.name,
    circuitId: geo.circuitId,
    country: catalog.country,
    city: catalog.city,
    latitude: geo.latitude,
    longitude: geo.longitude,
    status: session.status,
    statusShort:
      session.status === "Live"
        ? "LIVE"
        : session.status === "Completed"
          ? "FIN"
          : "SCH",
    startTime: session.date,
    weekendStatus: weekend.weekendStatus,
    round: weekend.round,
    season: session.season,
    lapsCurrent: session.laps?.current ?? null,
    lapsTotal: session.laps?.total ?? null,
  };
}

function mapRaceResults(rows: ApiSportsSessionRanking[]): RaceResultRow[] {
  return rows
    .filter((row) => row.position != null)
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .map((row) => ({
      position: row.position!,
      driverId: row.driver.id,
      driverName: row.driver.name,
      driverAbbr: row.driver.abbr,
      driverImage: row.driver.image,
      teamId: row.team.id,
      teamName: row.team.name,
      grid: parseGridValue(row.grid) ?? row.position!,
      status: row.status ?? "Finished",
      points: row.points ?? 0,
    }));
}

function mapDriverPerformance(rows: ApiSportsSessionRanking[]): DriverPerformanceRow[] {
  return rows
    .filter((row) => row.position != null && parseGridValue(row.grid) != null)
    .map((row) => {
      const grid = parseGridValue(row.grid)!;
      const finish = row.position!;

      return {
        driverId: row.driver.id,
        driverName: row.driver.name,
        driverAbbr: row.driver.abbr,
        driverImage: row.driver.image,
        teamId: row.team.id,
        teamName: row.team.name,
        grid,
        finish,
        points: row.points ?? 0,
        positionsGained: grid - finish,
      };
    });
}

function mapLapLeaders(rows: ApiSportsSessionRanking[]): LapLeaderRow[] {
  return rows
    .filter((row) => row.position != null)
    .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
    .slice(0, 10)
    .map((row, index) => ({
      position: row.position ?? index + 1,
      driverId: row.driver.id,
      driverName: row.driver.name,
      driverImage: row.driver.image,
      teamId: row.team.id,
      teamName: row.team.name,
      gap: index === 0 ? "Leader" : row.gap ?? row.time ?? "—",
      lastLap: row.time ?? "—",
    }));
}

function mapFastestLaps(rows: ApiSportsFastestLapRanking[]): FastestLapRow[] {
  return rows
    .sort((a, b) => a.position - b.position)
    .map((row) => ({
      position: row.position,
      driverId: row.driver.id,
      driverName: row.driver.name,
      driverImage: row.driver.image,
      teamId: row.team.id,
      teamName: row.team.name,
      time: row.time,
      lap: row.lap,
    }));
}

function buildWeekends(races: ApiSportsRace[]): WeekendBundle[] {
  const grouped = new Map<number, ApiSportsRace[]>();

  for (const race of races) {
    const competitionId = race.competition.id;
    const list = grouped.get(competitionId) ?? [];
    list.push(race);
    grouped.set(competitionId, list);
  }

  const raceSessions = races
    .filter((session) => session.type === "Race")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const roundByCompetition = new Map<number, number>(
    raceSessions.map((session, index) => [session.competition.id, index + 1]),
  );

  const weekends: WeekendBundle[] = [];

  for (const [competitionId, sessions] of grouped) {
    const catalog = getCatalogEntryByCompetitionId(competitionId);
    if (!catalog) continue;

    const sorted = [...sessions].sort(sortSessions);
    weekends.push({
      competitionId,
      raceId: catalog.id,
      round: roundByCompetition.get(competitionId) ?? catalog.round,
      sessions: sorted,
      weekendStatus: weekendStatusFromSessions(sorted),
      raceSession: sorted.find((session) => session.type === "Race") ?? null,
    });
  }

  return weekends.sort((a, b) => a.round - b.round);
}

async function trySeasonYear(client: ApiSportsClient, season: number) {
  try {
    const races = await client.get<ApiSportsRace>(API_SPORTS_PATHS.races, { season });
    return races.length > 0 ? season : null;
  } catch {
    return null;
  }
}

async function resolveSeasonYear(client: ApiSportsClient): Promise<number> {
  const configured = process.env.API_SPORTS_SEASON?.trim();
  if (configured) {
    const season = Number(configured);
    if (Number.isFinite(season)) {
      const races = await client.get<ApiSportsRace>(API_SPORTS_PATHS.races, { season });
      if (races.length > 0) {
        return season;
      }
    }
  }

  const preferred = Number(process.env.API_SPORTS_SEASON?.trim() || GLOBAL_SEASON);
  const candidates = [...new Set([preferred, ...API_SPORTS_FREE_TIER_SEASONS])];

  for (const season of candidates) {
    const resolved = await trySeasonYear(client, season);
    if (resolved != null) {
      return resolved;
    }
  }

  return preferred;
}

async function loadApiSportsSeasonBundleFresh(
  client: ApiSportsClient,
): Promise<ApiSportsSeasonBundle> {
  const season = await resolveSeasonYear(client);

  // Parallel call sites are OK — http-client queues requests per API-Sports architecture.
  const [races, driverRankings, teamRankings, circuits] = await Promise.all([
    client.get<ApiSportsRace>(API_SPORTS_PATHS.races, { season }),
    client.get<ApiSportsDriverRanking>(API_SPORTS_PATHS.rankingsDrivers, { season }),
    client.get<ApiSportsTeamRanking>(API_SPORTS_PATHS.rankingsTeams, { season }),
    client.get<ApiSportsCircuit>(API_SPORTS_PATHS.circuits),
  ]);

  const weekends = buildWeekends(races);
  const liveSessions = weekends.flatMap((weekend) =>
    weekend.sessions
      .map((session) => toLiveSession(session, weekend))
      .filter((session): session is LiveSession => session != null),
  );

  return {
    season,
    races,
    weekends,
    driverStandings: toDriverStandings(driverRankings),
    constructorStandings: toConstructorStandings(teamRankings),
    circuitsById: new Map(circuits.map((circuit) => [circuit.id, circuit])),
    liveSessions,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadApiSportsSeasonBundle(client: ApiSportsClient): Promise<ApiSportsSeasonBundle> {
  const cacheKey = `season-bundle:${process.env.API_SPORTS_SEASON?.trim() || String(GLOBAL_SEASON)}`;

  return readApiSportsCache(cacheKey, () => loadApiSportsSeasonBundleFresh(client));
}

function weekendForRaceId(bundle: ApiSportsSeasonBundle, raceId: string) {
  return bundle.weekends.find((weekend) => weekend.raceId === raceId) ?? null;
}

function circuitDetails(
  bundle: ApiSportsSeasonBundle,
  raceId: string,
  circuitId: number,
  fallbackName: string,
) {
  const apiCircuit = bundle.circuitsById.get(circuitId);
  const geo = geoForRaceId(raceId);
  const catalog = getCatalogEntryById(raceId);

  return {
    id: circuitId,
    name: apiCircuit?.name ?? geo?.name ?? fallbackName,
    image:
      apiCircuit?.image ??
      (circuitId ? `https://media.api-sports.io/formula-1/circuits/${circuitId}.png` : null),
    length: apiCircuit?.length ?? null,
    laps: apiCircuit?.laps ?? null,
    latitude: geo?.latitude ?? 0,
    longitude: geo?.longitude ?? 0,
    circuitInfo: {
      name: apiCircuit?.name ?? geo?.name ?? fallbackName,
      length: apiCircuit?.length ?? null,
      laps: apiCircuit?.laps ?? null,
      lapRecord: apiCircuit?.lap_record?.time ?? null,
      lapRecordHolder: apiCircuit?.lap_record?.driver ?? null,
      lapRecordYear: apiCircuit?.lap_record?.year ? Number(apiCircuit.lap_record.year) : null,
      location: catalog ? `${catalog.city}, ${catalog.country}` : fallbackName,
      firstGrandPrix: apiCircuit?.first_grand_prix ?? null,
      direction: null,
      circuitType: null,
    },
  };
}

async function fetchSessionRankings(client: ApiSportsClient, sessionId: number) {
  try {
    return await client.get<ApiSportsSessionRanking>(API_SPORTS_PATHS.rankingsRaces, {
      race: sessionId,
    });
  } catch {
    return [];
  }
}

async function fetchFastestLaps(client: ApiSportsClient, sessionId: number) {
  try {
    return await client.get<ApiSportsFastestLapRanking>(API_SPORTS_PATHS.rankingsFastestLaps, {
      race: sessionId,
    });
  } catch {
    return [];
  }
}

export async function buildApiSportsRaceProfile(
  client: ApiSportsClient,
  bundle: ApiSportsSeasonBundle,
  raceId: string,
): Promise<RaceProfile | null> {
  const cacheKey = `race-profile:${bundle.season}:${raceId}`;

  return readApiSportsCache(cacheKey, () =>
    buildApiSportsRaceProfileFresh(client, bundle, raceId),
  );
}

async function buildApiSportsRaceProfileFresh(
  client: ApiSportsClient,
  bundle: ApiSportsSeasonBundle,
  raceId: string,
): Promise<RaceProfile | null> {
  const catalog = getCatalogEntryById(raceId);
  const weekend = weekendForRaceId(bundle, raceId);
  if (!catalog || !weekend) return null;

  const raceSession = weekend.raceSession;
  const circuitId = raceSession?.circuit.id ?? weekend.sessions[0]?.circuit.id ?? catalog.apiCompetitionId;
  const circuit = circuitDetails(bundle, raceId, circuitId, catalog.city);
  const sessions = weekend.sessions.map(toRaceSession);
  const liveSessions = weekend.sessions.filter((session) => session.status === "Live").length;
  const hasSprint = weekend.sessions.some((session) => session.type === "Sprint");

  const rankingSession =
    weekend.sessions.find((session) => session.status === "Live") ??
    [...weekend.sessions].reverse().find((session) => session.status === "Completed") ??
    raceSession;

  const [rankings, fastestLaps, completedRaceRankings] = rankingSession
    ? await Promise.all([
        fetchSessionRankings(client, rankingSession.id),
        rankingSession.type === "Race" && rankingSession.status === "Completed"
          ? fetchFastestLaps(client, rankingSession.id)
          : Promise.resolve([] as ApiSportsFastestLapRanking[]),
        raceSession &&
        raceSession.status === "Completed" &&
        raceSession.id !== rankingSession.id
          ? fetchSessionRankings(client, raceSession.id)
          : Promise.resolve([] as ApiSportsSessionRanking[]),
      ])
    : [[], [], []];

  const raceResultRows =
    raceSession && raceSession.status === "Completed"
      ? mapRaceResults(
          raceSession.id === rankingSession?.id ? rankings : completedRaceRankings,
        )
      : mapRaceResults(rankings);

  const profile: RaceProfile = {
    id: catalog.id,
    apiCompetitionId: catalog.apiCompetitionId,
    name: catalog.name,
    shortName: catalog.shortName,
    season: bundle.season,
    round: weekend.round,
    region: catalog.region,
    country: catalog.country,
    city: catalog.city,
    circuit: {
      id: circuit.id,
      name: circuit.name,
      image: circuit.image,
      length: circuit.length,
      laps: circuit.laps,
      latitude: circuit.latitude,
      longitude: circuit.longitude,
    },
    weekendStatus: weekend.weekendStatus,
    liveSessions,
    hasSprint,
    sessions,
    driverStandings: bundle.driverStandings.slice(0, 10),
    constructorStandings: bundle.constructorStandings.slice(0, 5),
    fastestLaps: mapFastestLaps(fastestLaps),
    lapLeaders: mapLapLeaders(rankings),
    weather: null,
    circuitInfo: circuit.circuitInfo,
    raceResults: raceResultRows,
    driverPerformance: mapDriverPerformance(
      raceSession && raceSession.status === "Completed"
        ? raceSession.id === rankingSession?.id
          ? rankings
          : completedRaceRankings
        : rankings,
    ),
    circuitHistory: [],
    standingsImpact: null,
  };

  return normalizeRaceProfile(profile);
}

export function buildApiSportsRaceCatalog(bundle: ApiSportsSeasonBundle): RaceProfile[] {
  return RACE_CATALOG.map((entry) => {
    const shell = buildRaceCatalogShell(entry);
    const weekend = weekendForRaceId(bundle, entry.id);

    if (!weekend) {
      return shell;
    }

    return {
      ...shell,
      season: bundle.season,
      round: weekend.round,
      weekendStatus: weekend.weekendStatus,
      liveSessions: weekend.sessions.filter((session) => session.status === "Live").length,
      sessions: weekend.sessions.map(toRaceSession),
      driverStandings: bundle.driverStandings.slice(0, 10),
      constructorStandings: bundle.constructorStandings.slice(0, 5),
    };
  });
}

export function buildApiSportsMapSnapshot(
  bundle: ApiSportsSeasonBundle,
  mode: MapSessionMode,
): LiveCircuitsSnapshot {
  const sessions =
    mode === "live"
      ? bundle.liveSessions.filter((session) => session.status === "Live")
      : bundle.liveSessions.filter((session) => session.status === "Scheduled");

  const sessionsByCircuit: Record<string, LiveSession[]> = {};
  const circuitMap = new Map<number, CircuitActivity>();

  for (const session of sessions) {
    const key = String(session.circuitId);
    sessionsByCircuit[key] ??= [];
    sessionsByCircuit[key].push(session);

    const existing = circuitMap.get(session.circuitId);
    if (existing) {
      existing.sessionCount += 1;
      if (session.weekendStatus === "active") {
        existing.weekendStatus = "active";
      }
    } else {
      circuitMap.set(session.circuitId, {
        circuitId: session.circuitId,
        raceId: session.raceId,
        name: session.circuit,
        country: session.country,
        city: session.city,
        longitude: session.longitude,
        latitude: session.latitude,
        sessionCount: 1,
        weekendStatus: session.weekendStatus,
      });
    }
  }

  return {
    mode,
    circuits: [...circuitMap.values()],
    sessionsByCircuit,
    updatedAt: bundle.updatedAt,
    provider: "api-sports",
  };
}

function buildRegionStats(bundle: ApiSportsSeasonBundle): RegionRaceStat[] {
  const regions = Object.keys(RACE_REGION_LABELS) as RaceRegion[];

  return regions.map((region) => {
    const races = RACE_CATALOG.filter((race) => race.region === region);
    const circuits = races.map((race) => geoForRaceId(race.id)).filter(Boolean);

    return {
      region,
      label: RACE_REGION_LABELS[region],
      raceCount: races.length,
      circuitCount: circuits.length,
      liveWeekends: bundle.weekends.filter(
        (weekend) =>
          getCatalogEntryById(weekend.raceId)?.region === region &&
          weekend.weekendStatus === "active",
      ).length,
    };
  });
}

export function buildApiSportsGlobalOverview(bundle: ApiSportsSeasonBundle): GlobalOverviewPayload {
  const leader = bundle.driverStandings[0];
  const activeWeekend =
    bundle.weekends.find((weekend) => weekend.weekendStatus === "active") ??
    bundle.weekends.find((weekend) => weekend.weekendStatus === "upcoming") ??
    bundle.weekends[bundle.weekends.length - 1];

  const activeCatalog = activeWeekend ? getCatalogEntryById(activeWeekend.raceId) : null;
  const activeGeo = activeWeekend ? geoForRaceId(activeWeekend.raceId) : null;
  const liveSessions = activeWeekend
    ? bundle.liveSessions.filter(
        (session) => session.raceId === activeWeekend.raceId && session.status === "Live",
      )
    : [];
  const nextSession = activeWeekend
    ? bundle.liveSessions
        .filter(
          (session) =>
            session.raceId === activeWeekend.raceId && session.status === "Scheduled",
        )
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]
    : undefined;

  const calendar: GlobalRaceCalendarEntry[] = bundle.weekends
    .map((weekend) => {
      const catalog = getCatalogEntryById(weekend.raceId);
      const geo = geoForRaceId(weekend.raceId);
      if (!catalog) return null;

      return {
        id: catalog.id,
        round: weekend.round,
        name: catalog.name,
        shortName: catalog.shortName,
        country: catalog.country,
        city: catalog.city,
        region: catalog.region,
        weekendStatus: weekend.weekendStatus,
        raceDate: weekend.raceSession?.date ?? weekend.sessions.at(-1)?.date ?? new Date().toISOString(),
        circuitId: geo?.circuitId ?? catalog.apiCompetitionId,
      } satisfies GlobalRaceCalendarEntry;
    })
    .filter((entry): entry is GlobalRaceCalendarEntry => entry != null);

  const allMarkers: CircuitActivity[] = RACE_CATALOG.map((entry) => {
    const geo = geoForRaceId(entry.id);
    const weekend = weekendForRaceId(bundle, entry.id);
    if (!geo) {
      throw new Error(`Missing circuit geo for ${entry.id}`);
    }

    const liveCount = bundle.liveSessions.filter(
      (session) => session.raceId === entry.id && session.status === "Live",
    ).length;
    const upcomingCount = bundle.liveSessions.filter(
      (session) => session.raceId === entry.id && session.status === "Scheduled",
    ).length;

    return {
      circuitId: geo.circuitId,
      raceId: entry.id,
      name: geo.name,
      country: geo.country,
      city: geo.city,
      longitude: geo.longitude,
      latitude: geo.latitude,
      sessionCount: liveCount > 0 ? liveCount : upcomingCount,
      weekendStatus: weekend?.weekendStatus ?? "finished",
    };
  });

  return {
    season: bundle.season,
    championship: leader
      ? {
          season: bundle.season,
          seasonLabel: `${bundle.season} FIA Formula One World Championship`,
          driverId: leader.driverId,
          driverName: leader.driverName,
          driverAbbr: leader.driverAbbr,
          driverImage: leader.driverImage,
          teamName: leader.teamName,
          teamId: leader.teamId,
          teamLogo: leader.teamLogo,
          points: leader.points,
          wins: leader.wins,
        }
      : {
          season: bundle.season,
          seasonLabel: `${bundle.season} FIA Formula One World Championship`,
          driverName: "—",
          driverAbbr: "—",
          teamName: "—",
          points: 0,
          wins: 0,
        },
    circuits: allMarkers,
    calendar,
    weekendHighlight: activeCatalog && activeGeo && activeWeekend
      ? {
          raceId: activeCatalog.id,
          name: activeCatalog.name,
          shortName: activeCatalog.shortName,
          round: activeWeekend.round,
          country: activeCatalog.country,
          city: activeCatalog.city,
          circuitName: activeGeo.name,
          weekendStatus: activeWeekend.weekendStatus,
          liveSessions: liveSessions.length,
          nextSessionLabel: nextSession?.typeLabel ?? liveSessions[0]?.typeLabel ?? null,
          nextSessionStart: nextSession?.startTime ?? liveSessions[0]?.startTime ?? null,
        }
      : {
          raceId: RACE_CATALOG[0].id,
          name: RACE_CATALOG[0].name,
          shortName: RACE_CATALOG[0].shortName,
          round: RACE_CATALOG[0].round,
          country: RACE_CATALOG[0].country,
          city: RACE_CATALOG[0].city,
          circuitName: geoForRaceId(RACE_CATALOG[0].id)?.name ?? RACE_CATALOG[0].city,
          weekendStatus: "upcoming" as const,
          liveSessions: 0,
          nextSessionLabel: null,
          nextSessionStart: null,
        },
    driverStandings: bundle.driverStandings.slice(0, 10),
    constructorStandings: bundle.constructorStandings.slice(0, 5),
    regionStats: buildRegionStats(bundle),
    updatedAt: bundle.updatedAt,
    provider: "api-sports",
  };
}
