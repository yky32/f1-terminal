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
  dimmed?: boolean;
  pulseDelay?: number;
  onClick?: () => void;
};

const PIN_SCALE = 1.25;

export function CircuitLivePin({
  circuit,
  maxSessions,
  mode = "live",
  selected = false,
  dimmed = false,
  pulseDelay = 0,
  onClick,
}: CircuitLivePinProps) {
  const hasSessions = circuit.sessionCount > 0;
  const size = Math.round(
    bubbleDiameter(Math.max(circuit.sessionCount, 1), maxSessions) * PIN_SCALE,
  );
  const isUpcoming = mode === "upcoming";
  const isActiveWeekend = circuit.weekendStatus === "active";
  const isFinished = circuit.weekendStatus === "finished";
  const showLivePulse = hasSessions && !isUpcoming && !isFinished;

  return (
    <MapMarker
      longitude={circuit.longitude}
      latitude={circuit.latitude}
      onClick={() => onClick?.()}
    >
      <MarkerContent>
        <div
          className={cn(
            "relative flex cursor-pointer items-center justify-center transition-opacity duration-300",
            dimmed && "opacity-[0.28] saturate-[0.65]",
          )}
          style={{ width: size, height: size }}
        >
          {showLivePulse ? (
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
          ) : (
            <span
              className={cn(
                "absolute inset-0 rounded-full",
                isFinished
                  ? "bg-emerald-500/20"
                  : isActiveWeekend
                    ? "bg-amber-400/25"
                    : "bg-sky-400/18",
              )}
              aria-hidden="true"
            />
          )}
          <div
            className={cn(
              "relative z-10 h-3.5 w-3.5 rounded-full ring-2 ring-white/80",
              selected && "scale-125",
              isFinished
                ? "bg-emerald-500"
                : isActiveWeekend
                  ? isUpcoming && !hasSessions
                    ? "bg-amber-500"
                    : "live-pin-heartbeat bg-red-600"
                  : isUpcoming
                    ? "bg-sky-600"
                    : hasSessions
                      ? "live-pin-heartbeat bg-red-600"
                      : "bg-neutral-300",
            )}
            style={{ animationDelay: `${pulseDelay * 0.2}s` }}
            aria-hidden="true"
          />
        </div>
      </MarkerContent>
      <MarkerTooltip>
        {circuit.name} · {circuit.city}, {circuit.country}
        {": "}
        {circuit.sessionCount > 0
          ? `${circuit.sessionCount} ${isUpcoming ? "upcoming" : "live"} ${circuit.sessionCount === 1 ? "session" : "sessions"}`
          : circuit.weekendStatus === "finished"
            ? "Completed"
            : circuit.weekendStatus === "active"
              ? "Live weekend"
              : "Upcoming"}
      </MarkerTooltip>
    </MapMarker>
  );
}
