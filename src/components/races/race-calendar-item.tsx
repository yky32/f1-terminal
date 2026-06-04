"use client";

import { Check, Radio } from "lucide-react";
import type { ReactNode } from "react";
import { racesGlassFocus } from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import type { WeekendStatus } from "@/lib/data/live-session";
import { countryAccentColor, countryIsoCode } from "@/lib/f1/country-flags";
import {
  raceCalendarItemGridClass,
  raceCalendarRoundColClass,
  raceCalendarTimelineVars,
} from "@/components/races/race-calendar-timeline";
import { cn } from "@/lib/utils";

type RaceCalendarItemProps = {
  race: RaceProfile;
  active: boolean;
  emphasized?: boolean;
  loaded: boolean;
  onClick: () => void;
};

export function RaceCalendarItem({
  race,
  active,
  emphasized = false,
  loaded,
  onClick,
}: RaceCalendarItemProps) {
  const accent = countryAccentColor(race.country);
  const iso = countryIsoCode(race.country);
  const status = race.weekendStatus;

  return (
    <button
      type="button"
      data-race-id={race.id}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        racesGlassFocus,
        raceCalendarTimelineVars,
        raceCalendarItemGridClass,
        "group relative items-stretch gap-x-2.5 py-0.5 text-left outline-none",
      )}
    >
      <span
        className={cn(
          raceCalendarRoundColClass,
          "relative z-[1] flex shrink-0 justify-center self-start pt-2",
        )}
      >
        <RoundNode round={race.round} status={status} active={active} emphasized={emphasized} />
      </span>

      <span
        className={cn(
          "relative min-w-0 flex-1 overflow-hidden rounded-[0.875rem] border transition-[background-color,border-color,box-shadow,opacity] duration-200",
          timelineCardSurface(status, active, emphasized),
          emphasized &&
            active &&
            "motion-safe:animate-[timeline-item-reveal_1.2s_ease-out]",
        )}
      >
        <span
          className={cn("absolute inset-y-2 left-0 w-[3px] rounded-full", timelineAccentBar(status, active))}
          style={timelineAccentColor(status, active, accent)}
          aria-hidden
        />

        <span className="flex items-start gap-2 px-3 py-2.5 pl-3.5">
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className={cn("truncate text-[0.875rem] font-semibold tracking-[-0.01em]", timelineTitleColor(status, active))}>
                {race.shortName}
              </span>
              <WeekendStatusPill status={status} />
            </span>

            <span className={cn("mt-0.5 block truncate text-[0.75rem]", timelineMetaColor(status, active))}>
              {race.city}
              {iso ? <span className="opacity-70"> · {iso}</span> : null}
            </span>

            {loaded ? (
              <span className="mt-2 flex flex-wrap items-center gap-1.5">
                {race.liveSessions > 0 ? (
                  <MetaChip live icon={<Radio className="h-3 w-3" strokeWidth={2.25} />}>
                    {race.liveSessions} live
                  </MetaChip>
                ) : null}
                {race.sessions.length > 0 ? (
                  <MetaChip status={status}>{race.sessions.length} sessions</MetaChip>
                ) : null}
                {race.driverStandings.length > 0 ? <MetaChip status={status}>Standings</MetaChip> : null}
              </span>
            ) : (
              <span className={cn("mt-2 inline-block text-[0.6875rem]", timelineMetaColor(status, active))}>
                Tap to load weekend data
              </span>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}

function timelineCardSurface(status: WeekendStatus, active: boolean, emphasized = false) {
  if (active) {
    return cn(
      "border-neutral-900/14 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.08)]",
      emphasized && "border-neutral-900/18 ring-1 ring-neutral-900/10",
    );
  }

  if (status === "finished") {
    return "border-emerald-900/10 bg-gradient-to-br from-emerald-500/[0.07] via-white/88 to-white/76 opacity-95 group-hover:border-emerald-800/16 group-hover:from-emerald-500/[0.1] group-hover:opacity-100";
  }

  if (status === "active") {
    return "border-red-500/25 bg-gradient-to-br from-red-500/[0.08] via-white/92 to-white/82 shadow-[0_0_20px_rgba(239,68,68,0.08)] group-hover:border-red-500/35 group-hover:from-red-500/[0.11]";
  }

  return "border-dashed border-black/[0.1] bg-white/72 group-hover:border-black/[0.14] group-hover:bg-white/88";
}

function timelineAccentBar(status: WeekendStatus, active: boolean) {
  if (active) {
    return "opacity-100";
  }

  if (status === "finished") {
    return "opacity-55";
  }

  if (status === "active") {
    return "opacity-90";
  }

  return "opacity-35";
}

function timelineAccentColor(status: WeekendStatus, active: boolean, countryAccent: string) {
  if (active || status === "upcoming") {
    return { backgroundColor: countryAccent };
  }

  if (status === "finished") {
    return { backgroundColor: "rgb(16 185 129)" };
  }

  return { backgroundColor: "rgb(239 68 68)" };
}

function timelineTitleColor(status: WeekendStatus, active: boolean) {
  if (active) {
    return "text-neutral-950";
  }

  if (status === "finished") {
    return "text-neutral-600";
  }

  if (status === "active") {
    return "text-neutral-950";
  }

  return "text-neutral-700";
}

function timelineMetaColor(status: WeekendStatus, active: boolean) {
  if (active || status === "active") {
    return "text-neutral-500";
  }

  if (status === "finished") {
    return "text-neutral-400";
  }

  return "text-neutral-500/75";
}

function RoundNode({
  round,
  status,
  active,
  emphasized = false,
}: {
  round: number;
  status: WeekendStatus;
  active: boolean;
  emphasized?: boolean;
}) {
  const live = status === "active";
  const done = status === "finished";

  const future = status === "upcoming";

  return (
    <span
      className={cn(
        "relative mx-auto flex size-7 shrink-0 items-center justify-center rounded-full text-center text-[0.6875rem] font-bold tabular-nums ring-[3px] ring-[#eef1f6]/95 transition-colors",
        active
          ? cn(
              "bg-neutral-950 text-white ring-neutral-950/10",
              emphasized && "scale-110 ring-neutral-950/20",
            )
          : done
            ? "bg-emerald-500/12 text-emerald-700 ring-emerald-500/20"
            : live
              ? "bg-white text-red-700 ring-red-500/30"
              : "bg-white/75 text-neutral-500",
      )}
    >
      {future && !active ? (
        <span
          className="pointer-events-none absolute inset-[3px] rounded-full border border-dashed border-black/[0.14]"
          aria-hidden
        />
      ) : null}
      {done && !active ? (
        <Check className="h-3.5 w-3.5 stroke-[2.75]" aria-hidden />
      ) : (
        round
      )}
      {live && !active ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#eef1f6]" />
        </span>
      ) : null}
    </span>
  );
}

function WeekendStatusPill({ status }: { status: WeekendStatus }) {
  if (status === "finished") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-emerald-700">
        <Check className="h-2.5 w-2.5 stroke-[2.75]" aria-hidden />
        Completed
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-red-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        LIVE
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-dashed border-black/[0.12] bg-black/[0.03] px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
      Future
    </span>
  );
}

function MetaChip({
  children,
  live = false,
  status = "upcoming",
  icon,
}: {
  children: ReactNode;
  live?: boolean;
  status?: WeekendStatus;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold",
        live
          ? "bg-red-500/10 text-red-700"
          : status === "finished"
            ? "bg-emerald-500/8 text-emerald-700/90"
            : status === "active"
              ? "bg-red-500/8 text-red-700/90"
              : "border border-dashed border-black/[0.08] bg-black/[0.02] text-neutral-500",
      )}
    >
      {icon}
      {children}
    </span>
  );
}
