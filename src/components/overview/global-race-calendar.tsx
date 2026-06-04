"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  LayoutGrid,
  Radio,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGlobalOverview } from "@/components/overview/global-overview-context";
import type { GlobalRaceCalendarEntry } from "@/lib/data/global-overview";
import type { WeekendStatus } from "@/lib/data/live-session";
import { glassCard, glassFocus, glassHover, glassInset } from "@/components/glass-surface";
import {
  calendarFocusTarget,
  daysInMonth,
  groupRacesByMonth,
  initialCalendarMonthIndex,
  mondayFirstOffset,
  racesByDayInMonth,
  readGlobalCalendarView,
  writeGlobalCalendarView,
  type CalendarFocusTarget,
  type GlobalCalendarViewMode,
} from "@/lib/f1/global-calendar-view";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<
  WeekendStatus,
  { dot: string; chip: string; label: string }
> = {
  finished: {
    dot: "bg-emerald-500",
    chip: "bg-emerald-500/12 text-emerald-800",
    label: "Completed",
  },
  active: {
    dot: "bg-red-500",
    chip: "bg-red-500/12 text-red-800",
    label: "Live weekend",
  },
  upcoming: {
    dot: "bg-sky-500",
    chip: "bg-sky-500/12 text-sky-800",
    label: "Upcoming",
  },
};

const VIEW_OPTIONS: {
  id: GlobalCalendarViewMode;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "carousel", label: "Carousel", icon: GalleryHorizontal },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "grid", label: "Grid", icon: LayoutGrid },
];

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function GlobalRaceCalendar() {
  const { overview, loading } = useGlobalOverview();
  const calendar = overview?.calendar ?? [];
  const [view, setView] = useState<GlobalCalendarViewMode>("carousel");

  useEffect(() => {
    setView(readGlobalCalendarView());
  }, []);

  const setViewPersisted = useCallback((mode: GlobalCalendarViewMode) => {
    setView(mode);
    writeGlobalCalendarView(mode);
  }, []);

  return (
    <section id="global-calendar" className="scroll-mt-28">
      <div className="page-container py-8 sm:py-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Race calendar
            </p>
            <h2 className="mt-2 text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tracking-[-0.03em] text-neutral-950">
              {overview?.season ?? "—"} season · {calendar.length} Grands Prix
            </h2>
          </div>

          <CalendarViewToggle view={view} onChange={setViewPersisted} />
        </div>

        {loading ? (
          <CalendarLoadingSkeleton view={view} />
        ) : view === "carousel" ? (
          <CarouselView races={calendar} />
        ) : view === "grid" ? (
          <GridView races={calendar} />
        ) : (
          <CalendarMonthView races={calendar} />
        )}
      </div>
    </section>
  );
}

function CalendarViewToggle({
  view,
  onChange,
}: {
  view: GlobalCalendarViewMode;
  onChange: (mode: GlobalCalendarViewMode) => void;
}) {
  return (
    <div
      className={cn(glassInset, "flex shrink-0 items-center gap-0.5 rounded-full p-1")}
      role="group"
      aria-label="Calendar view"
    >
      {VIEW_OPTIONS.map((option) => {
        const Icon = option.icon;
        const active = view === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            title={option.label}
            onClick={() => onChange(option.id)}
            className={cn(
              glassFocus,
              "inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9",
              active
                ? "bg-neutral-950 text-white"
                : "text-neutral-600 hover:text-neutral-950",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
            <span className="sr-only">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function CalendarLoadingSkeleton({ view }: { view: GlobalCalendarViewMode }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={cn(glassCard, "h-28 animate-pulse opacity-70")}
          />
        ))}
      </div>
    );
  }

  if (view === "calendar") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className={cn(glassInset, "h-9 w-9 animate-pulse rounded-full opacity-70")} />
          <div className="h-4 w-32 animate-pulse rounded bg-black/[0.05]" />
          <div className={cn(glassInset, "h-9 w-9 animate-pulse rounded-full opacity-70")} />
        </div>
        <div className={cn(glassCard, "h-64 animate-pulse opacity-70")} />
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={cn(glassCard, "h-28 w-36 shrink-0 animate-pulse opacity-70")}
        />
      ))}
    </div>
  );
}

function CarouselView({ races }: { races: GlobalRaceCalendarEntry[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 overscroll-x-contain">
      {races.map((race) => (
        <RaceCalendarCard
          key={race.id}
          race={race}
          className="w-[8.75rem] shrink-0 sm:w-[9.25rem]"
        />
      ))}
    </div>
  );
}

function GridView({ races }: { races: GlobalRaceCalendarEntry[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {races.map((race) => (
        <RaceCalendarCard key={race.id} race={race} className="min-w-0" />
      ))}
    </div>
  );
}

function CalendarMonthView({ races }: { races: GlobalRaceCalendarEntry[] }) {
  const months = groupRacesByMonth(races);
  const focus = calendarFocusTarget(months);
  const [monthIndex, setMonthIndex] = useState(0);
  const [emphasisRaceId, setEmphasisRaceId] = useState<string | null>(null);

  useEffect(() => {
    setMonthIndex(initialCalendarMonthIndex(months));
    setEmphasisRaceId(null);
  }, [races]);

  useEffect(() => {
    if (!emphasisRaceId) return undefined;
    const timer = window.setTimeout(() => setEmphasisRaceId(null), 2400);
    return () => window.clearTimeout(timer);
  }, [emphasisRaceId]);

  if (months.length === 0) {
    return (
      <div className={cn(glassCard, "px-4 py-8 text-center text-[0.875rem] text-neutral-600")}>
        No race dates available for this season.
      </div>
    );
  }

  const safeIndex = Math.min(monthIndex, months.length - 1);
  const bucket = months[safeIndex];
  const onFocusMonth = focus
    ? () => {
        setMonthIndex(focus.monthIndex);
        setEmphasisRaceId(focus.raceId);
      }
    : undefined;

  return (
    <div className="space-y-3">
      <PageFlipNav
        label={bucket.label}
        page={safeIndex}
        pageCount={months.length}
        onPrevious={() => setMonthIndex((current) => Math.max(0, current - 1))}
        onNext={() => setMonthIndex((current) => Math.min(months.length - 1, current + 1))}
        focus={focus}
        onFocus={onFocusMonth}
        isFocusMonth={safeIndex === focus?.monthIndex}
      />
      <MonthCalendarPanel
        bucket={bucket}
        emphasisRaceId={emphasisRaceId}
        focusRaceId={focus?.kind === "active" ? focus.raceId : null}
      />
    </div>
  );
}

function PageFlipNav({
  label,
  page,
  pageCount,
  onPrevious,
  onNext,
  focus,
  onFocus,
  isFocusMonth,
}: {
  label: string;
  page: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
  focus?: CalendarFocusTarget | null;
  onFocus?: () => void;
  isFocusMonth?: boolean;
}) {
  const atStart = page <= 0;
  const atEnd = page >= pageCount - 1;
  const focusLabel = focus?.kind === "active" ? "Live weekend" : "Next GP";

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-center gap-2 sm:flex-1 sm:gap-3">
        <PageFlipButton
          direction="previous"
          disabled={atStart}
          onClick={onPrevious}
        />
        <div className="min-w-0 text-center">
          <p className="truncate text-[0.8125rem] font-semibold text-neutral-950">{label}</p>
          {pageCount > 1 ? (
            <p className="mt-0.5 text-[0.6875rem] tabular-nums text-neutral-500">
              {page + 1} / {pageCount}
            </p>
          ) : null}
        </div>
        <PageFlipButton direction="next" disabled={atEnd} onClick={onNext} />
      </div>

      {focus && onFocus ? (
        <button
          type="button"
          onClick={onFocus}
          aria-current={isFocusMonth ? "true" : undefined}
          className={cn(
            glassInset,
            glassFocus,
            "inline-flex items-center justify-center gap-1.5 self-center rounded-full px-3 py-2 text-[0.75rem] font-semibold transition-colors sm:self-auto",
            isFocusMonth
              ? focus.kind === "active"
                ? "bg-red-500/12 text-red-800 ring-1 ring-red-500/25"
                : "bg-sky-500/12 text-sky-900 ring-1 ring-sky-500/25"
              : "text-neutral-700 hover:bg-white/60 hover:text-neutral-950",
          )}
        >
          {focus.kind === "active" ? (
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
              <span className="absolute inset-0 animate-ping rounded-full bg-red-500/55" />
              <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-red-600" />
            </span>
          ) : (
            <Radio className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
          )}
          {focusLabel}
        </button>
      ) : null}
    </div>
  );
}

function PageFlipButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  const label = direction === "previous" ? "Previous page" : "Next page";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        glassInset,
        glassFocus,
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-700 transition-colors",
        disabled
          ? "cursor-not-allowed opacity-35"
          : "hover:bg-white/60 hover:text-neutral-950",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
    </button>
  );
}

function MonthCalendarPanel({
  bucket,
  emphasisRaceId,
  focusRaceId,
}: {
  bucket: ReturnType<typeof groupRacesByMonth>[number];
  emphasisRaceId?: string | null;
  focusRaceId?: string | null;
}) {
  const racesOnDay = racesByDayInMonth(bucket.races);
  const leadingBlanks = mondayFirstOffset(bucket.year, bucket.month);
  const totalDays = daysInMonth(bucket.year, bucket.month);
  const cells: Array<{ kind: "blank" } | { kind: "day"; day: number }> = [];

  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push({ kind: "blank" });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({ kind: "day", day });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ kind: "blank" });
  }

  return (
    <section className={cn(glassCard, "overflow-hidden p-3 sm:p-4")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[0.9375rem] font-semibold text-neutral-950">{bucket.label}</h3>
        <span className="text-[0.6875rem] font-medium text-neutral-500">
          {bucket.races.length} GP{bucket.races.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="px-1 py-1 text-center text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-neutral-400"
          >
            {label}
          </div>
        ))}

        {cells.map((cell, index) => {
          if (cell.kind === "blank") {
            return (
              <div
                key={`blank-${index}`}
                className="min-h-[4.5rem] rounded-lg bg-black/[0.02] sm:min-h-[5.25rem]"
                aria-hidden
              />
            );
          }

          const dayRaces = racesOnDay.get(cell.day) ?? [];
          const isRaceDay = dayRaces.length > 0;
          const hasLiveRace = dayRaces.some((race) => race.weekendStatus === "active");

          return (
            <div
              key={`day-${cell.day}`}
              className={cn(
                "min-h-[4.5rem] rounded-lg border p-1 sm:min-h-[5.25rem] sm:p-1.5",
                hasLiveRace
                  ? "border-red-500/25 bg-red-500/[0.06]"
                  : isRaceDay
                    ? "border-white/30 bg-white/30"
                    : "border-transparent bg-black/[0.02]",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem] font-semibold tabular-nums",
                  hasLiveRace
                    ? "bg-red-600 text-white"
                    : isRaceDay
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-500",
                )}
              >
                {cell.day}
              </span>

              <div className="mt-1 space-y-1">
                {dayRaces.map((race) => {
                  const isLive = race.weekendStatus === "active";
                  const isFocusedLive = isLive && race.id === focusRaceId;
                  const isEmphasized = race.id === emphasisRaceId;

                  return (
                    <Link
                      key={race.id}
                      href={`/races/${race.id}`}
                      className={cn(
                        glassFocus,
                        "block rounded-md px-1.5 py-1 transition-colors hover:bg-white/50",
                        isLive &&
                          "bg-red-500/10 ring-1 ring-red-500/35",
                        isFocusedLive && "ring-2 ring-red-500/45",
                        isEmphasized && "global-calendar-live-emphasis",
                      )}
                      title={race.name}
                    >
                      <p className="truncate text-[0.625rem] font-bold tabular-nums text-neutral-400">
                        R{race.round}
                        {isLive ? (
                          <span className="ml-1 uppercase tracking-[0.06em] text-red-700">Live</span>
                        ) : null}
                      </p>
                      <p className="truncate text-[0.6875rem] font-semibold leading-tight text-neutral-950">
                        {race.shortName}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RaceCalendarCard({
  race,
  className,
}: {
  race: GlobalRaceCalendarEntry;
  className?: string;
}) {
  const style = STATUS_STYLES[race.weekendStatus];
  const raceDay = new Date(race.raceDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/races/${race.id}`}
      className={cn(
        glassCard,
        glassHover,
        glassFocus,
        "flex flex-col p-3",
        race.weekendStatus === "active" && "ring-1 ring-red-500/25",
        race.weekendStatus === "upcoming" &&
          "opacity-[0.82] saturate-[0.88] transition-[opacity,filter] hover:opacity-100 hover:saturate-100",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[0.625rem] font-bold tabular-nums text-neutral-400">
          R{race.round}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.06em]",
            style.chip,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
          {style.label}
        </span>
      </div>
      <p className="mt-2 text-[0.8125rem] font-semibold leading-tight text-neutral-950">
        {race.shortName}
      </p>
      <p className="mt-1 text-[0.6875rem] text-neutral-500">{race.city}</p>
      <p className="mt-2 text-[0.625rem] font-medium tabular-nums text-neutral-400">{raceDay}</p>
    </Link>
  );
}
