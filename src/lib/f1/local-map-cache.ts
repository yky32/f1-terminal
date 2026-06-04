import type { LiveCircuitsBothResponse } from "@/lib/data/live-circuit-activity";

const STORAGE_KEY = "f1-terminal.mapSnapshot.v1";

type StoredMapSnapshot = {
  cachedAt: number;
  value: LiveCircuitsBothResponse;
};

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function readCachedMapSnapshot(): {
  snapshot: LiveCircuitsBothResponse;
  cachedAt: number;
} | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;

  const entry = parsed as Partial<StoredMapSnapshot>;
  if (!entry.cachedAt || typeof entry.cachedAt !== "number") return null;
  if (!entry.value || typeof entry.value !== "object") return null;

  return { snapshot: entry.value as LiveCircuitsBothResponse, cachedAt: entry.cachedAt };
}

export function writeCachedMapSnapshot(snapshot: LiveCircuitsBothResponse) {
  if (typeof window === "undefined") return;

  const payload: StoredMapSnapshot = { cachedAt: Date.now(), value: snapshot };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Best-effort — ignore quota errors.
  }
}
