"use client";

import { useEffect, useMemo, useState } from "react";
import {
  racesGlass,
  racesGlassFocus,
} from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { sessionCountdownLabel } from "@/lib/data/live-session";
import { cn } from "@/lib/utils";

type RaceDetailTab = "overview" | "practice" | "qualifying" | "race";

type RaceDetailPanelProps = {
  race: RaceProfile;
  loading?: boolean;
};

const TABS: { id: RaceDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "practice", label: "Practice" },
  { id: "qualifying", label: "Qualifying" },
  { id: "race", label: "Race" },
];

function sessionsForTab(race: RaceProfile, tab: RaceDetailTab) {
  switch (tab) {
    case "practice":
      return race.sessions.filter((session) => session.type.startsWith("FP"));
    case "qualifying":
      return race.sessions.filter((session) => session.type === "Q" || session.type === "SQ");
    case "race":
      return race.sessions.filter((session) => session.type === "R" || session.type === "S");
    default:
      return race.sessions;
  }
}

export function RaceDetailPanel({ race, loading = false }: RaceDetailPanelProps) {
  const [tab, setTab] = useState<RaceDetailTab>("overview");

  useEffect(() => {
    setTab("overview");
  }, [race.id]);

  const tabSessions = useMemo(() => sessionsForTab(race, tab), [race, tab]);

  if (loading) {
    return <div className="h-80 animate-pulse rounded-[1.25rem] bg-black/[0.05]" aria-busy="true" />;
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          racesGlass,
          "flex gap-1 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        role="tablist"
        aria-label={`${race.shortName} sections`}
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              racesGlassFocus,
              "shrink-0 rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors sm:px-4",
              tab === item.id
                ? "bg-foreground text-background"
                : "text-neutral-700 hover:bg-white/50 hover:text-neutral-950",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
          <section className={cn(racesGlass, "overflow-hidden")}>
            <SectionHeader title="Driver standings" meta={`After round ${Math.max(race.round - 1, 0)}`} />
            <StandingsTable
              headers={["Pos", "Driver", "Team", "Pts"]}
              rows={race.driverStandings.map((row) => [
                String(row.position),
                row.driverName,
                row.teamName,
                String(row.points),
              ])}
            />
          </section>

          <section className={cn(racesGlass, "overflow-hidden")}>
            <SectionHeader title="Constructor standings" meta={`${race.season} season`} />
            <StandingsTable
              headers={["Pos", "Team", "Pts"]}
              rows={race.constructorStandings.map((row) => [
                String(row.position),
                row.teamName,
                String(row.points),
              ])}
            />
          </section>

          {race.lapLeaders.length > 0 ? (
            <section className={cn(racesGlass, "overflow-hidden lg:col-span-2")}>
              <SectionHeader title="On-track leaders" meta="Live timing snapshot" />
              <StandingsTable
                headers={["Pos", "Driver", "Team", "Gap", "Last lap"]}
                rows={race.lapLeaders.map((row) => [
                  String(row.position),
                  row.driverName,
                  row.teamName,
                  row.gap,
                  row.lastLap,
                ])}
              />
            </section>
          ) : null}

          {race.weather ? (
            <section className={cn(racesGlass, "p-4 lg:col-span-2")}>
              <SectionHeader title="Weather & strategy layer" meta="Track conditions" />
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Air", value: `${race.weather.airTempC}°C` },
                  { label: "Track", value: `${race.weather.trackTempC}°C` },
                  { label: "Rain chance", value: `${race.weather.rainProbability}%` },
                  { label: "Wind", value: race.weather.wind },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] bg-black/[0.03] px-3 py-3">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[0.9375rem] font-semibold text-neutral-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : (
        <section className={cn(racesGlass, "overflow-hidden")}>
          <SectionHeader
            title={`${TABS.find((item) => item.id === tab)?.label ?? "Sessions"} schedule`}
            meta={`${tabSessions.length} session${tabSessions.length === 1 ? "" : "s"}`}
          />
          <div className="divide-y divide-black/[0.06]">
            {tabSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-[0.875rem] font-semibold text-neutral-950">{session.typeLabel}</p>
                  <p className="text-[0.75rem] text-neutral-600">
                    {new Date(session.date).toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
                    session.status === "Live"
                      ? "bg-red-500/15 text-red-700"
                      : session.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-neutral-900/8 text-neutral-600",
                  )}
                >
                  {session.status === "Scheduled"
                    ? sessionCountdownLabel(session.date)
                    : session.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {race.fastestLaps.length > 0 ? (
        <section className={cn(racesGlass, "overflow-hidden")}>
          <SectionHeader title="Fastest laps" meta="Practice snapshot" />
          <StandingsTable
            headers={["Pos", "Driver", "Team", "Time", "Lap"]}
            rows={race.fastestLaps.map((row) => [
              String(row.position),
              row.driverName,
              row.teamName,
              row.time,
              String(row.lap),
            ])}
          />
        </section>
      ) : null}
    </div>
  );
}

function SectionHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="border-b border-black/[0.06] px-4 py-3">
      <h3 className="text-[0.9375rem] font-semibold text-neutral-950">{title}</h3>
      <p className="mt-0.5 text-[0.75rem] text-neutral-500">{meta}</p>
    </div>
  );
}

function StandingsTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[0.8125rem]">
        <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`} className="border-t border-black/[0.05]">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="px-4 py-2.5 text-neutral-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
