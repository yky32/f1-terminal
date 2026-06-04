"use client";

import Link from "next/link";
import { useGlobalOverview } from "@/components/overview/global-overview-context";
import { glass, glassFocus, glassHover } from "@/components/glass-surface";
import { TeamBadge } from "@/components/races/f1-visuals";
import { cn } from "@/lib/utils";

export function GlobalStandingsSection() {
  const { overview, loading } = useGlobalOverview();
  const drivers = overview?.driverStandings ?? [];
  const constructors = overview?.constructorStandings ?? [];

  return (
    <section id="global-standings" className="scroll-mt-28">
      <div className="page-container py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Standings
            </p>
            <h2 className="mt-2 text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold tracking-[-0.03em] text-neutral-950">
              Championship tables
            </h2>
          </div>
          <Link
            href="/races"
            className={cn(glass, glassHover, glassFocus, "rounded-full px-4 py-2 text-[0.8125rem] font-medium text-neutral-700")}
          >
            Race dashboards
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className={cn(glass, "overflow-hidden")}>
            <div className="border-b border-black/[0.06] px-4 py-3">
              <h3 className="text-[0.8125rem] font-semibold text-neutral-950">
                Driver standings · Top 10
              </h3>
              <p className="mt-0.5 text-[0.6875rem] text-neutral-500">API-Sports · Rankings / drivers</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[20rem] text-left text-[0.8125rem]">
                <thead>
                  <tr className="border-b border-black/[0.05] text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                    <th className="px-4 py-2.5">Pos</th>
                    <th className="px-2 py-2.5">Driver</th>
                    <th className="px-2 py-2.5">Team</th>
                    <th className="px-4 py-2.5 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <tr key={index} className="border-b border-black/[0.04]">
                          <td colSpan={4} className="px-4 py-3">
                            <div className="h-4 animate-pulse rounded bg-black/[0.05]" />
                          </td>
                        </tr>
                      ))
                    : drivers.map((row) => (
                        <tr
                          key={row.driverId}
                          className="border-b border-black/[0.04] last:border-0"
                        >
                          <td className="px-4 py-2.5 font-semibold tabular-nums text-neutral-500">
                            {row.position}
                          </td>
                          <td className="px-2 py-2.5">
                            <span className="font-semibold text-neutral-950">{row.driverName}</span>
                            <span className="ml-1.5 text-[0.6875rem] text-neutral-500">
                              {row.driverAbbr}
                            </span>
                          </td>
                          <td className="px-2 py-2.5">
                            <TeamBadge
                              teamId={row.teamId}
                              teamName={row.teamName}
                              className="max-w-[8rem] sm:max-w-none"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-neutral-950">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className={cn(glass, "flex flex-col overflow-hidden")}>
            <div className="border-b border-black/[0.06] px-4 py-3">
              <h3 className="text-[0.8125rem] font-semibold text-neutral-950">
                Constructor standings
              </h3>
              <p className="mt-0.5 text-[0.6875rem] text-neutral-500">API-Sports · Rankings / teams</p>
            </div>
            <ul className="divide-y divide-black/[0.05]">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <li key={index} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-black/[0.05]" />
                    </li>
                  ))
                : constructors.map((row) => (
                    <li
                      key={row.teamId}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="w-5 shrink-0 text-[0.75rem] font-semibold tabular-nums text-neutral-400">
                          {row.position}
                        </span>
                        <TeamBadge teamId={row.teamId} teamName={row.teamName} />
                      </div>
                      <span className="shrink-0 text-[0.8125rem] font-semibold tabular-nums text-neutral-900">
                        {row.points}
                      </span>
                    </li>
                  ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
