"use client";

import Image from "next/image";
import { useState } from "react";
import { getTeamIconMark } from "@/components/races/team-icon-mark";
import { getTeamLogoUrl, getTeamVisual } from "@/lib/f1/team-visuals";
import { cn } from "@/lib/utils";

type TeamIconSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<TeamIconSize, { shell: string; glyph: string; image: string }> = {
  xs: { shell: "h-4 w-4", glyph: "h-4 w-4", image: "16px" },
  sm: { shell: "h-5 w-5", glyph: "h-5 w-5", image: "20px" },
  md: { shell: "h-6 w-6", glyph: "h-6 w-6", image: "24px" },
  lg: { shell: "h-8 w-8", glyph: "h-8 w-8", image: "32px" },
};

type TeamIconProps = {
  teamId?: number | null;
  teamName?: string | null;
  teamLogo?: string | null;
  size?: TeamIconSize;
  className?: string;
  title?: string;
};

export function TeamIcon({
  teamId,
  teamName,
  teamLogo,
  size = "sm",
  className,
  title,
}: TeamIconProps) {
  const team = getTeamVisual(teamId, teamName);
  const resolvedTeamId = teamId && teamId > 0 ? teamId : team.id > 0 ? team.id : null;
  const logoUrl = getTeamLogoUrl(resolvedTeamId, teamLogo);
  const [logoFailed, setLogoFailed] = useState(false);
  const Mark = getTeamIconMark(team.abbr);
  const label = title ?? team.name;
  const sizes = sizeClass[size];

  if (logoUrl && !logoFailed) {
    return (
      <span
        className={cn("relative inline-flex shrink-0", sizes.shell, className)}
        title={label}
        aria-hidden
      >
        <Image
          src={logoUrl}
          alt=""
          fill
          sizes={sizes.image}
          className="object-contain"
          onError={() => setLogoFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", sizes.shell, className)}
      style={{ color: team.primary }}
      title={label}
      aria-hidden
    >
      <Mark className={sizes.glyph} />
    </span>
  );
}
