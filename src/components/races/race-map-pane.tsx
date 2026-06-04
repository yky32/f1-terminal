"use client";

import { Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { RaceCircuitMapView } from "@/components/races/race-circuit-map-view";
import { racesGlassFocus, racesGlassInset } from "@/components/races/races-glass";
import type { RaceProfile } from "@/lib/data/race-profile";
import { cn } from "@/lib/utils";

const RaceCircuitMapDialog = dynamic(
  () =>
    import("@/components/races/race-circuit-map-dialog").then((module) => ({
      default: module.RaceCircuitMapDialog,
    })),
  { ssr: false },
);

type RaceMapPaneProps = {
  race: RaceProfile;
  variant?: "default" | "hero";
};

export function RaceMapPane({ race, variant = "default" }: RaceMapPaneProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isHero = variant === "hero";

  return (
    <>
      <div className="absolute inset-0">
        <RaceCircuitMapView race={race} />

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className={cn(
            racesGlassFocus,
            "group absolute inset-0 z-10 flex cursor-zoom-in flex-col items-center justify-end p-3 transition-colors focus-visible:outline-none",
            isHero
              ? "bg-gradient-to-t from-black/12 via-transparent to-transparent hover:from-black/20"
              : "bg-gradient-to-t from-black/25 via-transparent to-transparent hover:from-black/35",
          )}
          aria-label={`Open detailed map for ${race.circuit.name}`}
        >
          <span
            className={cn(
              racesGlassInset,
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold text-neutral-800 shadow-sm transition-transform group-hover:scale-[1.02]",
            )}
          >
            <Maximize2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            Circuit details
          </span>
        </button>
      </div>

      <RaceCircuitMapDialog
        race={race}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
