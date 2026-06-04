import "server-only";

import type { F1DataProvider } from "@/lib/data/provider";
import { createApiSportsProvider } from "@/lib/data/providers/apisports/client";
import { createMockProvider } from "@/lib/data/providers/mock/client";
import type { DataProviderId } from "@/lib/data/types";

export const DATA_PROVIDER_IDS = ["mock", "api-sports"] as const satisfies readonly DataProviderId[];

function resolveProviderId(): DataProviderId {
  const configured = process.env.DATA_PROVIDER?.trim();
  if (configured === "mock" || configured === "api-sports") {
    return configured;
  }

  if (configured === "apisports") {
    console.warn('[data] DATA_PROVIDER=apisports is deprecated — use DATA_PROVIDER=api-sports');
    return "api-sports";
  }

  if (configured === "rest") {
    console.warn('[data] "rest" is deprecated — use DATA_PROVIDER=api-sports with API_SPORTS_KEY');
  }

  if (configured) {
    console.warn(`[data] Unknown DATA_PROVIDER "${configured}", using mock`);
  }

  return "mock";
}

/** Active provider from DATA_PROVIDER env (server-only). */
export function getDataProvider(): F1DataProvider {
  const id = resolveProviderId();

  if (id === "api-sports") {
    const apiKey = process.env.API_SPORTS_KEY?.trim();
    if (!apiKey) {
      console.warn("[data] API_SPORTS_KEY missing — falling back to mock provider");
      return createMockProvider();
    }

    return createApiSportsProvider(apiKey);
  }

  return createMockProvider();
}

export function listDataProviderIds() {
  return DATA_PROVIDER_IDS;
}
