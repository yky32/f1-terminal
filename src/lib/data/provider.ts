import type { MapSessionMode } from "@/lib/data/map-session-mode";
import type { RaceProfile } from "@/lib/data/race-profile";
import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { LiveSession } from "@/lib/data/live-session";
import type { DataProviderId } from "@/lib/data/types";

export type LiveCircuitsSnapshot = {
  mode: MapSessionMode;
  circuits: CircuitActivity[];
  sessionsByCircuit: Record<string, LiveSession[]>;
  updatedAt: string;
  provider: DataProviderId;
};

/** Swap implementations without changing UI or API routes */
export interface F1DataProvider {
  readonly id: DataProviderId;
  getMapCircuits(mode: MapSessionMode): Promise<LiveCircuitsSnapshot>;
  getRaceCatalog(): Promise<RaceProfile[]>;
  getRaceById(raceId: string): Promise<RaceProfile | null>;
}
