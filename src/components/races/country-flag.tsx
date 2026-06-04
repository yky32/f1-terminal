"use client";

import { useEffect, useState } from "react";
import {
  countryAccentColor,
  countryFlagImageUrl,
  countryIsoCode,
} from "@/lib/f1/country-flags";
import { cn } from "@/lib/utils";

type RaceCountryFlagProps = {
  country: string;
  size?: "xs" | "sm" | "md";
  className?: string;
};

const sizeClass = {
  xs: "h-3.5 w-[1.3125rem] rounded-[3px]",
  sm: "h-4 w-6 rounded-[4px]",
  md: "h-5 w-7 rounded-[5px]",
} as const;

const fallbackText = {
  xs: "text-[0.4375rem] tracking-[0.06em]",
  sm: "text-[0.5rem] tracking-[0.06em]",
  md: "text-[0.5625rem] tracking-[0.08em]",
} as const;

export function RaceCountryFlag({
  country,
  size = "md",
  className,
}: RaceCountryFlagProps) {
  const [failed, setFailed] = useState(false);
  const src = countryFlagImageUrl(country);
  const accent = countryAccentColor(country);
  const iso = countryIsoCode(country);

  useEffect(() => {
    setFailed(false);
  }, [country, src]);

  if (!src || failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center ring-1 ring-black/[0.06]",
          sizeClass[size],
          className,
        )}
        style={{ backgroundColor: `${accent}12` }}
        aria-hidden
      >
        <span
          className={cn("font-bold uppercase", fallbackText[size])}
          style={{ color: accent }}
        >
          {iso ?? "—"}
        </span>
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn(
        "inline-block shrink-0 object-cover ring-1 ring-black/[0.06]",
        sizeClass[size],
        className,
      )}
      onError={() => setFailed(true)}
    />
  );
}
