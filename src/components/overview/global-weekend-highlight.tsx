"use client";

import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { WeekendHighlight } from "@/lib/data/global-overview";
import { sessionCountdownLabel } from "@/lib/data/live-session";
import { glass, glassFocus, glassHover } from "@/components/glass-surface";
import { cn } from "@/lib/utils";

type GlobalWeekendHighlightProps = {
  highlight: WeekendHighlight;
  className?: string;
};

export function GlobalWeekendHighlight({ highlight, className }: GlobalWeekendHighlightProps) {
  const isLive = highlight.weekendStatus === "active";
  const isUpcoming = highlight.weekendStatus === "upcoming";

  return (
    <Link
      href={`/races/${highlight.raceId}`}
      className={cn(
        glass,
        glassHover,
        glassFocus,
        "pointer-events-auto block max-w-[15.5rem] rounded-[1.125rem] p-3.5 transition-transform hover:-translate-y-0.5 sm:max-w-[17rem]",
        isLive && "global-weekend-highlight--live",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
          {isLive ? "This weekend" : isUpcoming ? "Next Grand Prix" : "Grand Prix"}
        </p>
        {isLive ? (
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/55" />
            <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-red-600" />
          </span>
        ) : null}
      </div>

      <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-neutral-950">
        {highlight.shortName}
      </h3>
      <p className="mt-0.5 text-[0.75rem] text-neutral-600">{highlight.name}</p>

      <div className="mt-3 space-y-1.5 text-[0.6875rem] text-neutral-600">
        <p className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
          {highlight.circuitName}
        </p>
        <p className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
          Round {highlight.round} · {highlight.city}
        </p>
      </div>

      {highlight.nextSessionLabel ? (
        <p
          className={cn(
            "mt-3 rounded-lg px-2 py-1.5 text-[0.6875rem] font-semibold",
            isLive ? "bg-red-500/10 text-red-800" : "bg-sky-500/10 text-sky-900",
          )}
        >
          {isLive && highlight.liveSessions > 0
            ? `${highlight.liveSessions} live · `
            : null}
          {highlight.nextSessionLabel}
          {highlight.nextSessionStart && !isLive
            ? ` · ${sessionCountdownLabel(highlight.nextSessionStart)}`
            : null}
        </p>
      ) : null}
    </Link>
  );
}
