import type {
  CircuitWinnerRow,
  DriverPerformanceRow,
  RaceCircuitInfo,
  RaceResultRow,
  StandingsImpact,
} from "@/lib/data/race-profile";
import { getCircuitMetadata } from "@/lib/f1/circuit-metadata";
import { geoForRaceId } from "@/lib/f1/season-calendar";

const MONACO_HISTORY: CircuitWinnerRow[] = [
  { season: 2024, driverName: "Charles Leclerc", teamName: "Ferrari" },
  { season: 2023, driverName: "Max Verstappen", teamName: "Red Bull Racing" },
  { season: 2022, driverName: "Sergio Pérez", teamName: "Red Bull Racing" },
  { season: 2021, driverName: "Max Verstappen", teamName: "Red Bull Racing" },
  { season: 2019, driverName: "Lewis Hamilton", teamName: "Mercedes" },
];

const AUSTRALIA_HISTORY: CircuitWinnerRow[] = [
  { season: 2024, driverName: "Carlos Sainz", teamName: "Ferrari" },
  { season: 2023, driverName: "Max Verstappen", teamName: "Red Bull Racing" },
  { season: 2022, driverName: "Charles Leclerc", teamName: "Ferrari" },
  { season: 2019, driverName: "Valtteri Bottas", teamName: "Mercedes" },
];

const MONACO_RACE_RESULTS: RaceResultRow[] = [];

const AUSTRALIA_RACE_RESULTS: RaceResultRow[] = [
  { position: 1, driverName: "Carlos Sainz", driverAbbr: "SAI", teamName: "Ferrari", grid: 2, status: "Finished", points: 25 },
  { position: 2, driverName: "Charles Leclerc", driverAbbr: "LEC", teamName: "Ferrari", grid: 1, status: "Finished", points: 18 },
  { position: 3, driverName: "Lando Norris", driverAbbr: "NOR", teamName: "McLaren", grid: 4, status: "Finished", points: 15 },
  { position: 4, driverName: "Oscar Piastri", driverAbbr: "PIA", teamName: "McLaren", grid: 3, status: "Finished", points: 12 },
  { position: 5, driverName: "Max Verstappen", driverAbbr: "VER", teamName: "Red Bull Racing", grid: 5, status: "Finished", points: 10 },
  { position: 6, driverName: "George Russell", driverAbbr: "RUS", teamName: "Mercedes", grid: 6, status: "Finished", points: 8 },
  { position: 7, driverName: "Lewis Hamilton", driverAbbr: "HAM", teamName: "Mercedes", grid: 7, status: "Finished", points: 6 },
  { position: 8, driverName: "Kimi Antonelli", driverAbbr: "ANT", teamName: "Mercedes", grid: 9, status: "Finished", points: 4 },
  { position: 9, driverName: "Alexander Albon", driverAbbr: "ALB", teamName: "Williams", grid: 11, status: "Finished", points: 2 },
  { position: 10, driverName: "Liam Lawson", driverAbbr: "LAW", teamName: "Red Bull Racing", grid: 14, status: "Finished", points: 1 },
];

function performanceFromResults(results: RaceResultRow[]): DriverPerformanceRow[] {
  return results.map((row, index) => ({
    driverId: index + 1,
    driverName: row.driverName,
    driverAbbr: row.driverAbbr,
    teamName: row.teamName,
    grid: row.grid,
    finish: row.position,
    points: row.points,
    positionsGained: row.grid - row.position,
  }));
}

const MONACO_QUALI_PERFORMANCE: DriverPerformanceRow[] = [
  { driverId: 3, driverName: "Charles Leclerc", driverAbbr: "LEC", teamName: "Ferrari", grid: 1, finish: null, points: 0, positionsGained: null },
  { driverId: 2, driverName: "Lando Norris", driverAbbr: "NOR", teamName: "McLaren", grid: 2, finish: null, points: 0, positionsGained: null },
  { driverId: 1, driverName: "Max Verstappen", driverAbbr: "VER", teamName: "Red Bull Racing", grid: 3, finish: null, points: 0, positionsGained: null },
  { driverId: 4, driverName: "Oscar Piastri", driverAbbr: "PIA", teamName: "McLaren", grid: 4, finish: null, points: 0, positionsGained: null },
  { driverId: 5, driverName: "George Russell", driverAbbr: "RUS", teamName: "Mercedes", grid: 5, finish: null, points: 0, positionsGained: null },
  { driverId: 6, driverName: "Lewis Hamilton", driverAbbr: "HAM", teamName: "Ferrari", grid: 6, finish: null, points: 0, positionsGained: null },
  { driverId: 7, driverName: "Kimi Antonelli", driverAbbr: "ANT", teamName: "Mercedes", grid: 7, finish: null, points: 0, positionsGained: null },
  { driverId: 8, driverName: "Carlos Sainz", driverAbbr: "SAI", teamName: "Williams", grid: 8, finish: null, points: 0, positionsGained: null },
];

function standingsImpactAfterRound(round: number): StandingsImpact {
  return {
    round,
    label: `Championship delta after Round ${round}`,
    drivers: [
      { name: "Max Verstappen", pointsBefore: 117, pointsAfter: 142, delta: 25, positionChange: 0 },
      { name: "Lando Norris", pointsBefore: 106, pointsAfter: 124, delta: 18, positionChange: 0 },
      { name: "Oscar Piastri", pointsBefore: 98, pointsAfter: 108, delta: 10, positionChange: 1 },
      { name: "Charles Leclerc", pointsBefore: 94, pointsAfter: 102, delta: 8, positionChange: -1 },
    ],
    constructors: [
      { name: "McLaren", pointsBefore: 192, pointsAfter: 210, delta: 18, positionChange: 0 },
      { name: "Red Bull Racing", pointsBefore: 175, pointsAfter: 190, delta: 15, positionChange: 0 },
      { name: "Ferrari", pointsBefore: 158, pointsAfter: 165, delta: 7, positionChange: 0 },
    ],
  };
}

export function buildRaceCircuitInfo(
  raceId: string,
  country: string,
  city: string,
  circuitName: string,
  length: string | null,
  laps: number | null,
): RaceCircuitInfo {
  const metadata = getCircuitMetadata(raceId);
  const geo = geoForRaceId(raceId);

  return {
    name: circuitName,
    length: length ?? metadata?.lengthDisplay ?? null,
    laps,
    lapRecord: metadata?.lapRecord ?? null,
    lapRecordHolder: metadata?.lapRecordDriver ?? null,
    lapRecordYear: metadata?.lapRecordYear ?? null,
    location: `${city}, ${country}`,
    firstGrandPrix: metadata?.firstGrandPrix ?? null,
    direction: metadata?.direction ?? null,
    circuitType: metadata?.circuitType ?? null,
  };
}

export function getRaceDetailEnrichment(raceId: string, round: number, weekendStatus: string) {
  const isFinished = weekendStatus === "finished";
  const isActive = weekendStatus === "active";

  if (raceId === "australian-gp") {
    return {
      raceResults: AUSTRALIA_RACE_RESULTS,
      driverPerformance: performanceFromResults(AUSTRALIA_RACE_RESULTS),
      circuitHistory: AUSTRALIA_HISTORY,
      standingsImpact: standingsImpactAfterRound(1),
    };
  }

  if (raceId === "monaco-gp") {
    return {
      raceResults: MONACO_RACE_RESULTS,
      driverPerformance: isActive ? MONACO_QUALI_PERFORMANCE : [],
      circuitHistory: MONACO_HISTORY,
      standingsImpact: isActive ? null : standingsImpactAfterRound(round),
    };
  }

  if (isFinished) {
    const results = AUSTRALIA_RACE_RESULTS.map((row, index) => ({
      ...row,
      position: index + 1,
      driverName: row.driverName,
      driverAbbr: row.driverAbbr,
    }));

    return {
      raceResults: results,
      driverPerformance: performanceFromResults(results),
      circuitHistory: AUSTRALIA_HISTORY.slice(0, 3),
      standingsImpact: standingsImpactAfterRound(round),
    };
  }

  return {
    raceResults: [],
    driverPerformance: [],
    circuitHistory: [],
    standingsImpact: null,
  };
}
