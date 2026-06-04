"use client";

import { PanelLeftClose } from "lucide-react";
import type { RaceProfile } from "@/lib/data/race-profile";
import { CURRENT_SEASON } from "@/lib/f1/race-catalog";
import { RaceCalendarItem } from "@/components/races/race-calendar-item";
import { racesGlassFocus } from "@/components/races/races-glass";
import { cn } from "@/lib/utils";

type RaceCalendarPanelProps = {
  races: RaceProfile[];
  selectedId: string;
  onSelect: (raceId: string) => void;
  onCollapse?: () => void;
  className?: string;
};

export function RaceCalendarPanel({
  races,
  selectedId,
  onSelect,
  onCollapse,
  className,
}: RaceCalendarPanelProps) {
  const season = races[0]?.season ?? CURRENT_SEASON;
  const total = races.length;
  const completed = races.filter((race) => race.weekendStatus === "finished").length;
  const activeRace = races.find((race) => race.weekendStatus === "active");
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <header className="shrink-0 px-1 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Grand Prix calendar
            </p>
            <h2 className="mt-0.5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-neutral-950">
              {season} season
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-[0.8125rem] font-semibold tabular-nums text-neutral-700">
              {completed}
              <span className="font-medium text-neutral-400"> / {total}</span>
            </p>
            {onCollapse ? (
              <button
                type="button"
                onClick={onCollapse}
                aria-label="Hide calendar"
                title="Hide calendar"
                className={cn(
                  racesGlassFocus,
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-black/[0.05] hover:text-neutral-900",
                )}
              >
                <PanelLeftClose className="h-4 w-4" strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completed} of ${total} rounds completed`}
        >
          <div
            className="h-full rounded-full bg-neutral-900 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {activeRace ? (
          <p className="mt-3 text-[0.8125rem] leading-snug text-neutral-600">
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Round {activeRace.round} live
            </span>
            <span className="text-neutral-400"> · </span>
            {activeRace.name}
          </p>
        ) : (
          <p className="mt-3 text-[0.8125rem] text-neutral-500">
            {completed === total
              ? "Season complete — browse any round."
              : "Pick a round to open its dashboard."}
          </p>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        <div className="relative pb-1 pl-0.5">
          <div
            className="pointer-events-none absolute bottom-4 left-[1.0625rem] top-4 w-px bg-gradient-to-b from-black/[0.08] via-black/[0.06] to-transparent"
            aria-hidden
          />

          <div className="space-y-0.5">
            {races.map((race) => (
              <RaceCalendarItem
                key={race.id}
                race={race}
                active={race.id === selectedId}
                loaded={race.driverStandings.length > 0 || race.sessions.length > 0}
                onClick={() => onSelect(race.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
