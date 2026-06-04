"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PanelLeftClose } from "lucide-react";
import type { RaceProfile } from "@/lib/data/race-profile";
import { CURRENT_SEASON } from "@/lib/f1/race-catalog";
import { RaceCalendarItem } from "@/components/races/race-calendar-item";
import {
  raceCalendarTimelineAxisClass,
  raceCalendarTimelineVars,
  scrollRaceCalendarItemToTop,
} from "@/components/races/race-calendar-timeline";
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
  const listScrollRef = useRef<HTMLDivElement>(null);
  const [emphasizedId, setEmphasizedId] = useState<string | null>(null);
  const emphasizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const season = races[0]?.season ?? CURRENT_SEASON;
  const total = races.length;
  const completed = races.filter((race) => race.weekendStatus === "finished").length;
  const activeRace = races.find((race) => race.weekendStatus === "active");
  const selectedRace = races.find((race) => race.id === selectedId) ?? null;
  const selectedPosition =
    selectedRace && total > 0 ? roundCenterPercent(selectedRace.round, total) : null;

  /** Align fill end with round centers (same coordinate system as the pin). */
  const fillPercent = useMemo(() => {
    if (total <= 0) {
      return 0;
    }

    const completedEnd =
      completed > 0 ? roundCenterPercent(completed, total) : 0;

    if (activeRace) {
      return Math.max(completedEnd, roundCenterPercent(activeRace.round, total));
    }

    return completedEnd;
  }, [activeRace, completed, total]);

  const handleSliderSelect = useCallback(
    (raceId: string) => {
      if (raceId === selectedId) {
        return;
      }

      onSelect(raceId);
    },
    [onSelect, selectedId],
  );

  const revealRaceInTimeline = useCallback(
    (raceId: string, behavior: ScrollBehavior = "smooth") => {
      const container = listScrollRef.current;
      if (container) {
        scrollRaceCalendarItemToTop(container, raceId, behavior);
      }

      setEmphasizedId(raceId);

      if (emphasizeTimerRef.current) {
        clearTimeout(emphasizeTimerRef.current);
      }

      emphasizeTimerRef.current = setTimeout(() => {
        setEmphasizedId((current) => (current === raceId ? null : current));
        emphasizeTimerRef.current = null;
      }, 1400);
    },
    [],
  );

  const handleGoToLiveRound = useCallback(() => {
    if (!activeRace) {
      return;
    }

    if (activeRace.id !== selectedId) {
      onSelect(activeRace.id);
      return;
    }

    revealRaceInTimeline(activeRace.id, "auto");
    requestAnimationFrame(() => {
      revealRaceInTimeline(activeRace.id, "smooth");
    });
  }, [activeRace, onSelect, revealRaceInTimeline, selectedId]);

  useLayoutEffect(() => {
    if (races.length === 0) {
      return;
    }

    revealRaceInTimeline(selectedId, "auto");

    const smoothScroll = requestAnimationFrame(() => {
      revealRaceInTimeline(selectedId, "smooth");
    });

    return () => {
      cancelAnimationFrame(smoothScroll);
    };
  }, [races.length, selectedId, revealRaceInTimeline]);

  useEffect(() => {
    return () => {
      if (emphasizeTimerRef.current) {
        clearTimeout(emphasizeTimerRef.current);
      }
    };
  }, []);

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

        <SeasonProgressBar
          races={races}
          total={total}
          fillPercent={fillPercent}
          selectedRace={selectedRace}
          selectedPosition={selectedPosition}
          onSelectRound={handleSliderSelect}
        />

        {selectedRace ? (
          <p className="mt-2.5 text-[0.75rem] leading-snug text-neutral-600">
            <span className="font-semibold text-neutral-900">
              R{selectedRace.round} {selectedRace.shortName}
            </span>
            <span className="text-neutral-400"> · </span>
            Round {selectedRace.round} of {total}
            <span className="text-neutral-400"> · </span>
            <SeasonRoundStatusLabel status={selectedRace.weekendStatus} />
            {selectedPosition != null ? (
              <>
                <span className="text-neutral-400"> · </span>
                <span className="text-neutral-500">
                  {Math.round(selectedPosition)}%
                </span>
              </>
            ) : null}
          </p>
        ) : null}

        {activeRace ? (
          <p className={cn("text-[0.8125rem] leading-snug text-neutral-600", selectedRace ? "mt-2" : "mt-3")}>
            <button
              type="button"
              onClick={handleGoToLiveRound}
              className={cn(
                racesGlassFocus,
                "inline-flex items-center gap-1.5 rounded-md font-semibold text-red-700 transition-colors hover:bg-red-500/[0.08] hover:text-red-800",
              )}
              aria-label={`Go to live round ${activeRace.round}, ${activeRace.shortName}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              Round {activeRace.round} Live
            </button>
            {activeRace.id !== selectedRace?.id ? (
              <>
                <span className="text-neutral-400"> · </span>
                {activeRace.name}
              </>
            ) : null}
          </p>
        ) : !selectedRace ? (
          <p className="mt-3 text-[0.8125rem] text-neutral-500">
            {completed === total
              ? "Season complete — browse any round."
              : "Pick a round to open its dashboard."}
          </p>
        ) : null}
      </header>

      <div
        ref={listScrollRef}
        className="min-h-0 flex-1 overflow-y-auto pr-0.5 [scrollbar-width:thin]"
      >
        <div className={cn("relative pb-1", raceCalendarTimelineVars)}>
          <div
            className={cn(
              "pointer-events-none absolute bottom-4 top-4 w-px -translate-x-1/2 bg-gradient-to-b from-black/[0.08] via-black/[0.06] to-transparent",
              raceCalendarTimelineAxisClass,
            )}
            aria-hidden
          />

          <div className="space-y-0.5">
            {races.map((race) => (
              <RaceCalendarItem
                key={race.id}
                race={race}
                active={race.id === selectedId}
                emphasized={race.id === emphasizedId}
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

function roundCenterPercent(round: number, total: number) {
  return ((round - 0.5) / total) * 100;
}

function roundFromPercent(percent: number, total: number) {
  const clamped = Math.min(100, Math.max(0, percent));
  let nearestRound = 1;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let round = 1; round <= total; round += 1) {
    const distance = Math.abs(clamped - roundCenterPercent(round, total));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestRound = round;
    }
  }

  return nearestRound;
}

function SeasonProgressBar({
  races,
  total,
  fillPercent,
  selectedRace,
  selectedPosition,
  onSelectRound,
}: {
  races: RaceProfile[];
  total: number;
  fillPercent: number;
  selectedRace: RaceProfile | null;
  selectedPosition: number | null;
  onSelectRound: (raceId: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const markerStatus = selectedRace?.weekendStatus;

  const pickRoundFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || total <= 0) {
        return;
      }

      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) {
        return;
      }

      const percent = ((clientX - rect.left) / rect.width) * 100;
      const round = roundFromPercent(percent, total);
      const race = races[round - 1];
      if (race) {
        onSelectRound(race.id);
      }
    },
    [onSelectRound, races, total],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    draggingRef.current = true;
    setIsDragging(true);
    trackRef.current?.setPointerCapture(event.pointerId);
    pickRoundFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) {
      return;
    }

    pickRoundFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setIsDragging(false);
    if (trackRef.current?.hasPointerCapture(event.pointerId)) {
      trackRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="relative mt-3">
      <div
        ref={trackRef}
        className="relative h-1.5 touch-none overflow-visible rounded-full bg-black/[0.06] cursor-pointer select-none"
        role="slider"
        aria-valuenow={selectedRace?.round ?? 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuetext={
          selectedRace
            ? `Round ${selectedRace.round}, ${selectedRace.shortName}`
            : `Round 1 of ${total}`
        }
        aria-label="Select season round"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-neutral-900 transition-[width] duration-500 ease-out"
          style={{ width: `${fillPercent}%` }}
          aria-hidden
        />

        {selectedPosition != null && selectedRace ? (
          <span
            className="absolute top-1/2 z-[1] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center active:cursor-grabbing"
            style={{ left: `${selectedPosition}%` }}
            title={`R${selectedRace.round} ${selectedRace.shortName}`}
          >
            <span
              className={cn(
                "block h-3 w-3 rounded-full border-2 border-white shadow-sm ring-1 transition-transform duration-150",
                isDragging ? "scale-125" : "scale-100",
                markerStatus === "finished"
                  ? "bg-emerald-600 ring-emerald-600/25"
                  : markerStatus === "active"
                    ? "bg-red-500 ring-red-500/25"
                    : "bg-neutral-950 ring-neutral-950/20",
              )}
              aria-hidden
            />
          </span>
        ) : null}
      </div>

      <div className="mt-1.5 flex justify-between text-[0.5625rem] font-medium uppercase tracking-[0.08em] text-neutral-400">
        <span>R1</span>
        <span>R{total}</span>
      </div>
    </div>
  );
}

function SeasonRoundStatusLabel({ status }: { status: RaceProfile["weekendStatus"] }) {
  if (status === "finished") {
    return <span className="text-emerald-700">Completed</span>;
  }

  if (status === "active") {
    return <span className="text-red-700">Live weekend</span>;
  }

  return <span className="text-neutral-500">Upcoming</span>;
}
