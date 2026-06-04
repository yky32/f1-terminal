"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { CloudSun, Flag, Route, Timer } from "lucide-react";
import { DeferredMount } from "@/components/deferred-mount";
import { MapSectionSkeleton } from "@/components/loading/route-skeletons";
import { LiveSessionIcon, WeekendStatusBadge } from "@/components/races/f1-visuals";
import { RaceCountryFlag } from "@/components/races/country-flag";
import {
  racesGlassFocus,
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
  const info = race.circuitInfo;
  const lapRecordLabel = info.lapRecord
    ? `${info.lapRecord}${info.lapRecordHolder ? ` · ${info.lapRecordHolder}` : ""}`
    : "—";

  const statItems = [
    { label: "Length", value: info.length ?? race.circuit.length ?? "—", icon: Route },
    { label: "Laps", value: info.laps ? String(info.laps) : "—", icon: Flag },
    { label: "Lap record", value: lapRecordLabel, icon: Timer },
    {
      label: "Weather",
      value: race.weather ? `${race.weather.airTempC}°C · ${race.weather.condition}` : "—",
      icon: CloudSun,
    },
  ];

  return (
    <div
      className={cn(racesGlassStrong, "race-hero-shell relative overflow-hidden")}
      aria-busy={loading}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:min-h-[13.5rem]">
        <div className="relative min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-5 sm:py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-neutral-600">
                <span className="inline-flex items-center gap-1.5">
                  <RaceCountryFlag country={race.country} size="xs" />
                  <span>{race.country}</span>
                </span>
                <span className="text-neutral-300" aria-hidden>
                  ·
                </span>
                <span>{info.location}</span>
                <span className="text-neutral-300" aria-hidden>
                  ·
                </span>
                <span>
                  {race.season} · R{race.round}
                </span>
              </div>
              <h2 className="mt-1 text-[clamp(1.25rem,2.4vw,1.625rem)] font-semibold leading-tight tracking-[-0.03em] text-neutral-950">
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
                      <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                        <LiveSessionIcon />
                        {race.liveSessions} live
                      </span>
                    </>
                  ) : null}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <WeekendStatusBadge status={race.weekendStatus} />
              <Link
                href="/"
                className={cn(
                  racesGlassInset,
                  racesGlassFocus,
                  "rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-600 transition-colors hover:text-neutral-950",
                )}
              >
                Global map
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:px-5 sm:pb-5 xl:grid-cols-4">
            {statItems.map((item) => (
              <div
                key={item.label}
                className="race-hero-stat min-w-0 rounded-[0.875rem] px-3 py-2.5"
              >
                <p className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  <item.icon className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                  {item.label}
                </p>
                <p
                  className="mt-1 truncate text-[0.8125rem] font-semibold text-neutral-950"
                  title={item.value}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="race-hero-map-well relative min-h-[11rem] border-t border-black/[0.06] lg:min-h-[13.5rem] lg:border-l lg:border-t-0">
          <DeferredMount
            placeholder={
              <MapSectionSkeleton variant="compact" className="absolute inset-0 rounded-none" />
            }
          >
            <RaceMapPane race={race} variant="hero" />
          </DeferredMount>
        </div>
      </div>
    </div>
  );
}
