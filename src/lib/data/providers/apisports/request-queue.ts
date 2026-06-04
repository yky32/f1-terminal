import "server-only";

import {
  apiSportsDailyQuotaExhausted,
  apiSportsMinuteQuotaExhausted,
} from "@/lib/data/providers/apisports/rate-limit";
import { API_SPORTS_MIN_REQUEST_INTERVAL_MS } from "@/lib/f1/refresh-policy";

function configuredMinInterval() {
  const configured = Number(process.env.API_SPORTS_MIN_REQUEST_INTERVAL_MS?.trim());
  return Number.isFinite(configured) && configured > 0
    ? configured
    : API_SPORTS_MIN_REQUEST_INTERVAL_MS;
}

let chain: Promise<unknown> = Promise.resolve();
let lastRequestAt = 0;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitForSlot() {
  if (apiSportsDailyQuotaExhausted()) {
    throw new Error("API-Sports daily request quota exhausted (x-ratelimit-requests-remaining: 0)");
  }

  if (apiSportsMinuteQuotaExhausted()) {
    await sleep(60_000);
  }

  const minInterval = configuredMinInterval();
  const elapsed = Date.now() - lastRequestAt;

  if (elapsed < minInterval) {
    await sleep(minInterval - elapsed);
  }

  lastRequestAt = Date.now();
}

/** Serialize outbound calls to respect API-Sports per-minute caps. */
export function enqueueApiSportsRequest<T>(task: () => Promise<T>): Promise<T> {
  const next = chain.then(() => waitForSlot()).then(task);
  chain = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}
