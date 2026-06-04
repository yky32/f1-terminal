"use client";

import maplibregl from "maplibre-gl";
import { Minus, Plus, Scan } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Map, MapRoute, type MapRef } from "@/components/ui/map";
import { getCircuitTrackRoute } from "@/lib/f1/circuit-tracks";
import { countryAccentColor } from "@/lib/f1/country-flags";
import type { RaceProfile } from "@/lib/data/race-profile";
import { racesGlassFocus, racesGlassInset } from "@/components/races/races-glass";
import { cn } from "@/lib/utils";

const PREVIEW_FLY_MS = 900;
const MAP_MIN_ZOOM = 4;
const MAP_MAX_ZOOM = 17;
const ZOOM_STEP = 0.75;

const FIT_CONFIG = {
  preview: {
    padding: { top: 5, right: 5, bottom: 14, left: 5 },
    maxZoom: 17,
    fallbackZoom: 14,
    zoomBoost: 0,
  },
  detail: {
    padding: { top: 5, right: 5, bottom: 5, left: 5 },
    maxZoom: 17,
    fallbackZoom: 14,
    zoomBoost: 0,
  },
} as const;

type RaceCircuitMapViewProps = {
  race: RaceProfile;
  /** Preview in hero; detail in popup — full track framed, no pan/zoom. */
  variant?: "preview" | "detail";
  className?: string;
};

export function RaceCircuitMapView({
  race,
  variant = "preview",
  className,
}: RaceCircuitMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);
  const userAdjustedViewRef = useRef(false);
  const trackRoute = useMemo(() => getCircuitTrackRoute(race.id), [race.id]);
  const trackColor = countryAccentColor(race.country);
  const isLive = race.liveSessions > 0;
  const isDetail = variant === "detail";
  const fitConfig = FIT_CONFIG[variant];

  useEffect(() => {
    userAdjustedViewRef.current = false;
  }, [race.id, variant]);

  const fitCircuitFrame = useCallback((force = false) => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!map || !container) {
      return;
    }

    if (isDetail && userAdjustedViewRef.current && !force) {
      return;
    }

    if (container.clientWidth < 2 || container.clientHeight < 2) {
      return;
    }

    map.resize();

    if (trackRoute && trackRoute.length >= 2) {
      const bounds = new maplibregl.LngLatBounds();
      for (const coord of trackRoute) {
        bounds.extend(coord);
      }

      map.fitBounds(bounds, {
        padding: fitConfig.padding,
        duration: isDetail ? 0 : PREVIEW_FLY_MS,
        maxZoom: fitConfig.maxZoom,
        essential: true,
      });

      if (fitConfig.zoomBoost > 0) {
        const center = map.getCenter();
        const zoom = Math.min(map.getZoom() + fitConfig.zoomBoost, fitConfig.maxZoom);

        if (isDetail) {
          map.jumpTo({ center, zoom });
        } else {
          map.easeTo({
            center,
            zoom,
            duration: PREVIEW_FLY_MS * 0.45,
            essential: true,
          });
        }
      }

      return;
    }

    if (isDetail) {
      map.jumpTo({
        center: [race.circuit.longitude, race.circuit.latitude],
        zoom: fitConfig.fallbackZoom,
      });
      return;
    }

    map.flyTo({
      center: [race.circuit.longitude, race.circuit.latitude],
      zoom: fitConfig.fallbackZoom,
      duration: PREVIEW_FLY_MS,
      essential: true,
    });
  }, [
    fitConfig.fallbackZoom,
    fitConfig.maxZoom,
    fitConfig.padding,
    fitConfig.zoomBoost,
    isDetail,
    race.circuit.latitude,
    race.circuit.longitude,
    trackRoute,
  ]);

  const adjustZoom = useCallback((delta: number) => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    userAdjustedViewRef.current = true;
    const nextZoom = Math.min(
      Math.max(map.getZoom() + delta, MAP_MIN_ZOOM),
      MAP_MAX_ZOOM,
    );
    map.zoomTo(nextZoom, { duration: 200 });
  }, []);

  const resetTrackFit = useCallback(() => {
    userAdjustedViewRef.current = false;
    fitCircuitFrame(true);
  }, [fitCircuitFrame]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    let resizeTimer: number | undefined;
    let waitTimer: number | undefined;
    let observer: ResizeObserver | undefined;
    let boundMap: maplibregl.Map | null = null;

    const scheduleFit = (...delays: number[]) => {
      for (const delay of delays) {
        const id = window.setTimeout(() => {
          if (!cancelled) {
            fitCircuitFrame();
          }
        }, delay);
        timers.push(id);
      }
    };

    const bindMap = () => {
      const map = mapRef.current;
      if (!map || cancelled || boundMap === map) {
        return boundMap !== null;
      }

      boundMap = map;

      const runFit = () => {
        if (cancelled) {
          return;
        }

        window.requestAnimationFrame(() => {
          fitCircuitFrame();
          scheduleFit(...(isDetail ? [120, 400, 780, 980] : [120, 360, 720]));
        });
      };

      if (map.loaded()) {
        runFit();
      } else {
        map.once("load", runFit);
      }

      return true;
    };

    const waitForMap = () => {
      if (bindMap()) {
        return;
      }

      waitTimer = window.setTimeout(waitForMap, 32);
    };

    waitForMap();

    const container = containerRef.current;
    if (container && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!cancelled) {
            fitCircuitFrame();
          }
        }, 50);
      });
      observer.observe(container);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(waitTimer);
      window.clearTimeout(resizeTimer);
      for (const id of timers) {
        window.clearTimeout(id);
      }
      observer?.disconnect();
    };
  }, [fitCircuitFrame, isDetail, race.id]);

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <Map
        ref={mapRef}
        theme="light"
        center={[race.circuit.longitude, race.circuit.latitude]}
        zoom={11}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        attributionControl={false}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        boxZoom={false}
        className="h-full w-full saturate-[0.88] contrast-[0.98]"
      >
        {trackRoute ? (
          <>
            <MapRoute
              coordinates={trackRoute}
              color={isDetail ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.78)"}
              width={isDetail ? 8 : 7}
              opacity={isDetail ? 1 : 0.9}
              interactive={false}
            />
            <MapRoute
              coordinates={trackRoute}
              color={isLive ? "#dc2626" : trackColor}
              width={isDetail ? 5 : 3.5}
              opacity={0.98}
              interactive={false}
            />
          </>
        ) : null}
      </Map>

      {isDetail ? (
        <CircuitDetailMapControls onZoomIn={() => adjustZoom(ZOOM_STEP)} onZoomOut={() => adjustZoom(-ZOOM_STEP)} onFit={resetTrackFit} />
      ) : null}
    </div>
  );
}

function CircuitDetailMapControls({
  onZoomIn,
  onZoomOut,
  onFit,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      aria-label="Map zoom controls"
    >
      <div
        className={cn(
          racesGlassInset,
          "pointer-events-auto absolute bottom-2.5 left-2.5 flex flex-col overflow-hidden rounded-lg shadow-sm",
        )}
        role="group"
      >
        <CircuitMapControlButton label="Zoom in" onClick={onZoomIn}>
          <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
        </CircuitMapControlButton>
        <CircuitMapControlButton label="Zoom out" onClick={onZoomOut} className="border-t border-black/[0.06]">
          <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
        </CircuitMapControlButton>
        <CircuitMapControlButton label="Fit full track" onClick={onFit} className="border-t border-black/[0.06]">
          <Scan className="h-4 w-4" strokeWidth={2} aria-hidden />
        </CircuitMapControlButton>
      </div>
    </div>
  );
}

function CircuitMapControlButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        racesGlassFocus,
        "flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors hover:bg-white/50 hover:text-neutral-950",
        className,
      )}
    >
      {children}
    </button>
  );
}
