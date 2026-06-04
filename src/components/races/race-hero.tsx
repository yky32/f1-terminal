"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { DeferredMount } from "@/components/deferred-mount";
import { MapSectionSkeleton } from "@/components/loading/route-skeletons";
import {
  racesGlassInset,
  racesGlassStrong,
} from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { cn } from "@/lib/utils";

const RaceMapPane = dynamic(
  () =>
    import("@/components/races/race-map-pane").then((module) => ({
      default: module.RaceMapPane,
    })),
  {
    ssr: false,
    loading: () => <MapSectionSkeleton variant="compact" className="absolute inset-0 rounded-none" />,
  },
);

type RaceHeroProps = {
  race: RaceProfile;
  loading?: boolean;
};

export function RaceHero({ race, loading = false }: RaceHeroProps) {
  const statusLabel =
    race.weekendStatus === "active"
      ? "Race weekend active"
      : race.weekendStatus === "upcoming"
        ? "Upcoming"
        : "Completed";

  return (
    <div className={cn(racesGlassStrong, "relative overflow-hidden")} aria-busy={loading}>
      <div className="relative grid lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)]">
        <div className="relative z-[2] min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-neutral-600">
                <span>{race.country}</span>
                <span aria-hidden>·</span>
                <span>{race.season} season</span>
                <span aria-hidden>·</span>
                <span>Round {race.round}</span>
              </div>
              <h2 className="mt-1 text-[clamp(1.375rem,3vw,1.875rem)] font-semibold leading-tight tracking-[-0.03em] text-neutral-950">
                {race.name}
              </h2>
              {loading ? (
                <div className="mt-1 h-4 w-44 max-w-full animate-pulse rounded bg-black/[0.06]" aria-hidden />
              ) : (
                <p className="mt-1 text-[0.875rem] text-neutral-600">
                  {race.circuit.name}
                  {race.liveSessions > 0 ? (
                    <>
                      {" "}
                      ·{" "}
                      <span className="font-semibold text-red-700">
                        {race.liveSessions} live session{race.liveSessions === 1 ? "" : "s"}
                      </span>
                    </>
                  ) : null}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  racesGlassInset,
                  "rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
                  race.weekendStatus === "active" ? "text-amber-700" : "text-neutral-600",
                )}
              >
                {statusLabel}
              </span>
              <Link
                href="/"
                className={cn(
                  racesGlassInset,
                  "rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-600 hover:text-neutral-950",
                )}
              >
                Global map
              </Link>
            </div>
          </div>

          <div className="grid gap-3 px-4 pb-4 sm:grid-cols-3 sm:px-5 sm:pb-5">
            {[
              { label: "Circuit length", value: race.circuit.length ?? "—" },
              { label: "Race laps", value: race.circuit.laps ? String(race.circuit.laps) : "—" },
              {
                label: "Weather",
                value: race.weather ? `${race.weather.airTempC}°C · ${race.weather.condition}` : "—",
              },
            ].map((item) => (
              <div key={item.label} className={cn(racesGlassInset, "rounded-[1rem] px-3 py-3")}>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-1 text-[0.9375rem] font-semibold text-neutral-950">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[12rem] lg:min-h-0">
          <DeferredMount
            placeholder={
              <MapSectionSkeleton variant="compact" className="absolute inset-0 rounded-none" />
            }
          >
            <RaceMapPane race={race} />
          </DeferredMount>
        </div>
      </div>
    </div>
  );
}
