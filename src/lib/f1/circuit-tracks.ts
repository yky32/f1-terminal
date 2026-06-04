import tracksBundle from "@/lib/f1/circuit-tracks.json";

export type CircuitTrackCoordinate = [number, number];

const TRACKS = tracksBundle.tracks as unknown as Record<string, CircuitTrackCoordinate[]>;

/** OSM-derived circuit outlines via bacinger/f1-circuits (see circuit-tracks.json). */
export function getCircuitTrackRoute(raceId: string): CircuitTrackCoordinate[] | null {
  const route = TRACKS[raceId];
  return route && route.length >= 2 ? route : null;
}
