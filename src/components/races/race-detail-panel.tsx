"use client";

import {
  CalendarDays,
  CloudSun,
  Flag,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import {
  RaceCircuitHistorySection,
  RaceCircuitInfoSection,
  RaceDriverPerformanceSection,
  RaceResultsSection,
  RaceSessionListSection,
  RaceStandingsImpactSection,
} from "@/components/races/race-detail-sections";
import { useEffect, useMemo, useState } from "react";
import {
  DataPresenceBadge,
  DriverAvatar,
  EmptyDataState,
  PositionBadge,
  TeamBadge,
} from "@/components/races/f1-visuals";
import {
  racesGlass,
  racesGlassFocus,
} from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { driverAbbrFromName, getTeamVisual } from "@/lib/f1/team-visuals";
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
  const hasStandings =
    race.driverStandings.length > 0 || race.constructorStandings.length > 0;

  if (loading) {
    return <div className="h-80 animate-pulse rounded-[1.25rem] bg-black/[0.05]" aria-busy="true" />;
  }

  return (
    <div className="space-y-4">
      <div
        className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                : "text-neutral-600 hover:bg-black/[0.05] hover:text-neutral-950",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <OverviewTabContent race={race} hasStandings={hasStandings} />
      ) : null}

      {tab === "practice" ? (
        <div className="flex flex-col gap-4">
          <RaceSessionListSection
            title="Practice schedule"
            meta="FP1 · FP2 · FP3"
            sessions={tabSessions}
          />
          {race.fastestLaps.length > 0 ? (
            <section className={cn(racesGlass, "overflow-hidden")}>
              <SectionHeader
                icon={Timer}
                title="Fastest laps"
                meta="Practice sessions"
                badge={<DataPresenceBadge label={`${race.fastestLaps.length} laps`} />}
              />
              <FastestLapsTable rows={race.fastestLaps} />
            </section>
          ) : null}
        </div>
      ) : null}

      {tab === "qualifying" ? (
        <div className="flex flex-col gap-4">
          <RaceSessionListSection
            title="Qualifying schedule"
            meta="Qualifying · Sprint qualifying"
            sessions={tabSessions}
          />
          <RaceDriverPerformanceSection race={race} mode="grid" />
        </div>
      ) : null}

      {tab === "race" ? (
        <div className="flex flex-col gap-4">
          <RaceSessionListSection
            title="Race schedule"
            meta="Grand Prix · Sprint"
            sessions={tabSessions}
          />
          <RaceResultsSection race={race} />
          <RaceDriverPerformanceSection race={race} mode="race" />
          {race.raceResults.length === 0 && race.driverPerformance.length === 0 ? (
            <section className={cn(racesGlass, "overflow-hidden")}>
              <EmptyDataState
                icon={Trophy}
                title="Results after chequered flag"
                description="Final classification and points will appear here once the race is completed."
              />
            </section>
          ) : null}
          {race.lapLeaders.length > 0 ? (
            <section className={cn(racesGlass, "overflow-hidden")}>
              <SectionHeader
                icon={Trophy}
                title="On-track leaders"
                meta="Live timing snapshot"
                badge={<DataPresenceBadge label="Live" />}
              />
              <LapLeadersTable rows={race.lapLeaders} />
            </section>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}

function OverviewTabContent({
  race,
  hasStandings,
}: {
  race: RaceProfile;
  hasStandings: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <RaceCircuitInfoSection race={race} />
      <RaceCircuitHistorySection race={race} />
      <RaceStandingsImpactSection race={race} />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <section className={cn(racesGlass, "overflow-hidden")}>
          <SectionHeader
            icon={Users}
            title="Driver standings"
            meta={`After round ${Math.max(race.round - 1, 0)}`}
            badge={
              race.driverStandings.length > 0 ? (
                <DataPresenceBadge label={`${race.driverStandings.length} drivers`} />
              ) : null
            }
          />
          {race.driverStandings.length > 0 ? (
            <DriverStandingsTable rows={race.driverStandings} />
          ) : (
            <EmptyDataState
              icon={Trophy}
              title="Standings loading"
              description="Driver points will appear once this weekend's data is fetched."
            />
          )}
        </section>

        <section className={cn(racesGlass, "overflow-hidden")}>
          <SectionHeader
            icon={Flag}
            title="Constructor standings"
            meta={`${race.season} season`}
            badge={
              race.constructorStandings.length > 0 ? (
                <DataPresenceBadge label={`${race.constructorStandings.length} teams`} />
              ) : null
            }
          />
          {race.constructorStandings.length > 0 ? (
            <ConstructorStandingsTable rows={race.constructorStandings} />
          ) : (
            <EmptyDataState
              icon={Flag}
              title="No constructor data"
              description="Team points will populate when race detail loads."
            />
          )}
        </section>
      </div>

      {race.weather ? (
        <section className={cn(racesGlass, "p-4")}>
          <SectionHeader
            icon={CloudSun}
            title="Weather & strategy layer"
            meta={race.weather.condition}
            badge={<DataPresenceBadge label="Track data" />}
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Air", value: `${race.weather.airTempC}°C`, icon: CloudSun },
              { label: "Track", value: `${race.weather.trackTempC}°C`, icon: Flag },
              { label: "Rain chance", value: `${race.weather.rainProbability}%`, icon: CloudSun },
              { label: "Wind", value: race.weather.wind, icon: CloudSun },
            ].map((item) => (
              <div key={item.label} className="rounded-[1rem] bg-black/[0.03] px-3 py-3">
                <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  <item.icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  {item.label}
                </p>
                <p className="mt-1 text-[0.9375rem] font-semibold text-neutral-950">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {!hasStandings && race.sessions.length === 0 && !race.weather ? (
        <section className={cn(racesGlass)}>
          <EmptyDataState
            icon={CalendarDays}
            title="Weekend data pending"
            description="Select an active Grand Prix or wait for the detail panel to finish loading."
          />
        </section>
      ) : null}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  meta,
  badge,
}: {
  icon: typeof Users;
  title: string;
  meta: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] px-4 py-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-neutral-600">
          <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-[0.9375rem] font-semibold text-neutral-950">{title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[0.75rem] text-neutral-500">
            {meta}
          </p>
        </div>
      </div>
      {badge ? <div className="shrink-0 pt-1">{badge}</div> : null}
    </div>
  );
}

function DriverStandingsTable({
  rows,
}: {
  rows: RaceProfile["driverStandings"];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[0.8125rem]">
        <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Pos</th>
            <th className="px-4 py-2 font-semibold">Driver</th>
            <th className="hidden px-4 py-2 font-semibold sm:table-cell">Team</th>
            <th className="px-4 py-2 font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.driverId} className="border-t border-black/[0.05]">
              <td className="px-4 py-2.5">
                <PositionBadge position={row.position} />
              </td>
              <td className="px-4 py-2.5">
                <DriverAvatar
                  driverName={row.driverName}
                  driverAbbr={row.driverAbbr}
                  driverNumber={row.driverNumber}
                  teamId={row.teamId}
                  teamName={row.teamName}
                  showName
                />
              </td>
              <td className="hidden px-4 py-2.5 sm:table-cell">
                <TeamBadge teamId={row.teamId} teamName={row.teamName} />
              </td>
              <td className="px-4 py-2.5 font-semibold tabular-nums text-neutral-950">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConstructorStandingsTable({
  rows,
}: {
  rows: RaceProfile["constructorStandings"];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[0.8125rem]">
        <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Pos</th>
            <th className="px-4 py-2 font-semibold">Team</th>
            <th className="px-4 py-2 font-semibold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = getTeamVisual(row.teamId, row.teamName);

            return (
              <tr key={row.teamId} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5">
                  <PositionBadge position={row.position} />
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-8 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: team.primary }}
                      aria-hidden
                    />
                    <TeamBadge teamId={row.teamId} teamName={row.teamName} />
                  </span>
                </td>
                <td className="px-4 py-2.5 font-semibold tabular-nums text-neutral-950">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function parseLapTimeMs(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—" || trimmed === "-") {
    return null;
  }

  const segments = trimmed.split(":");
  if (segments.length === 2) {
    const minutes = Number(segments[0]);
    const seconds = Number(segments[1]);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
      return null;
    }

    return minutes * 60_000 + seconds * 1000;
  }

  if (segments.length === 1) {
    const seconds = Number(segments[0]);
    if (!Number.isFinite(seconds)) {
      return null;
    }

    return seconds * 1000;
  }

  return null;
}

function lapTimeExtremes(times: string[]) {
  const parsed = times
    .map((time, index) => ({ index, ms: parseLapTimeMs(time) }))
    .filter((item): item is { index: number; ms: number } => item.ms !== null);

  if (parsed.length < 2) {
    return { fastestIndex: null, slowestIndex: null };
  }

  let fastest = parsed[0];
  let slowest = parsed[0];

  for (const item of parsed) {
    if (item.ms < fastest.ms) {
      fastest = item;
    }

    if (item.ms > slowest.ms) {
      slowest = item;
    }
  }

  if (fastest.ms === slowest.ms) {
    return { fastestIndex: null, slowestIndex: null };
  }

  return { fastestIndex: fastest.index, slowestIndex: slowest.index };
}

function LapTimeCell({
  time,
  pace,
  variant = "last-lap",
}: {
  time: string;
  pace: "fastest" | "slowest" | null;
  variant?: "last-lap" | "fastest-lap";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-medium tabular-nums",
        pace === "fastest" && "bg-emerald-500/10 text-emerald-800",
        pace === "slowest" && "bg-red-500/10 text-red-800",
        pace == null && "text-neutral-950",
      )}
      title={
        pace === "fastest"
          ? variant === "fastest-lap"
            ? "Fastest lap"
            : "Quickest last lap"
          : pace === "slowest"
            ? variant === "fastest-lap"
              ? "Slowest lap in list"
              : "Slowest last lap"
            : undefined
      }
    >
      <Timer
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          pace === "fastest"
            ? "text-emerald-600"
            : pace === "slowest"
              ? "text-red-600"
              : "text-neutral-500",
        )}
        strokeWidth={2}
        aria-hidden
      />
      {time}
      {pace === "fastest" ? (
        <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-emerald-700">
          Quick
        </span>
      ) : null}
      {pace === "slowest" ? (
        <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.08em] text-red-700">
          Slow
        </span>
      ) : null}
    </span>
  );
}

function LapLeadersTable({ rows }: { rows: RaceProfile["lapLeaders"] }) {
  const { fastestIndex, slowestIndex } = useMemo(
    () => lapTimeExtremes(rows.map((row) => row.lastLap)),
    [rows],
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[0.8125rem]">
        <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Pos</th>
            <th className="px-4 py-2 font-semibold">Driver</th>
            <th className="hidden px-4 py-2 font-semibold md:table-cell">Gap</th>
            <th className="px-4 py-2 font-semibold">Last lap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.position}-${row.driverName}`} className="border-t border-black/[0.05]">
              <td className="px-4 py-2.5">
                <PositionBadge position={row.position} />
              </td>
              <td className="px-4 py-2.5">
                <DriverAvatar
                  driverName={row.driverName}
                  driverAbbr={driverAbbrFromName(row.driverName)}
                  teamName={row.teamName}
                  showName
                />
              </td>
              <td className="hidden px-4 py-2.5 font-medium tabular-nums text-neutral-700 md:table-cell">
                {row.gap}
              </td>
              <td className="px-4 py-2.5">
                <LapTimeCell
                  time={row.lastLap}
                  pace={
                    index === fastestIndex
                      ? "fastest"
                      : index === slowestIndex
                        ? "slowest"
                        : null
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FastestLapsTable({ rows }: { rows: RaceProfile["fastestLaps"] }) {
  const { fastestIndex, slowestIndex } = useMemo(
    () => lapTimeExtremes(rows.map((row) => row.time)),
    [rows],
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[0.8125rem]">
        <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
          <tr>
            <th className="px-4 py-2 font-semibold">Pos</th>
            <th className="px-4 py-2 font-semibold">Driver</th>
            <th className="px-4 py-2 font-semibold">Time</th>
            <th className="px-4 py-2 font-semibold">Lap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.position}-${row.driverName}`} className="border-t border-black/[0.05]">
              <td className="px-4 py-2.5">
                <PositionBadge position={row.position} />
              </td>
              <td className="px-4 py-2.5">
                <DriverAvatar
                  driverName={row.driverName}
                  driverAbbr={driverAbbrFromName(row.driverName)}
                  teamName={row.teamName}
                  showName
                />
              </td>
              <td className="px-4 py-2.5">
                <LapTimeCell
                  time={row.time}
                  variant="fastest-lap"
                  pace={
                    index === fastestIndex
                      ? "fastest"
                      : index === slowestIndex
                        ? "slowest"
                        : null
                  }
                />
              </td>
              <td className="px-4 py-2.5 tabular-nums text-neutral-700">{row.lap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
