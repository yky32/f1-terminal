"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RaceDetailPanel } from "@/components/races/race-detail-panel";
import { RaceHero } from "@/components/races/race-hero";
import {
  racesGlass,
  racesGlassFocus,
  racesGlassHover,
  racesGlassInset,
} from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { RACE_REGION_LABELS } from "@/lib/data/race-profile";
import { FEATURED_RACE_ID } from "@/lib/f1/race-catalog";
import {
  isValidCachedRaceProfile,
  readCachedRaceProfile,
  writeCachedRaceProfile,
} from "@/lib/f1/local-race-cache";
import { RACE_LOCAL_TTL_MS } from "@/lib/f1/refresh-policy";
import { apiRequest } from "@/lib/http/api-client";
import { cn } from "@/lib/utils";

type RacesFeedProps = {
  catalog: RaceProfile[];
  initialRace: RaceProfile | null;
  selectedRaceId?: string | null;
};

type RaceApiResponse = RaceProfile & { error?: string };

export function RacesFeed({
  catalog,
  initialRace,
  selectedRaceId = null,
}: RacesFeedProps) {
  const router = useRouter();
  const resolvedSelectedId =
    selectedRaceId ?? initialRace?.id ?? catalog[0]?.id ?? FEATURED_RACE_ID;

  const [selectedId, setSelectedId] = useState(resolvedSelectedId);
  const [profiles, setProfiles] = useState<Record<string, RaceProfile>>(() => {
    if (!initialRace) return {};
    return { [initialRace.id]: initialRace };
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const loadedRef = useRef<Set<string>>(new Set(initialRace ? [initialRace.id] : []));

  useEffect(() => {
    setSelectedId(resolvedSelectedId);
  }, [resolvedSelectedId]);

  const races = useMemo(
    () => catalog.map((shell) => profiles[shell.id] ?? shell),
    [catalog, profiles],
  );

  const loadRace = useCallback(async (raceId: string) => {
    const cached = readCachedRaceProfile(raceId);
    const cachedFresh = cached ? Date.now() - cached.cachedAt < RACE_LOCAL_TTL_MS : false;

    if (cached && isValidCachedRaceProfile(cached.profile, raceId)) {
      setProfiles((current) => ({ ...current, [raceId]: cached.profile }));
      loadedRef.current.add(raceId);
      if (cachedFresh) return;
    } else if (loadedRef.current.has(raceId)) {
      return;
    }

    setLoadingId(raceId);
    try {
      const { data } = await apiRequest<RaceApiResponse>({
        url: `/api/races/${raceId}`,
      });

      if (data.error || !isValidCachedRaceProfile(data, raceId)) return;

      setProfiles((current) => ({ ...current, [raceId]: data }));
      writeCachedRaceProfile(raceId, data);
      loadedRef.current.add(raceId);
    } finally {
      setLoadingId((current) => (current === raceId ? null : current));
    }
  }, []);

  useEffect(() => {
    void loadRace(selectedId);
  }, [loadRace, selectedId]);

  const selectedRace = races.find((race) => race.id === selectedId) ?? races[0] ?? null;
  const loading =
    loadingId === selectedId &&
    (!selectedRace || !isValidCachedRaceProfile(selectedRace, selectedId));

  return (
    <div className="page-container pb-12">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
        <aside className={cn(racesGlass, "p-3 lg:sticky lg:top-[5.5rem]")}>
          <p className="px-2 pb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            2025 calendar
          </p>
          <div className="max-h-[28rem] space-y-1 overflow-y-auto pr-1">
            {races.map((race) => {
              const active = race.id === selectedId;

              return (
                <button
                  key={race.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(race.id);
                    router.push(`/races/${race.id}`, { scroll: false });
                  }}
                  className={cn(
                    racesGlassInset,
                    racesGlassHover,
                    racesGlassFocus,
                    "flex w-full items-start gap-3 rounded-[1rem] px-3 py-3 text-left transition-colors",
                    active && "ring-1 ring-neutral-900/10",
                  )}
                >
                  <span className="mt-0.5 text-[0.75rem] font-semibold tabular-nums text-neutral-500">
                    R{race.round}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.875rem] font-semibold text-neutral-950">
                      {race.shortName}
                    </span>
                    <span className="mt-0.5 block text-[0.75rem] text-neutral-600">
                      {RACE_REGION_LABELS[race.region]}
                      {race.weekendStatus === "active" ? " · Active" : ""}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4">
          {selectedRace ? (
            <>
              <RaceHero race={selectedRace} loading={loading} />
              <RaceDetailPanel race={selectedRace} loading={loading} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
