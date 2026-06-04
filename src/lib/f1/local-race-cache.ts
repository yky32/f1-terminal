import type { RaceProfile } from "@/lib/data/race-profile";

const STORAGE_PREFIX = "f1-terminal.raceProfile.v1.";

type StoredRaceProfile = {
  cachedAt: number;
  profile: RaceProfile;
};

function safeParse(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function readCachedRaceProfile(raceId: string): {
  profile: RaceProfile;
  cachedAt: number;
} | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${raceId}`);
  if (!raw) return null;

  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return null;

  const entry = parsed as Partial<StoredRaceProfile>;
  if (!entry.cachedAt || typeof entry.cachedAt !== "number") return null;
  if (!entry.profile || typeof entry.profile !== "object") return null;

  return { profile: entry.profile as RaceProfile, cachedAt: entry.cachedAt };
}

export function writeCachedRaceProfile(raceId: string, profile: RaceProfile) {
  if (typeof window === "undefined") return;

  const payload: StoredRaceProfile = { cachedAt: Date.now(), profile };

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${raceId}`, JSON.stringify(payload));
  } catch {
    // Best-effort.
  }
}

export function isValidCachedRaceProfile(profile: RaceProfile, raceId: string) {
  return profile.id === raceId && profile.sessions.length > 0;
}
