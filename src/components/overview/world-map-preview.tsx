"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpToLine, Globe2 } from "lucide-react";
import { CircuitLivePin } from "@/components/overview/circuit-live-pin";
import { CircuitSessionsPanel } from "@/components/overview/circuit-sessions-panel";
import {
  countActiveWeekends,
  MapLiveStatsCard,
} from "@/components/overview/map-live-stats-card";
import { useMapCircuits } from "@/components/overview/map-circuits-context";
import { Map, type MapRef } from "@/components/ui/map";
import { getLiveSessionStats } from "@/lib/data/live-circuit-activity";
import { getMockAllCircuitMarkers } from "@/lib/data/providers/mock/f1-data";
import { readCachedMapSnapshot } from "@/lib/f1/local-map-cache";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { glassFocus, glassHover, glassInset } from "@/components/glass-surface";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

const WORLD_VIEW = { center: [0, 22] as [number, number], zoom: 1.2 };
const FOCUS_ZOOM = 4.5;

function initialSessionMode(): MapSessionMode {
  const cached = readCachedMapSnapshot();
  if (!cached) return "live";

  const live = getLiveSessionStats(cached.snapshot.live?.circuits ?? []);
  const upcoming = getLiveSessionStats(cached.snapshot.upcoming?.circuits ?? []);

  if (live.totalSessions === 0 && upcoming.totalSessions > 0) return "upcoming";
  return "live";
}

export function WorldMapPreview() {
  const { data, loading, error } = useMapCircuits();
  const mapRef = useRef<MapRef>(null);
  const [sessionMode, setSessionMode] = useState<MapSessionMode>(initialSessionMode);
  const [selectedCircuitId, setSelectedCircuitId] = useState<number | null>(null);

  const modeSnapshot = useMemo(() => {
    if (!data) return null;
    return sessionMode === "live" ? data.live : data.upcoming;
  }, [data, sessionMode]);

  const stats = useMemo(
    () => getLiveSessionStats(modeSnapshot?.circuits ?? []),
    [modeSnapshot?.circuits],
  );

  const backgroundCircuits = useMemo(() => getMockAllCircuitMarkers(), []);

  const selectedSessions = useMemo(() => {
    if (!selectedCircuitId || !modeSnapshot) return [];
    return modeSnapshot.sessionsByCircuit[String(selectedCircuitId)] ?? [];
  }, [modeSnapshot, selectedCircuitId]);

  const selectedCircuit = useMemo(() => {
    if (!selectedCircuitId) return null;
    return (
      modeSnapshot?.circuits.find((circuit) => circuit.circuitId === selectedCircuitId) ??
      backgroundCircuits.find((circuit) => circuit.circuitId === selectedCircuitId) ??
      null
    );
  }, [backgroundCircuits, modeSnapshot?.circuits, selectedCircuitId]);

  const handleSelectCircuit = useCallback((circuitId: number, longitude: number, latitude: number) => {
    setSelectedCircuitId(circuitId);
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: FOCUS_ZOOM,
      duration: 900,
    });
  }, []);

  const resetMapView = useCallback(() => {
    setSelectedCircuitId(null);
    mapRef.current?.flyTo({ ...WORLD_VIEW, duration: 900 });
  }, []);

  const activeWeekends = countActiveWeekends(backgroundCircuits);

  return (
    <section id="global-map" className="scroll-mt-28">
      <div className="page-container pb-4">
        <MapLiveStatsCard
          mode={sessionMode}
          onModeChange={setSessionMode}
          circuitCount={stats.circuitCount}
          totalSessions={stats.totalSessions}
          activeWeekends={activeWeekends}
        />
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#eef1f6]",
          "h-[min(72vh,calc(100dvh-8rem))] min-h-[24rem]",
        )}
      >
        <div
          className={cn(
            "grid h-full transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            selectedCircuit ? "grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]" : "grid-cols-1",
          )}
        >
          <div className="relative min-h-0">
            <Map
              ref={mapRef}
              center={WORLD_VIEW.center}
              zoom={WORLD_VIEW.zoom}
              minZoom={1}
              maxZoom={8}
              className="h-full w-full"
            >
              {backgroundCircuits.map((circuit, index) => {
                const highlighted = modeSnapshot?.circuits.some(
                  (item) => item.circuitId === circuit.circuitId,
                );
                const modeCircuit = modeSnapshot?.circuits.find(
                  (item) => item.circuitId === circuit.circuitId,
                );

                return (
                  <CircuitLivePin
                    key={circuit.circuitId}
                    circuit={
                      modeCircuit ?? {
                        ...circuit,
                        sessionCount: highlighted ? circuit.sessionCount : 0,
                      }
                    }
                    maxSessions={Math.max(stats.maxSessions, 1)}
                    mode={sessionMode}
                    selected={selectedCircuitId === circuit.circuitId}
                    pulseDelay={(index % 5) * 0.35}
                    onClick={() =>
                      handleSelectCircuit(circuit.circuitId, circuit.longitude, circuit.latitude)
                    }
                  />
                );
              })}
            </Map>

            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
              <div className="pointer-events-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("global-map")}
                  className={cn(glassInset, glassHover, glassFocus, "rounded-full p-2.5 text-neutral-700")}
                  aria-label="Focus map section"
                >
                  <Globe2 className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={resetMapView}
                  className={cn(glassInset, glassHover, glassFocus, "rounded-full p-2.5 text-neutral-700")}
                  aria-label="Reset map view"
                >
                  <ArrowUpToLine className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                <p className="rounded-full bg-white/80 px-4 py-2 text-[0.8125rem] text-neutral-600">
                  Loading circuits…
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-red-500/10 px-3 py-1.5 text-[0.75rem] text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          {selectedCircuit ? (
            <CircuitSessionsPanel
              circuitName={selectedCircuit.name}
              country={selectedCircuit.country}
              city={selectedCircuit.city}
              raceId={selectedCircuit.raceId}
              sessions={selectedSessions}
              onClose={() => setSelectedCircuitId(null)}
            />
          ) : null}
        </div>
      </div>

      <div className="page-container py-4">
        <p className="text-[0.8125rem] text-neutral-600">
          Tap a circuit pin to inspect sessions, or open the{" "}
          <Link href="/races/monaco-gp" className="font-medium text-neutral-950 underline-offset-2 hover:underline">
            Monaco Grand Prix dashboard
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
