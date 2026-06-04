"use client";

import { PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RaceCalendarPanel } from "@/components/races/race-calendar-panel";
import { RaceDetailPanel } from "@/components/races/race-detail-panel";
import { RaceHero } from "@/components/races/race-hero";
import { racesGlass, racesGlassFocus, racesGlassInset } from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { normalizeRaceProfile } from "@/lib/data/normalize-race-profile";
import { FEATURED_RACE_ID } from "@/lib/f1/race-catalog";
import {
  readRaceCalendarCollapsed,
  writeRaceCalendarCollapsed,
} from "@/lib/f1/race-calendar-ui";
import {
  isLoadedRaceProfile,
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
    if (!initialRace || !isLoadedRaceProfile(initialRace)) return {};
    return { [initialRace.id]: normalizeRaceProfile(initialRace) };
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [calendarCollapsed, setCalendarCollapsed] = useState(false);
  const loadedRef = useRef<Set<string>>(
    new Set(initialRace && isLoadedRaceProfile(initialRace) ? [initialRace.id] : []),
  );

  useEffect(() => {
    setCalendarCollapsed(readRaceCalendarCollapsed());
  }, []);

  const setCalendarCollapsedPersisted = useCallback((collapsed: boolean) => {
    setCalendarCollapsed(collapsed);
    writeRaceCalendarCollapsed(collapsed);
  }, []);

  useEffect(() => {
    setSelectedId(resolvedSelectedId);
  }, [resolvedSelectedId]);

  const races = useMemo(
    () => catalog.map((shell) => normalizeRaceProfile(profiles[shell.id] ?? shell)),
    [catalog, profiles],
  );

  const loadRace = useCallback(async (raceId: string) => {
    const cached = readCachedRaceProfile(raceId);
    const cachedFresh = cached ? Date.now() - cached.cachedAt < RACE_LOCAL_TTL_MS : false;

    if (cached && isValidCachedRaceProfile(cached.profile, raceId)) {
      setProfiles((current) => ({
        ...current,
        [raceId]: normalizeRaceProfile(cached.profile),
      }));
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

      setProfiles((current) => ({ ...current, [raceId]: normalizeRaceProfile(data) }));
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
    (!selectedRace || !isLoadedRaceProfile(selectedRace));

  const motionReduce = "motion-reduce:transition-none motion-reduce:transform-none";
  const gridMotion = cn(
    "transition-[grid-template-columns,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    motionReduce,
  );
  const shellMotion = cn(
    "transition-[max-height,opacity,filter] duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    motionReduce,
  );
  const panelMotion = cn(
    "transition-[opacity,transform] duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
    motionReduce,
  );
  const revealMotion = cn(
    "transition-[max-height,opacity,margin] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
    motionReduce,
  );

  return (
    <div className="races-page-root page-container pb-12">
      <div
        className={cn(
          "grid grid-cols-1 gap-5 lg:items-start",
          gridMotion,
          calendarCollapsed ? "lg:grid-cols-[0fr_minmax(0,1fr)] lg:gap-0" : "lg:grid-cols-[19.5rem_minmax(0,1fr)]",
        )}
      >
        <aside
          className={cn(
            "min-w-0 overflow-hidden lg:sticky lg:top-[5.5rem]",
            shellMotion,
            calendarCollapsed
              ? "max-h-0 opacity-0 blur-[2px] max-lg:pointer-events-none lg:max-h-[calc(100vh-6.5rem)] lg:opacity-0 lg:delay-0"
              : "max-h-[40rem] opacity-100 blur-0 lg:max-h-[calc(100vh-6.5rem)] lg:delay-75",
          )}
          aria-hidden={calendarCollapsed}
        >
          <div
            className={cn(
              racesGlass,
              "flex max-h-[40rem] w-full flex-col overflow-hidden p-3 lg:max-h-[calc(100vh-6.5rem)] lg:w-[19.5rem] lg:min-w-[19.5rem]",
              panelMotion,
              calendarCollapsed
                ? "pointer-events-none -translate-x-2 scale-[0.985] opacity-0 delay-0"
                : "translate-x-0 scale-100 opacity-100 delay-150",
            )}
          >
            <RaceCalendarPanel
              races={races}
              selectedId={selectedId}
              onSelect={(raceId) => {
                setSelectedId(raceId);
                router.push(`/races/${raceId}`, { scroll: false });
              }}
              onCollapse={() => setCalendarCollapsedPersisted(true)}
            />
          </div>
        </aside>

        <div className={cn("flex min-w-0 flex-col", calendarCollapsed ? "gap-4" : "gap-0", revealMotion)}>
          <div
            className={cn(
              "overflow-hidden",
              revealMotion,
              calendarCollapsed
                ? "max-h-16 opacity-100 delay-200"
                : "max-h-0 opacity-0 delay-0 duration-200",
            )}
          >
            <button
              type="button"
              onClick={() => setCalendarCollapsedPersisted(false)}
              className={cn(
                racesGlassInset,
                racesGlassFocus,
                "inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-[0.8125rem] font-medium text-neutral-700 transition-[color,transform,opacity] duration-300 ease-out hover:text-neutral-950",
                panelMotion,
                calendarCollapsed
                  ? "translate-y-0 scale-100 opacity-100 delay-300"
                  : "translate-y-1 scale-[0.98] opacity-0 delay-0",
              )}
            >
              <PanelLeftOpen className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              <span>Show calendar</span>
              {selectedRace ? (
                <>
                  <span className="text-neutral-300" aria-hidden>
                    ·
                  </span>
                  <span className="truncate text-neutral-500">
                    R{selectedRace.round} {selectedRace.shortName}
                  </span>
                </>
              ) : null}
            </button>
          </div>

          {selectedRace ? (
            <>
              <RaceHero race={selectedRace} loading={loading} />
              <div className="mt-6">
                <RaceDetailPanel race={selectedRace} loading={loading} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
