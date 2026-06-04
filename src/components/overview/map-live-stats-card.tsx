"use client";

import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { glassInset, glassFocus } from "@/components/glass-surface";
import { cn } from "@/lib/utils";

type MapLiveStatsCardProps = {
  mode: MapSessionMode;
  onModeChange: (mode: MapSessionMode) => void;
  circuitCount: number;
  totalSessions: number;
  activeWeekends: number;
};

export function MapLiveStatsCard({
  mode,
  onModeChange,
  circuitCount,
  totalSessions,
  activeWeekends,
}: MapLiveStatsCardProps) {
  return (
    <div className={cn(glassInset, "rounded-[1rem] px-3 py-2.5 sm:px-4 sm:py-3")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Global F1 map
          </p>
          <p className="mt-0.5 text-[0.875rem] font-medium text-neutral-900">
            {circuitCount} circuits · {totalSessions} sessions
            {activeWeekends > 0 ? (
              <>
                {" "}
                · <span className="text-amber-700">{activeWeekends} active weekends</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex gap-1 rounded-full bg-black/[0.04] p-1">
          {(["live", "upcoming"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={cn(
                glassFocus,
                "rounded-full px-3 py-1.5 text-[0.75rem] font-semibold capitalize transition-colors",
                mode === item
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:text-neutral-950",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function countActiveWeekends(circuits: CircuitActivity[]) {
  return circuits.filter((circuit) => circuit.weekendStatus === "active").length;
}
