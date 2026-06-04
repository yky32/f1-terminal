import "server-only";

import type { F1DataProvider } from "@/lib/data/provider";
import { ApiSportsClient } from "@/lib/data/providers/apisports/http-client";
import {
  buildApiSportsGlobalOverview,
  buildApiSportsMapSnapshot,
  buildApiSportsRaceCatalog,
  buildApiSportsRaceProfile,
  loadApiSportsSeasonBundle,
} from "@/lib/data/providers/apisports/season-service";

export function createApiSportsProvider(apiKey: string): F1DataProvider {
  const client = new ApiSportsClient(apiKey);

  return {
    id: "api-sports",

    async getMapCircuits(mode) {
      const bundle = await loadApiSportsSeasonBundle(client);
      return buildApiSportsMapSnapshot(bundle, mode);
    },

    async getRaceCatalog() {
      const bundle = await loadApiSportsSeasonBundle(client);
      return buildApiSportsRaceCatalog(bundle);
    },

    async getRaceById(raceId) {
      const bundle = await loadApiSportsSeasonBundle(client);
      return buildApiSportsRaceProfile(client, bundle, raceId);
    },

    async getGlobalOverview() {
      const bundle = await loadApiSportsSeasonBundle(client);
      return buildApiSportsGlobalOverview(bundle);
    },
  };
}
