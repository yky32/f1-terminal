"use client";

import { useEffect, useRef } from "react";
import { Map, MapMarker, MarkerContent, type MapRef } from "@/components/ui/map";
import type { RaceProfile } from "@/lib/data/race-profile";

const MAP_FLY_MS = 900;

type RaceMapPaneProps = {
  race: RaceProfile;
};

export function RaceMapPane({ race }: RaceMapPaneProps) {
  const mapRef = useRef<MapRef>(null);
  const isLive = race.liveSessions > 0;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const timer = window.setTimeout(() => {
      map.resize();
      map.flyTo({
        center: [race.circuit.longitude, race.circuit.latitude],
        zoom: 11,
        duration: MAP_FLY_MS,
        essential: true,
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [race.id, race.circuit.latitude, race.circuit.longitude]);

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef}
        theme="light"
        center={[race.circuit.longitude, race.circuit.latitude]}
        zoom={11}
        minZoom={4}
        maxZoom={14}
        attributionControl={false}
        dragPan={false}
        scrollZoom={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        boxZoom={false}
        className="h-full w-full saturate-[0.85] contrast-[0.98]"
      >
        <MapMarker longitude={race.circuit.longitude} latitude={race.circuit.latitude}>
          <MarkerContent>
            <div className="relative flex h-8 w-8 items-center justify-center">
              {isLive ? (
                <span className="live-pin-ping absolute inset-0 rounded-full bg-red-500/30" aria-hidden />
              ) : null}
              <span
                className={cnDot(isLive)}
                aria-hidden
              />
            </div>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}

function cnDot(isLive: boolean) {
  return isLive
    ? "relative z-10 h-3.5 w-3.5 rounded-full live-pin-heartbeat bg-red-600 ring-2 ring-white/80"
    : "relative z-10 h-3.5 w-3.5 rounded-full bg-neutral-700 ring-2 ring-white/80";
}
