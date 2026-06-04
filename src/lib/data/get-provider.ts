import "server-only";

import type { F1DataProvider } from "@/lib/data/provider";
import { createMockProvider } from "@/lib/data/providers/mock/client";
import type { DataProviderId } from "@/lib/data/types";

export const DATA_PROVIDER_IDS = ["mock", "apisports"] as const satisfies readonly DataProviderId[];

function resolveProviderId(): DataProviderId {
  const configured = process.env.DATA_PROVIDER?.trim();
  if (configured === "mock" || configured === "apisports") {
    return configured;
  }

  if (configured === "rest") {
    console.warn('[data] "rest" is deprecated — use DATA_PROVIDER=apisports with API_SPORTS_KEY');
  }

  if (configured) {
    console.warn(`[data] Unknown DATA_PROVIDER "${configured}", using mock`);
  }

  return "mock";
}

/** Active provider from DATA_PROVIDER env (server-only). */
export function getDataProvider(): F1DataProvider {
  const id = resolveProviderId();

  if (id === "apisports") {
    const apiKey = process.env.API_SPORTS_KEY?.trim();
    if (!apiKey) {
      console.warn("[data] API_SPORTS_KEY missing — falling back to mock provider");
      return createMockProvider();
    }

    // Real API-Sports client ships in a follow-up PR — mock keeps dev cost-free.
    console.warn("[data] API-Sports client not wired yet — using mock payloads shaped like API-Sports");
    return createMockProvider();
  }

  return createMockProvider();
}

export function listDataProviderIds() {
  return DATA_PROVIDER_IDS;
}
