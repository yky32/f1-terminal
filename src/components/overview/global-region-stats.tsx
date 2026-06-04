"use client";

import type { RaceRegion } from "@/lib/data/race-profile";
import { useGlobalOverview } from "@/components/overview/global-overview-context";
import { glass, glassFocus, glassInset } from "@/components/glass-surface";
import { cn } from "@/lib/utils";

const REGION_ACCENT: Record<RaceRegion, string> = {
  europe: "bg-violet-500",
  americas: "bg-amber-500",
  asia: "bg-rose-500",
  "middle-east": "bg-orange-500",
  oceania: "bg-teal-500",
};

type GlobalRegionStatsProps = {
  activeRegion: RaceRegion | null;
  onRegionChange: (region: RaceRegion | null) => void;
};

export function GlobalRegionStats({ activeRegion, onRegionChange }: GlobalRegionStatsProps) {
  const { overview, loading } = useGlobalOverview();
  const regions = overview?.regionStats ?? [];

  return (
    <section id="global-regions" className="scroll-mt-28">
      <div className="page-container pb-10 sm:pb-12">
        <div className="mb-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Map layers
          </p>
          <h2 className="mt-2 text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-[-0.03em] text-neutral-950">
            Races by region
          </h2>
          <p className="mt-1 text-[0.8125rem] text-neutral-600">
            Filter circuit markers on the world map · Countries + Circuits
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRegionChange(null)}
            className={cn(
              glassInset,
              glassFocus,
              "rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-colors",
              activeRegion === null
                ? "bg-neutral-950 text-white"
                : "text-neutral-600 hover:text-neutral-950",
            )}
          >
            All regions
          </button>

          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-24 animate-pulse rounded-full bg-black/[0.05]"
                />
              ))
            : regions.map((stat) => {
                const active = activeRegion === stat.region;

                return (
                  <button
                    key={stat.region}
                    type="button"
                    onClick={() => onRegionChange(active ? null : stat.region)}
                    className={cn(
                      glassInset,
                      glassFocus,
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-colors",
                      active
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-700 hover:text-neutral-950",
                    )}
                  >
                    <span
                      className={cn("h-2 w-2 rounded-full", REGION_ACCENT[stat.region])}
                      aria-hidden
                    />
                    {stat.label}
                    <span
                      className={cn(
                        "tabular-nums",
                        active ? "text-white/75" : "text-neutral-500",
                      )}
                    >
                      {stat.raceCount}
                    </span>
                  </button>
                );
              })}
        </div>

        {!loading && regions.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {regions.map((stat) => (
              <div key={stat.region} className={cn(glass, "rounded-[1rem] px-3 py-3")}>
                <p className="text-[0.6875rem] font-semibold text-neutral-950">{stat.label}</p>
                <p className="mt-1 text-[0.75rem] text-neutral-600">
                  {stat.raceCount} races · {stat.circuitCount} circuits
                </p>
                {stat.liveWeekends > 0 ? (
                  <p className="mt-1 text-[0.6875rem] font-medium text-red-700">
                    {stat.liveWeekends} live weekend
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
