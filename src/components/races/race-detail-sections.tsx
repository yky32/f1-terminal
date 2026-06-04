"use client";

import {
  CalendarDays,
  History,
  MapPin,
  Route,
  Timer,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import {
  DataPresenceBadge,
  DriverAvatar,
  EmptyDataState,
  PositionBadge,
  SessionTypeIcon,
  TeamBadge,
} from "@/components/races/f1-visuals";
import { racesGlass } from "@/components/races/races-glass";
import type { RaceProfile, RaceSession } from "@/lib/data/race-profile";
import { sessionCountdownLabel } from "@/lib/data/live-session";
import { cn } from "@/lib/utils";

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
          <p className="mt-0.5 text-[0.75rem] text-neutral-500">{meta}</p>
        </div>
      </div>
      {badge ? <div className="shrink-0 pt-1">{badge}</div> : null}
    </div>
  );
}

export function RaceCircuitInfoSection({ race }: { race: RaceProfile }) {
  const info = race.circuitInfo;

  const rows = [
    { label: "Location", value: info.location, icon: MapPin },
    { label: "Length", value: info.length ?? "—", icon: Route },
    { label: "Race laps", value: info.laps ? String(info.laps) : "—", icon: Trophy },
    {
      label: "Lap record",
      value: info.lapRecord
        ? `${info.lapRecord}${info.lapRecordHolder ? ` · ${info.lapRecordHolder}` : ""}${info.lapRecordYear ? ` (${info.lapRecordYear})` : ""}`
        : "—",
      icon: Timer,
    },
    { label: "First GP", value: info.firstGrandPrix ? String(info.firstGrandPrix) : "—", icon: History },
    { label: "Direction", value: info.direction ?? "—", icon: Route },
    { label: "Type", value: info.circuitType ?? "—", icon: MapPin },
  ];

  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={MapPin}
        title="Circuit info"
        meta="API-Sports · Circuits"
        badge={<DataPresenceBadge label={info.name} />}
      />
      <dl className="grid gap-px bg-black/[0.04] sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="bg-white/40 px-4 py-3">
            <dt className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              <row.icon className="h-3 w-3" strokeWidth={2} aria-hidden />
              {row.label}
            </dt>
            <dd className="mt-1 text-[0.8125rem] font-medium text-neutral-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function RaceSessionListSection({
  title,
  meta,
  sessions,
}: {
  title: string;
  meta: string;
  sessions: RaceSession[];
}) {
  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={CalendarDays}
        title={title}
        meta={meta}
        badge={
          sessions.length > 0 ? (
            <DataPresenceBadge label={`${sessions.length} sessions`} />
          ) : null
        }
      />
      {sessions.length > 0 ? (
        <div className="divide-y divide-black/[0.06]">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <SessionTypeIcon type={session.type} />
                <div className="min-w-0">
                  <p className="text-[0.875rem] font-semibold text-neutral-950">
                    {session.typeLabel}
                  </p>
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
      ) : (
        <EmptyDataState
          icon={CalendarDays}
          title="No sessions in this phase"
          description="Times will appear when sessions are scheduled for this part of the weekend."
        />
      )}
    </section>
  );
}

/** @deprecated Use RaceSessionListSection per tab */
export function RaceSessionScheduleSection({ race }: { race: RaceProfile }) {
  return (
    <RaceSessionListSection
      title="Session schedule"
      meta="FP1 · FP2 · FP3 · Qualifying · Race"
      sessions={race.sessions}
    />
  );
}

export function RaceResultsSection({ race }: { race: RaceProfile }) {
  if (race.raceResults.length === 0) {
    return null;
  }

  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={Trophy}
        title="Race results"
        meta="Final classification · API-Sports rankings/races"
        badge={<DataPresenceBadge label={`P1–P${race.raceResults.length}`} />}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[0.8125rem]">
          <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-semibold">Pos</th>
              <th className="px-4 py-2 font-semibold">Driver</th>
              <th className="hidden px-4 py-2 font-semibold sm:table-cell">Team</th>
              <th className="px-4 py-2 font-semibold">Grid</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Pts</th>
            </tr>
          </thead>
          <tbody>
            {race.raceResults.map((row) => (
              <tr key={row.position} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5">
                  <PositionBadge position={row.position} />
                </td>
                <td className="px-4 py-2.5">
                  <DriverAvatar
                    driverId={row.driverId}
                    driverName={row.driverName}
                    driverAbbr={row.driverAbbr}
                    driverImage={row.driverImage}
                    teamId={row.teamId}
                    teamName={row.teamName}
                    showName
                  />
                </td>
                <td className="hidden px-4 py-2.5 sm:table-cell">
                  <TeamBadge teamId={row.teamId} teamName={row.teamName} />
                </td>
                <td className="px-4 py-2.5 tabular-nums text-neutral-700">{row.grid}</td>
                <td className="px-4 py-2.5 text-neutral-600">{row.status}</td>
                <td className="px-4 py-2.5 font-semibold tabular-nums">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RaceDriverPerformanceSection({
  race,
  mode = "auto",
}: {
  race: RaceProfile;
  mode?: "grid" | "race" | "auto";
}) {
  if (race.driverPerformance.length === 0) {
    return null;
  }

  const hasFinish = race.driverPerformance.some((row) => row.finish !== null);

  if (mode === "grid" && hasFinish) {
    return null;
  }

  if (mode === "race" && !hasFinish) {
    return null;
  }

  const showFinish = mode === "race" || (mode === "auto" && hasFinish);
  const title = showFinish ? "Driver performance" : "Starting grid";
  const meta = showFinish
    ? "Grid · Finish · Points gained"
    : "Qualifying positions · API-Sports";

  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={Users}
        title={title}
        meta={meta}
        badge={<DataPresenceBadge label={`${race.driverPerformance.length} drivers`} />}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[0.8125rem]">
          <thead className="bg-black/[0.03] text-[0.6875rem] uppercase tracking-[0.08em] text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-semibold">Grid</th>
              {showFinish ? <th className="px-4 py-2 font-semibold">Finish</th> : null}
              <th className="px-4 py-2 font-semibold">Driver</th>
              <th className="hidden px-4 py-2 font-semibold md:table-cell">Team</th>
              {showFinish ? (
                <>
                  <th className="px-4 py-2 font-semibold">Δ Pos</th>
                  <th className="px-4 py-2 font-semibold">Pts</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {race.driverPerformance.map((row) => (
              <tr key={row.driverId} className="border-t border-black/[0.05]">
                <td className="px-4 py-2.5 font-semibold tabular-nums text-neutral-700">
                  {row.grid}
                </td>
                {showFinish ? (
                  <td className="px-4 py-2.5">
                    {row.finish ? <PositionBadge position={row.finish} /> : "—"}
                  </td>
                ) : null}
                <td className="px-4 py-2.5">
                  <DriverAvatar
                    driverId={row.driverId}
                    driverName={row.driverName}
                    driverAbbr={row.driverAbbr}
                    driverImage={row.driverImage}
                    teamId={row.teamId}
                    teamName={row.teamName}
                    showName
                  />
                </td>
                <td className="hidden px-4 py-2.5 md:table-cell">
                  <TeamBadge teamId={row.teamId} teamName={row.teamName} />
                </td>
                {showFinish ? (
                  <>
                    <td
                      className={cn(
                        "px-4 py-2.5 font-semibold tabular-nums",
                        row.positionsGained && row.positionsGained > 0
                          ? "text-emerald-700"
                          : row.positionsGained && row.positionsGained < 0
                            ? "text-red-700"
                            : "text-neutral-500",
                      )}
                    >
                      {row.positionsGained != null
                        ? row.positionsGained > 0
                          ? `+${row.positionsGained}`
                          : row.positionsGained
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 font-semibold tabular-nums">{row.points}</td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function RaceCircuitHistorySection({ race }: { race: RaceProfile }) {
  if (race.circuitHistory.length === 0) {
    return null;
  }

  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={History}
        title="Previous winners"
        meta={`At ${race.circuitInfo.name}`}
        badge={<DataPresenceBadge label="Historical" />}
      />
      <ul className="divide-y divide-black/[0.06]">
        {race.circuitHistory.map((row) => (
          <li
            key={row.season}
            className="flex items-center justify-between gap-3 px-4 py-3 text-[0.8125rem]"
          >
            <span className="font-semibold tabular-nums text-neutral-500">{row.season}</span>
            <span className="min-w-0 flex-1 text-right font-medium text-neutral-950">
              {row.driverName}
            </span>
            <span className="shrink-0">
              <TeamBadge teamName={row.teamName} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RaceStandingsImpactSection({ race }: { race: RaceProfile }) {
  const impact = race.standingsImpact;
  if (!impact) {
    return null;
  }

  return (
    <section className={cn(racesGlass, "overflow-hidden")}>
      <SectionHeader
        icon={TrendingUp}
        title="Standings update"
        meta={impact.label}
        badge={<DataPresenceBadge label="Rankings" />}
      />
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Drivers
          </p>
          <ul className="space-y-2">
            {impact.drivers.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-[0.8125rem]"
              >
                <span className="font-medium text-neutral-950">{row.name}</span>
                <span className="tabular-nums text-neutral-600">
                  {row.pointsBefore} →{" "}
                  <span className="font-semibold text-neutral-950">{row.pointsAfter}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 font-semibold tabular-nums",
                    row.delta > 0 ? "text-emerald-700" : "text-neutral-500",
                  )}
                >
                  +{row.delta}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Constructors
          </p>
          <ul className="space-y-2">
            {impact.constructors.map((row) => (
              <li
                key={row.name}
                className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-[0.8125rem]"
              >
                <span className="font-medium text-neutral-950">{row.name}</span>
                <span className="tabular-nums text-neutral-600">
                  {row.pointsBefore} →{" "}
                  <span className="font-semibold text-neutral-950">{row.pointsAfter}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-emerald-700">
                  +{row.delta}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
