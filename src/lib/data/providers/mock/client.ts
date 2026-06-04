import type { F1DataProvider } from "@/lib/data/provider";
import {
  getMockGlobalOverview,
  getMockMapCircuits,
  getMockRaceProfile,
} from "@/lib/data/providers/mock/f1-data";
import { getRaceCatalogShells } from "@/lib/f1/race-catalog";

const MOCK_LATENCY_MS = 80;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createMockProvider(): F1DataProvider {
  return {
    id: "mock",

    async getMapCircuits(mode) {
      await delay(MOCK_LATENCY_MS);
      return getMockMapCircuits(mode);
    },

    async getRaceCatalog() {
      await delay(MOCK_LATENCY_MS);
      return getRaceCatalogShells();
    },

    async getRaceById(raceId) {
      await delay(MOCK_LATENCY_MS);
      return getMockRaceProfile(raceId);
    },

    async getGlobalOverview() {
      await delay(MOCK_LATENCY_MS);
      return getMockGlobalOverview();
    },
  };
}
