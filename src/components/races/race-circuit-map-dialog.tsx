"use client";

import {
  Calendar,
  CornerDownRight,
  Flag,
  Route,
  Timer,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { RaceCircuitMapView } from "@/components/races/race-circuit-map-view";
import { RaceCountryFlag } from "@/components/races/country-flag";
import { racesGlassFocus, racesGlassInset, racesGlassStrong } from "@/components/races/races-glass";
import { getCircuitMetadata } from "@/lib/f1/circuit-metadata";
import type { RaceProfile } from "@/lib/data/race-profile";
import { cn } from "@/lib/utils";

type RaceCircuitMapDialogProps = {
  race: RaceProfile;
  open: boolean;
  onClose: () => void;
};

export function RaceCircuitMapDialog({ race, open, onClose }: RaceCircuitMapDialogProps) {
  const metadata = getCircuitMetadata(race.id);
  const length =
    race.circuit.length ?? metadata?.lengthDisplay ?? "—";
  const laps = race.circuit.laps ? String(race.circuit.laps) : "—";

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="user-menu-backdrop-enter absolute inset-0 bg-black/30"
        aria-label="Close circuit map"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="circuit-map-dialog-title"
        className={cn(
          racesGlassStrong,
          "race-circuit-dialog-shell races-circuit-dialog",
          "motion-reduce:animate-none",
          "relative z-[1] flex w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem]",
        )}
      >
        <header className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Circuit profile
            </p>
            <h2
              id="circuit-map-dialog-title"
              className="mt-0.5 flex flex-wrap items-center gap-2 text-[1.125rem] font-semibold tracking-[-0.02em] text-neutral-950"
            >
              <RaceCountryFlag country={race.country} size="sm" />
              <span className="truncate">{race.circuit.name}</span>
            </h2>
            <p className="mt-1 text-[0.8125rem] text-neutral-600">
              {race.name} · Round {race.round}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              racesGlassFocus,
              racesGlassInset,
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-600 transition-colors hover:text-neutral-950",
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </header>

        <div className="grid min-h-0 gap-3 px-3 pb-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-3 lg:px-3 lg:pb-3">
          <div className="race-circuit-dialog-map relative min-h-[16rem] overflow-hidden rounded-[1rem] lg:min-h-[22rem]">
            <RaceCircuitMapView
              key={`${race.id}-detail-map`}
              race={race}
              variant="detail"
              className="min-h-[16rem] lg:min-h-[22rem]"
            />
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto px-2 pb-1 lg:px-2">
            <div className="grid grid-cols-2 gap-2">
              <MetaTile icon={Route} label="Length" value={length} />
              <MetaTile icon={Flag} label="Race laps" value={laps} />
              <MetaTile
                icon={CornerDownRight}
                label="Corners"
                value={metadata ? String(metadata.corners) : "—"}
              />
              <MetaTile
                icon={Timer}
                label="Lap record"
                value={metadata?.lapRecord ?? "—"}
              />
            </div>

            <div className="race-circuit-dialog-panel rounded-[1rem] px-3 py-3">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Circuit details
              </p>
              <dl className="mt-2 space-y-1.5 text-[0.8125rem] text-neutral-700">
                <DetailRow label="Type" value={metadata?.circuitType ?? "—"} />
                <DetailRow
                  label="Direction"
                  value={metadata?.direction ?? "—"}
                />
                <DetailRow
                  label="First Grand Prix"
                  value={
                    metadata?.firstGrandPrix
                      ? String(metadata.firstGrandPrix)
                      : "—"
                  }
                />
                <DetailRow label="Location" value={`${race.city}, ${race.country}`} />
              </dl>
            </div>

            {metadata ? (
              <div className="race-circuit-dialog-panel rounded-[1rem] px-3 py-3">
                <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  History
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-700">
                  {metadata.history}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MetaTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Route;
  label: string;
  value: string;
}) {
  return (
    <div className="race-circuit-dialog-stat rounded-[0.875rem] px-2.5 py-2.5">
      <p className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-[0.9375rem] font-semibold tabular-nums text-neutral-950">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
