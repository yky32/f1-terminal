"use client";

import { getTeamIconMark } from "@/components/races/team-icon-mark";
import { getTeamVisual } from "@/lib/f1/team-visuals";
import { cn } from "@/lib/utils";

type TeamIconSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<TeamIconSize, { shell: string; glyph: string }> = {
  xs: { shell: "h-4 w-4 rounded-[5px]", glyph: "h-2.5 w-2.5" },
  sm: { shell: "h-5 w-5 rounded-md", glyph: "h-3 w-3" },
  md: { shell: "h-6 w-6 rounded-md", glyph: "h-3.5 w-3.5" },
  lg: { shell: "h-8 w-8 rounded-lg", glyph: "h-[1.125rem] w-[1.125rem]" },
};

function iconForeground(primary: string) {
  const hex = primary.replace("#", "");
  if (hex.length !== 6) {
    return "#FFFFFF";
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.62 ? "#0F172A" : "#FFFFFF";
}

type TeamIconProps = {
  teamId?: number | null;
  teamName?: string | null;
  size?: TeamIconSize;
  className?: string;
  title?: string;
};

export function TeamIcon({
  teamId,
  teamName,
  size = "sm",
  className,
  title,
}: TeamIconProps) {
  const team = getTeamVisual(teamId, teamName);
  const Mark = getTeamIconMark(team.abbr);
  const label = title ?? team.name;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center shadow-sm ring-1 ring-black/[0.08]",
        sizeClass[size].shell,
        className,
      )}
      style={{ backgroundColor: team.primary, color: iconForeground(team.primary) }}
      title={label}
      aria-hidden
    >
      <Mark className={sizeClass[size].glyph} />
    </span>
  );
}
