"use client";

import Image from "next/image";
import { useState } from "react";
import { driverAbbrFromName, getDriverImageUrl, getTeamVisual } from "@/lib/f1/team-visuals";
import { cn } from "@/lib/utils";

type DriverIconSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<DriverIconSize, { shell: string; label: string; image: string }> = {
  xs: { shell: "h-4 w-4", label: "text-[0.5rem]", image: "16px" },
  sm: { shell: "h-5 w-5", label: "text-[0.5625rem]", image: "20px" },
  md: { shell: "h-6 w-6", label: "text-[0.625rem]", image: "24px" },
  lg: { shell: "h-8 w-8", label: "text-[0.6875rem]", image: "32px" },
};

type DriverIconProps = {
  driverId?: number | null;
  driverName?: string | null;
  driverAbbr?: string | null;
  driverNumber?: number | null;
  driverImage?: string | null;
  teamId?: number | null;
  teamName?: string | null;
  size?: DriverIconSize;
  className?: string;
  title?: string;
};

export function DriverIcon({
  driverId,
  driverName,
  driverAbbr,
  driverNumber,
  driverImage,
  teamId,
  teamName,
  size = "sm",
  className,
  title,
}: DriverIconProps) {
  const team = getTeamVisual(teamId, teamName);
  const resolvedDriverId = driverId && driverId > 0 ? driverId : null;
  const imageUrl = getDriverImageUrl(resolvedDriverId, driverImage);
  const [imageFailed, setImageFailed] = useState(false);
  const abbr = driverAbbr ?? (driverName ? driverAbbrFromName(driverName) : "F1");
  const fallbackLabel = driverNumber != null ? String(driverNumber) : abbr;
  const label = title ?? driverName ?? abbr;
  const sizes = sizeClass[size];

  if (imageUrl && !imageFailed) {
    return (
      <span
        className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full", sizes.shell, className)}
        title={label}
        aria-hidden
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes={sizes.image}
          className="object-cover object-top"
          onError={() => setImageFailed(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold tabular-nums",
        sizes.shell,
        sizes.label,
        className,
      )}
      style={{ color: team.primary }}
      title={label}
      aria-hidden
    >
      {fallbackLabel}
    </span>
  );
}
