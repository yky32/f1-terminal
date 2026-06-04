"use client";

import { Globe2, MonitorDot, Trophy, type LucideIcon } from "lucide-react";
import { useGlobalOverview } from "@/components/overview/global-overview-context";
import { glassFocus, glassHover, glassInset } from "@/components/glass-surface";
import { DriverIcon } from "@/components/races/driver-icon";
import { TeamIcon } from "@/components/races/team-icon";
import { scrollToSection } from "@/lib/scroll-to-section";
import { cn } from "@/lib/utils";

function JumpIconButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        glassInset,
        glassHover,
        glassFocus,
        "flex h-11 w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-neutral-950",
      )}
    >
      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2} aria-hidden />
    </button>
  );
}

export function GlobalHeroBanner() {
  const { overview, loading } = useGlobalOverview();
  const championship = overview?.championship;

  return (
    <header className="page-container pt-10 pb-6 sm:pt-12 sm:pb-8">
      <div className="flex items-start justify-between gap-5 sm:gap-8">
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-neutral-500">
            {loading ? "Loading season…" : championship?.seasonLabel ?? "Formula One World Championship"}
          </p>
          <h1 className="text-title mt-2 max-w-4xl font-semibold text-neutral-950">
            Monitor F1 everywhere.
          </h1>
          <p className="text-body-large mt-5 max-w-3xl text-neutral-700 sm:mt-6">
            Live and upcoming Grand Prix on a global map — circuit markers, full season calendar,
            and championship standings when you need them.
          </p>

          {championship ? (
            <div
              className={cn(
                glassInset,
                "mt-6 inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full px-4 py-2.5",
              )}
            >
              <Trophy className="h-4 w-4 shrink-0 text-amber-600" strokeWidth={2} aria-hidden />
              <span className="text-[0.8125rem] font-semibold text-neutral-950">
                Championship leader
              </span>
              <span className="text-[0.8125rem] text-neutral-600" aria-hidden>
                ·
              </span>
              <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-neutral-900">
                <DriverIcon
                  driverId={championship.driverId}
                  driverName={championship.driverName}
                  driverAbbr={championship.driverAbbr}
                  driverImage={championship.driverImage}
                  teamId={championship.teamId}
                  teamName={championship.teamName}
                  size="sm"
                />
                {championship.driverName}{" "}
                <span className="font-semibold tabular-nums text-neutral-950">
                  {championship.points} pts
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[0.75rem] text-neutral-500">
                <TeamIcon
                  teamId={championship.teamId}
                  teamName={championship.teamName}
                  teamLogo={championship.teamLogo}
                  size="sm"
                />
                {championship.teamName} · {championship.wins} wins
              </span>
            </div>
          ) : null}
        </div>

        <div
          className={cn(glassInset, "flex shrink-0 items-center gap-1 rounded-full p-1")}
          role="group"
          aria-label="Jump to section"
        >
          <JumpIconButton
            icon={Globe2}
            label="Jump to map"
            onClick={() => scrollToSection("global-map")}
          />
          <JumpIconButton
            icon={MonitorDot}
            label="Jump to standings"
            onClick={() => scrollToSection("global-standings")}
          />
        </div>
      </div>
    </header>
  );
}
