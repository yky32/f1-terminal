"use client";

import { useState, type MouseEvent } from "react";
import type { CircuitActivity } from "@/lib/data/live-circuit-activity";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { useUserPreferences } from "@/components/user-preferences-provider";
import { glass, glassInset } from "@/components/glass-surface";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 3;

function LivePulseDot({ active }: { active: boolean }) {
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
      <span
        className={cn(
          "absolute inset-0 animate-ping rounded-full",
          active ? "bg-emerald-500/60" : "bg-emerald-500/35",
        )}
      />
      <span
        className={cn(
          "relative m-auto h-1.5 w-1.5 rounded-full",
          active
            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.85)]"
            : "bg-emerald-500/75",
        )}
      />
    </span>
  );
}

type MapLiveStatsCardProps = {
  mode: MapSessionMode;
  onModeChange: (mode: MapSessionMode) => void;
  circuitCount: number;
  totalSessions: number;
  circuits: CircuitActivity[];
  alternateModeCount?: number;
  selectedCircuitId?: number | null;
  onCircuitSelect?: (circuit: CircuitActivity) => void;
  onResetView?: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  updatedAt?: string | null;
};

export function MapLiveStatsCard({
  mode,
  onModeChange,
  circuitCount,
  totalSessions,
  circuits,
  alternateModeCount = 0,
  selectedCircuitId = null,
  onCircuitSelect,
  onResetView,
  loading = false,
  error = null,
  onRetry,
  updatedAt = null,
}: MapLiveStatsCardProps) {
  const { locale, timeZone } = useUserPreferences();
  const [showAll, setShowAll] = useState(false);
  const sorted = [...circuits].sort((a, b) => b.sessionCount - a.sessionCount);
  const visible = showAll ? sorted : sorted.slice(0, PREVIEW_COUNT);
  const hiddenCount = sorted.length - PREVIEW_COUNT;

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("[data-map-list-action]")) return;
    onResetView?.();
  };

  const modeLabel = mode === "live" ? "Live now" : "Upcoming";
  const emptyLabel =
    mode === "live" ? "No live sessions right now" : "No upcoming sessions scheduled";
  const showUpcomingHint =
    mode === "live" && totalSessions === 0 && alternateModeCount > 0;

  const updatedLabel =
    updatedAt && !error
      ? new Intl.DateTimeFormat(locale, {
          hour: "numeric",
          minute: "2-digit",
          timeZone,
        }).format(new Date(updatedAt))
      : null;

  return (
    <div
      role="presentation"
      onClick={handleCardClick}
      className={cn(
        glass,
        "pointer-events-auto flex max-h-full min-h-0 w-full cursor-default flex-col overflow-hidden px-3 py-2.5",
      )}
    >
      <div className={cn(glassInset, "flex items-center gap-1 p-0.5")} data-map-list-action>
        {(["live", "upcoming"] as const).map((option) => {
          const active = mode === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onModeChange(option)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                active
                  ? option === "live"
                    ? "bg-white text-emerald-800 shadow-sm"
                    : "bg-white text-sky-800 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800",
              )}
            >
              {option === "live" ? (
                <>
                  <LivePulseDot active={active} />
                  <span>Live</span>
                </>
              ) : (
                "Upcoming"
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {modeLabel}
        {loading ? (
          <span className="ml-1.5 font-normal normal-case text-neutral-400">· updating</span>
        ) : null}
      </p>

      {error ? (
        <div className="mt-2 space-y-1.5" data-map-list-action>
          <p className="text-[11px] leading-snug text-red-600">{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-[10px] font-semibold text-red-700 underline-offset-2 hover:underline"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <dl className="mt-2 grid grid-cols-2 gap-x-3.5 gap-y-1">
        <div>
          <dd className="text-[1.35rem] font-bold tabular-nums leading-none text-neutral-900">
            {circuitCount}
          </dd>
          <dt className="text-xs text-neutral-500">
            {circuitCount === 1 ? "Circuit" : "Circuits"}
          </dt>
        </div>
        <div>
          <dd className="text-[1.35rem] font-bold tabular-nums leading-none text-neutral-900">
            {totalSessions}
          </dd>
          <dt className="text-xs text-neutral-500">
            {totalSessions === 1 ? "Session" : "Sessions"}
          </dt>
        </div>
      </dl>

      {updatedLabel ? (
        <p className="mt-1.5 text-[10px] leading-tight text-neutral-400">
          Updated {updatedLabel}
        </p>
      ) : null}

      {!error && sorted.length > 0 ? (
        <div
          className="mt-2 flex min-h-0 flex-1 flex-col border-t border-neutral-100 pt-2"
          data-map-list-action
        >
          <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain">
            {visible.map((circuit) => {
              const isSelected = selectedCircuitId === circuit.circuitId;

              return (
                <li key={circuit.circuitId}>
                  <button
                    type="button"
                    onClick={() => onCircuitSelect?.(circuit)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-[11px] leading-tight transition-colors",
                      isSelected
                        ? "bg-neutral-200/80 text-neutral-900"
                        : "text-neutral-700 hover:bg-neutral-200/50",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          mode === "live"
                            ? isSelected
                              ? "bg-emerald-600"
                              : "bg-emerald-500"
                            : isSelected
                              ? "bg-sky-600"
                              : "bg-sky-500",
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate">{circuit.name}</span>
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-neutral-500">
                      {circuit.sessionCount}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAll((open) => !open)}
              className="mt-1.5 w-full text-left text-[10px] font-medium text-neutral-500 hover:text-neutral-800"
            >
              {showAll ? "Show less" : `+${hiddenCount} more circuits`}
            </button>
          ) : null}
        </div>
      ) : !error && !loading ? (
        <div className="mt-2 space-y-2">
          <p className="text-[11px] leading-snug text-neutral-500">{emptyLabel}</p>
          {showUpcomingHint ? (
            <button
              type="button"
              data-map-list-action
              onClick={() => onModeChange("upcoming")}
              className="w-full rounded-md bg-sky-600/10 px-2 py-1.5 text-left text-[10px] font-semibold text-sky-800 transition-colors hover:bg-sky-600/15"
            >
              View {alternateModeCount} upcoming{" "}
              {alternateModeCount === 1 ? "session" : "sessions"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
