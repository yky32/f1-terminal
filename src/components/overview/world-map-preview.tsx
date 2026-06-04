"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpToLine, Globe2 } from "lucide-react";
import { CircuitLivePin } from "@/components/overview/circuit-live-pin";
import { CircuitSessionsPanel } from "@/components/overview/circuit-sessions-panel";
import { useGlobalOverview } from "@/components/overview/global-overview-context";
import { GlobalWeekendHighlight } from "@/components/overview/global-weekend-highlight";
import { MapLiveStatsCard } from "@/components/overview/map-live-stats-card";
import { useMapCircuits } from "@/components/overview/map-circuits-context";
import { Map, type MapRef } from "@/components/ui/map";
import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import { getLiveSessionStats } from "@/lib/data/live-circuit-activity";
import { getMockAllCircuitMarkers } from "@/lib/data/providers/mock/f1-data";
import type { RaceRegion } from "@/lib/data/race-profile";
import { readCachedMapSnapshot } from "@/lib/f1/local-map-cache";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { glassFocus, glassHover, glassInset } from "@/components/glass-surface";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

const WORLD_VIEW = { center: [0, 22] as [number, number], zoom: 1.2 };
const CIRCUIT_FOCUS_ZOOM = 4.5;
const SPLIT_TRANSITION_MS = 700;
const MAP_FLY_MS = 900;
const NO_PADDING = { top: 0, right: 0, bottom: 0, left: 0 };

function initialSessionMode(): MapSessionMode {
  const cached = readCachedMapSnapshot();
  if (!cached) return "live";

  const live = getLiveSessionStats(cached.snapshot.live?.circuits ?? []);
  const upcoming = getLiveSessionStats(cached.snapshot.upcoming?.circuits ?? []);

  if (live.totalSessions === 0 && upcoming.totalSessions > 0) return "upcoming";
  return "live";
}

function mapFocusPadding(pane: HTMLElement | null) {
  const width = pane?.clientWidth ?? 800;
  const height = pane?.clientHeight ?? 600;

  return {
    top: 48,
    right: 32,
    left: Math.min(240, Math.round(width * 0.28)),
    bottom: 48,
  };
}

type MapControlsToolbarProps = {
  onFocusMapSection: () => void;
  onResetMapView: () => void;
  raised: boolean;
};

function MapControlsToolbar({
  onFocusMapSection,
  onResetMapView,
  raised,
}: MapControlsToolbarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-4 z-10 sm:right-6",
        raised ? "bottom-20 sm:bottom-[4.75rem]" : "bottom-6 sm:bottom-8",
      )}
    >
      <div
        className={cn(
          glassInset,
          "pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]",
        )}
        role="toolbar"
        aria-label="Map controls"
      >
        <button
          type="button"
          onClick={onFocusMapSection}
          title="Scroll to map"
          aria-label="Scroll to map"
          className={cn(
            glassHover,
            glassFocus,
            "flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-neutral-950",
          )}
        >
          <ArrowUpToLine className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>
        <button
          type="button"
          onClick={onResetMapView}
          title="Reset map to world view"
          aria-label="Reset map to world view"
          className={cn(
            glassHover,
            glassFocus,
            "flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-neutral-950",
          )}
        >
          <Globe2 className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>
      </div>
    </div>
  );
}

type WorldMapPreviewProps = {
  regionFilter?: RaceRegion | null;
};

export function WorldMapPreview({ regionFilter = null }: WorldMapPreviewProps) {
  const mapRef = useRef<MapRef>(null);
  const mapPaneRef = useRef<HTMLDivElement>(null);
  const { overview } = useGlobalOverview();
  const { data, loading, error: fetchError, refresh } = useMapCircuits();
  const [sessionMode, setSessionMode] = useState<MapSessionMode>(initialSessionMode);
  const autoModeAppliedRef = useRef(false);
  const [selectedCircuitId, setSelectedCircuitId] = useState<number | null>(null);
  const [splitOpen, setSplitOpen] = useState(false);

  const modeSnapshot = sessionMode === "live" ? data?.live : data?.upcoming;
  const liveStats = useMemo(
    () => getLiveSessionStats(data?.live?.circuits ?? []),
    [data?.live?.circuits],
  );
  const upcomingStats = useMemo(
    () => getLiveSessionStats(data?.upcoming?.circuits ?? []),
    [data?.upcoming?.circuits],
  );
  const stats = useMemo(
    () => getLiveSessionStats(modeSnapshot?.circuits ?? []),
    [modeSnapshot?.circuits],
  );

  const backgroundCircuits = useMemo(
    () => overview?.circuits ?? getMockAllCircuitMarkers(),
    [overview?.circuits],
  );

  const raceRegionById = useMemo(() => {
    const lookup: Record<string, RaceRegion> = {};
    for (const race of overview?.calendar ?? []) {
      lookup[race.id] = race.region;
    }
    return lookup;
  }, [overview?.calendar]);

  const error = fetchError;
  const updatedAt = modeSnapshot?.updatedAt ?? null;

  const { circuitCount, totalSessions, maxSessions, circuits } = stats;

  useEffect(() => {
    if (loading || !data || autoModeAppliedRef.current) return;

    if (liveStats.totalSessions === 0 && upcomingStats.totalSessions > 0) {
      autoModeAppliedRef.current = true;
      setSessionMode("upcoming");
    }
  }, [data, loading, liveStats.totalSessions, upcomingStats.totalSessions]);

  const selectedCircuit = useMemo(() => {
    if (!selectedCircuitId) return null;
    return (
      modeSnapshot?.circuits.find((circuit) => circuit.circuitId === selectedCircuitId) ??
      backgroundCircuits.find((circuit) => circuit.circuitId === selectedCircuitId) ??
      null
    );
  }, [backgroundCircuits, modeSnapshot?.circuits, selectedCircuitId]);

  const selectedSessions = useMemo(() => {
    if (!selectedCircuitId || !modeSnapshot) return [];
    return modeSnapshot.sessionsByCircuit[String(selectedCircuitId)] ?? [];
  }, [modeSnapshot, selectedCircuitId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const resizeSoon = window.setTimeout(() => map.resize(), 50);
    const resizeAfterTransition = window.setTimeout(
      () => map.resize(),
      SPLIT_TRANSITION_MS + 80,
    );

    return () => {
      window.clearTimeout(resizeSoon);
      window.clearTimeout(resizeAfterTransition);
    };
  }, [splitOpen]);

  useEffect(() => {
    if (!splitOpen || !selectedCircuit) return;

    const circuit = selectedCircuit;
    const timers: number[] = [];

    const flyToCircuit = () => {
      const map = mapRef.current;
      if (!map) return;

      map.resize();
      map.flyTo({
        center: [circuit.longitude, circuit.latitude],
        zoom: CIRCUIT_FOCUS_ZOOM,
        duration: MAP_FLY_MS,
        padding: mapFocusPadding(mapPaneRef.current),
        essential: true,
      });
    };

    timers.push(window.setTimeout(() => mapRef.current?.resize(), 50));
    timers.push(window.setTimeout(flyToCircuit, SPLIT_TRANSITION_MS + 60));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [splitOpen, selectedCircuit]);

  const fitMapToWorld = useCallback((afterLayoutMs = 0) => {
    const fly = () => {
      const map = mapRef.current;
      if (!map) return;

      map.resize();
      map.flyTo({
        center: WORLD_VIEW.center,
        zoom: WORLD_VIEW.zoom,
        bearing: 0,
        pitch: 0,
        padding: NO_PADDING,
        duration: MAP_FLY_MS,
        essential: true,
      });
    };

    if (afterLayoutMs > 0) {
      window.setTimeout(fly, afterLayoutMs);
      return;
    }

    fly();
  }, []);

  const resetWorldView = useCallback(() => {
    setSplitOpen(false);
    fitMapToWorld(SPLIT_TRANSITION_MS + 60);
    window.setTimeout(() => setSelectedCircuitId(null), SPLIT_TRANSITION_MS);
  }, [fitMapToWorld]);

  const focusMapSection = useCallback(() => {
    scrollToSection("global-map");
  }, []);

  const resetMapCamera = useCallback(() => {
    fitMapToWorld(splitOpen ? SPLIT_TRANSITION_MS + 60 : 0);
  }, [fitMapToWorld, splitOpen]);

  const focusCircuit = useCallback((circuit: CircuitActivity) => {
    setSelectedCircuitId(circuit.circuitId);
    setSplitOpen(true);
  }, []);

  const handleModeChange = useCallback(
    (mode: MapSessionMode) => {
      if (mode === sessionMode) return;
      resetWorldView();
      setSessionMode(mode);
    },
    [resetWorldView, sessionMode],
  );

  const showSessionColumn = splitOpen && selectedCircuit;
  const showLiveChip = !showSessionColumn && !loading;
  const alternateModeCount =
    sessionMode === "live" ? upcomingStats.totalSessions : liveStats.totalSessions;

  return (
    <section id="global-map" className="relative w-full scroll-mt-[4.25rem]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent"
        aria-hidden
      />

      <div className="relative flex h-[min(92vh,calc(100dvh-4.25rem))] min-h-[30rem] w-full overflow-hidden sm:min-h-[34rem]">
        <div
          ref={mapPaneRef}
          className={cn(
            "relative h-full min-w-0 shrink-0 bg-[#eef1f6] transition-[width] duration-700 ease-in-out",
            showSessionColumn ? "w-[70%]" : "w-full",
          )}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-28 bg-gradient-to-b from-[#eef1f6] via-[#eef1f6]/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-36 bg-gradient-to-t from-[#eef1f6] via-[#eef1f6]/70 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[4] shadow-[inset_0_0_120px_rgba(15,23,42,0.08)]"
            aria-hidden
          />

          <Map
            ref={mapRef}
            theme="light"
            center={WORLD_VIEW.center}
            zoom={WORLD_VIEW.zoom}
            minZoom={0.85}
            maxZoom={8}
            attributionControl={false}
            className="h-full w-full"
          >
            {backgroundCircuits.map((circuit, index) => {
                const highlighted = modeSnapshot?.circuits.some(
                  (item) => item.circuitId === circuit.circuitId,
                );
                const modeCircuit = modeSnapshot?.circuits.find(
                  (item) => item.circuitId === circuit.circuitId,
                );
                const circuitRegion = raceRegionById[circuit.raceId];
                const dimmed =
                  regionFilter !== null &&
                  circuitRegion !== undefined &&
                  circuitRegion !== regionFilter;

                return (
                  <CircuitLivePin
                    key={circuit.circuitId}
                    circuit={
                      modeCircuit ?? {
                        ...circuit,
                        sessionCount: highlighted ? circuit.sessionCount : 0,
                      }
                    }
                    maxSessions={Math.max(maxSessions, 1)}
                    mode={sessionMode}
                    selected={selectedCircuitId === circuit.circuitId}
                    dimmed={dimmed}
                    pulseDelay={(index % 5) * 0.35}
                    onClick={() => focusCircuit(modeCircuit ?? circuit)}
                  />
                );
              })}
          </Map>

          <MapControlsToolbar
            onFocusMapSection={focusMapSection}
            onResetMapView={resetMapCamera}
            raised={showLiveChip}
          />

          {!showSessionColumn && !loading ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center px-4 sm:bottom-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-4 py-2 text-[0.8125rem] font-semibold tracking-[-0.01em] text-neutral-900 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
                <span className="relative flex h-2 w-2" aria-hidden>
                  {sessionMode === "live" ? (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                      <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </>
                  ) : (
                    <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-sky-500" />
                  )}
                </span>
                <span>
                  {sessionMode === "live" ? "Live worldwide" : "Upcoming weekends"}
                </span>
                {totalSessions > 0 ? (
                  <>
                    <span className="text-neutral-500" aria-hidden>
                      ·
                    </span>
                    <span className="tabular-nums text-neutral-700">
                      {circuitCount} {circuitCount === 1 ? "circuit" : "circuits"}
                    </span>
                  </>
                ) : (
                  <span className="text-neutral-500">
                    · switch to {sessionMode === "live" ? "Upcoming" : "Live"} for more
                  </span>
                )}
              </div>
            </div>
          ) : null}

          {overview?.weekendHighlight && !showSessionColumn ? (
            <div className="pointer-events-none absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
              <GlobalWeekendHighlight highlight={overview.weekendHighlight} />
            </div>
          ) : null}

          <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-h-[calc(100%-2rem)] w-[min(100%-2rem,13.75rem)] flex-col gap-3 sm:left-6 sm:top-6">
            <MapLiveStatsCard
              mode={sessionMode}
              onModeChange={handleModeChange}
              circuitCount={circuitCount}
              totalSessions={totalSessions}
              circuits={circuits}
              alternateModeCount={alternateModeCount}
              selectedCircuitId={selectedCircuitId}
              onCircuitSelect={focusCircuit}
              onResetView={resetWorldView}
              loading={loading}
              error={error}
              onRetry={error ? () => void refresh() : undefined}
              updatedAt={updatedAt}
            />
          </div>

          {loading ? (
            <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
              <p className="rounded-full bg-white/80 px-4 py-2 text-[0.8125rem] text-neutral-600">
                Loading circuits…
              </p>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "relative z-10 h-full min-w-0 shrink-0 overflow-hidden transition-[width] duration-700 ease-in-out",
            showSessionColumn ? "w-[30%] min-w-[17.5rem] sm:min-w-[19rem]" : "w-0",
          )}
        >
          {selectedCircuit ? (
            <CircuitSessionsPanel
              circuitName={selectedCircuit.name}
              country={selectedCircuit.country}
              city={selectedCircuit.city}
              raceId={selectedCircuit.raceId}
              sessions={selectedSessions}
              onClose={resetWorldView}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
