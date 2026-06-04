"use client";

import { MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import {
  bubbleDiameter,
  type CircuitActivity,
} from "@/lib/data/live-circuit-activity";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { cn } from "@/lib/utils";

type CircuitLivePinProps = {
  circuit: CircuitActivity;
  maxSessions: number;
  mode?: MapSessionMode;
  selected?: boolean;
  pulseDelay?: number;
  onClick?: () => void;
};

const PIN_SCALE = 1.25;

export function CircuitLivePin({
  circuit,
  maxSessions,
  mode = "live",
  selected = false,
  pulseDelay = 0,
  onClick,
}: CircuitLivePinProps) {
  const size = Math.round(bubbleDiameter(circuit.sessionCount, maxSessions) * PIN_SCALE);
  const isUpcoming = mode === "upcoming";
  const isActiveWeekend = circuit.weekendStatus === "active";

  return (
    <MapMarker
      longitude={circuit.longitude}
      latitude={circuit.latitude}
      onClick={() => onClick?.()}
    >
      <MarkerContent>
        <div
          className="relative flex cursor-pointer items-center justify-center"
          style={{ width: size, height: size }}
        >
          {isUpcoming ? (
            <span
              className={cn(
                "absolute inset-0 rounded-full",
                isActiveWeekend ? "bg-amber-400/25" : "bg-sky-400/20",
              )}
              aria-hidden="true"
            />
          ) : (
            <>
              <span
                className="live-pin-ping absolute inset-0 rounded-full bg-red-500/35"
                style={{ animationDelay: `${pulseDelay}s` }}
                aria-hidden="true"
              />
              <span
                className="live-pin-ping absolute inset-0 rounded-full bg-red-500/20"
                style={{ animationDelay: `${pulseDelay + 0.65}s` }}
                aria-hidden="true"
              />
            </>
          )}
          <div
            className={cn(
              "relative z-10 h-3.5 w-3.5 rounded-full ring-2 ring-white/80",
              selected && "scale-125",
              isUpcoming
                ? isActiveWeekend
                  ? "bg-amber-500"
                  : "bg-sky-600"
                : "live-pin-heartbeat bg-red-600",
            )}
            style={{ animationDelay: `${pulseDelay * 0.2}s` }}
            aria-hidden="true"
          />
        </div>
      </MarkerContent>
      <MarkerTooltip>
        {circuit.name} · {circuit.city}, {circuit.country}
        {": "}
        {circuit.sessionCount} {isUpcoming ? "upcoming" : "live"}{" "}
        {circuit.sessionCount === 1 ? "session" : "sessions"}
      </MarkerTooltip>
    </MapMarker>
  );
}
