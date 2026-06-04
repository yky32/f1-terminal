import {
  CloudRain,
  CloudSun,
  Flag,
  Gauge,
  Radio,
  Timer,
  Trophy,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { SessionType } from "@/lib/data/live-session";
import type { WeekendStatus } from "@/lib/data/live-session";
import { driverAbbrFromName, getTeamVisual } from "@/lib/f1/team-visuals";
import { TeamIcon } from "@/components/races/team-icon";
import { cn } from "@/lib/utils";

type VisualSize = "sm" | "md";

export function TeamBadge({
  teamId,
  teamName,
  showName = true,
  className,
}: {
  teamId?: number | null;
  teamName: string;
  showName?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <TeamIcon teamId={teamId} teamName={teamName} size="sm" title={teamName} />
      {showName ? (
        <span className="truncate text-neutral-800">{teamName}</span>
      ) : null}
    </span>
  );
}

export function DriverAvatar({
  driverName,
  driverAbbr,
  driverNumber,
  teamId,
  teamName,
  size = "sm",
  showName = true,
  className,
}: {
  driverName: string;
  driverAbbr?: string;
  driverNumber?: number | null;
  teamId?: number | null;
  teamName?: string | null;
  size?: VisualSize;
  showName?: boolean;
  className?: string;
}) {
  const team = getTeamVisual(teamId, teamName);
  const abbr = driverAbbr ?? driverAbbrFromName(driverName);
  const label = driverNumber != null ? String(driverNumber) : abbr;

  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-white",
          size === "sm" ? "h-8 w-8 text-[0.625rem]" : "h-9 w-9 text-[0.6875rem]",
        )}
        style={{ backgroundColor: team.primary }}
        aria-hidden
      >
        {label}
      </span>
      {showName ? (
        <span className="min-w-0">
          <span className="block truncate font-medium text-neutral-950">{driverName}</span>
          {teamName ? (
            <span className="mt-0.5 block truncate text-[0.6875rem] text-neutral-500">{teamName}</span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export function sessionTypeIcon(type: SessionType): LucideIcon {
  if (type.startsWith("FP")) return Gauge;
  if (type === "Q" || type === "SQ") return Timer;
  if (type === "S") return Trophy;
  return Flag;
}

export function SessionTypeIcon({
  type,
  className,
}: {
  type: SessionType;
  className?: string;
}) {
  const Icon = sessionTypeIcon(type);

  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-neutral-600",
        className,
      )}
      aria-hidden
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

export function WeekendStatusBadge({
  status,
  className,
}: {
  status: WeekendStatus;
  className?: string;
}) {
  const live = status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em]",
        live ? "bg-red-500/10 text-red-700" : "bg-black/[0.04] text-neutral-600",
        className,
      )}
    >
      {live ? (
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      ) : null}
      {status === "active" ? "Live weekend" : status === "upcoming" ? "Upcoming" : "Completed"}
    </span>
  );
}

export function DataPresenceBadge({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-emerald-700",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function WeatherIcon({ condition, className }: { condition: string; className?: string }) {
  const normalized = condition.toLowerCase();
  const Icon =
    normalized.includes("rain") || normalized.includes("shower")
      ? CloudRain
      : normalized.includes("wind")
        ? Wind
        : CloudSun;

  return <Icon className={cn("h-4 w-4", className)} strokeWidth={2} aria-hidden />;
}

export function LiveSessionIcon({ className }: { className?: string }) {
  return <Radio className={cn("h-3.5 w-3.5", className)} strokeWidth={2.25} aria-hidden />;
}

export function PositionBadge({ position, className }: { position: number; className?: string }) {
  const podium = position <= 3;

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg text-[0.75rem] font-bold tabular-nums",
        podium ? "bg-neutral-900 text-white" : "bg-black/[0.05] text-neutral-700",
        className,
      )}
    >
      {position}
    </span>
  );
}

export function EmptyDataState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] text-neutral-500">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </span>
      <p className="mt-3 text-[0.875rem] font-semibold text-neutral-800">{title}</p>
      <p className="mt-1 max-w-xs text-[0.8125rem] text-neutral-500">{description}</p>
    </div>
  );
}
