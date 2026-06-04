import type { LiveSession } from "@/lib/data/live-session";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import type { WeekendStatus } from "@/lib/data/live-session";

export type CircuitActivity = {
  circuitId: number;
  raceId: string;
  name: string;
  country: string;
  city: string;
  longitude: number;
  latitude: number;
  sessionCount: number;
  weekendStatus: WeekendStatus;
};

export type LiveCircuitsResponse = {
  mode: MapSessionMode;
  circuits: CircuitActivity[];
  sessionsByCircuit: Record<string, LiveSession[]>;
  circuitCount: number;
  totalSessions: number;
  maxSessions: number;
  updatedAt?: string;
  provider?: string;
  error?: string;
};

export type LiveCircuitsBothResponse = {
  live: LiveCircuitsResponse;
  upcoming: LiveCircuitsResponse;
  error?: string;
};

export function getLiveSessionStats(circuits: CircuitActivity[]) {
  const active = circuits.filter((circuit) => circuit.sessionCount > 0);
  const totalSessions = active.reduce((sum, circuit) => sum + circuit.sessionCount, 0);
  const maxSessions = Math.max(...active.map((circuit) => circuit.sessionCount), 1);

  return {
    circuitCount: active.length,
    totalSessions,
    maxSessions,
    circuits: active,
  };
}

export function bubbleDiameter(
  sessionCount: number,
  maxSessions: number,
  minPx = 28,
  maxPx = 80,
) {
  const t = sessionCount / maxSessions;
  return Math.round(minPx + t * (maxPx - minPx));
}
