"use client";

import { Check, Radio } from "lucide-react";
import type { ReactNode } from "react";
import { racesGlassFocus } from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import type { WeekendStatus } from "@/lib/data/live-session";
import { countryAccentColor, countryIsoCode } from "@/lib/f1/country-flags";
import { cn } from "@/lib/utils";

type RaceCalendarItemProps = {
  race: RaceProfile;
  active: boolean;
  loaded: boolean;
  onClick: () => void;
};

export function RaceCalendarItem({ race, active, loaded, onClick }: RaceCalendarItemProps) {
  const accent = countryAccentColor(race.country);
  const iso = countryIsoCode(race.country);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        racesGlassFocus,
        "group relative flex w-full items-stretch gap-2.5 py-0.5 text-left outline-none",
      )}
    >
      <span className="relative z-[1] flex w-9 shrink-0 justify-center self-start pt-2">
        <RoundNode round={race.round} status={race.weekendStatus} active={active} />
      </span>

      <span
        className={cn(
          "relative min-w-0 flex-1 overflow-hidden rounded-[0.875rem] border transition-[background-color,border-color,box-shadow,transform] duration-200",
          active
            ? "border-neutral-900/14 bg-white/92 shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
            : "border-black/[0.04] bg-white/45 group-hover:border-black/[0.08] group-hover:bg-white/78",
        )}
      >
        <span
          className="absolute inset-y-2 left-0 w-[3px] rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />

        <span className="flex items-start gap-2 px-3 py-2.5 pl-3.5">
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2">
              <span className="truncate text-[0.875rem] font-semibold tracking-[-0.01em] text-neutral-950">
                {race.shortName}
              </span>
              <WeekendStatusPill status={race.weekendStatus} />
            </span>

            <span className="mt-0.5 block truncate text-[0.75rem] text-neutral-500">
              {race.city}
              {iso ? <span className="text-neutral-400"> · {iso}</span> : null}
            </span>

            {loaded ? (
              <span className="mt-2 flex flex-wrap items-center gap-1.5">
                {race.liveSessions > 0 ? (
                  <MetaChip live icon={<Radio className="h-3 w-3" strokeWidth={2.25} />}>
                    {race.liveSessions} live
                  </MetaChip>
                ) : null}
                {race.sessions.length > 0 ? (
                  <MetaChip>{race.sessions.length} sessions</MetaChip>
                ) : null}
                {race.driverStandings.length > 0 ? <MetaChip>Standings</MetaChip> : null}
              </span>
            ) : (
              <span className="mt-2 inline-block text-[0.6875rem] text-neutral-400">
                Tap to load weekend data
              </span>
            )}
          </span>
        </span>
      </span>
    </button>
  );
}

function RoundNode({
  round,
  status,
  active,
}: {
  round: number;
  status: WeekendStatus;
  active: boolean;
}) {
  const live = status === "active";
  const done = status === "finished";

  return (
    <span
      className={cn(
        "relative flex h-7 w-7 items-center justify-center rounded-full text-[0.6875rem] font-bold tabular-nums ring-[3px] ring-[#eef1f6]/95 transition-colors",
        active
          ? "bg-neutral-950 text-white ring-neutral-950/10"
          : live
            ? "bg-white text-red-700 ring-red-500/20"
            : done
              ? "bg-white/90 text-neutral-500 ring-black/[0.05]"
              : "bg-white/75 text-neutral-600 ring-black/[0.04]",
      )}
    >
      {done && !active ? (
        <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden />
      ) : (
        round
      )}
      {live && !active ? (
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#eef1f6]" />
      ) : null}
    </span>
  );
}

function WeekendStatusPill({ status }: { status: WeekendStatus }) {
  if (status === "finished") {
    return (
      <span className="shrink-0 rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        Done
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
        Live
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-black/[0.04] px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
      Next
    </span>
  );
}

function MetaChip({
  children,
  live = false,
  icon,
}: {
  children: ReactNode;
  live?: boolean;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold",
        live ? "bg-red-500/10 text-red-700" : "bg-black/[0.05] text-neutral-600",
      )}
    >
      {icon}
      {children}
    </span>
  );
}
