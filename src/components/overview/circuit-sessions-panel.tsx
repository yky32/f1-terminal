"use client";

import Link from "next/link";
import type { LiveSession } from "@/lib/data/live-session";
import { sessionCountdownLabel } from "@/lib/data/live-session";
import { glass, glassFocus, glassHover } from "@/components/glass-surface";
import { cn } from "@/lib/utils";

type CircuitSessionsPanelProps = {
  circuitName: string;
  country: string;
  city: string;
  raceId: string;
  sessions: LiveSession[];
  onClose: () => void;
};

function SessionStatusBadge({ session }: { session: LiveSession }) {
  const isLive = session.status === "Live";

  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
        isLive ? "bg-red-500/15 text-red-700" : "bg-neutral-900/8 text-neutral-600",
      )}
    >
      {isLive ? "Live" : sessionCountdownLabel(session.startTime)}
    </span>
  );
}

export function CircuitSessionsPanel({
  circuitName,
  country,
  city,
  raceId,
  sessions,
  onClose,
}: CircuitSessionsPanelProps) {
  return (
    <aside className={cn(glass, "flex h-full min-h-0 flex-col overflow-hidden")}>
      <div className="flex items-start justify-between gap-3 border-b border-black/[0.06] px-4 py-4">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            {city}, {country}
          </p>
          <h3 className="mt-1 text-[1.0625rem] font-semibold text-neutral-950">{circuitName}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={cn(glassHover, glassFocus, "rounded-full px-2.5 py-1 text-[0.75rem] text-neutral-600")}
        >
          Close
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link
                href={`/races/${raceId}`}
                className={cn(
                  glassHover,
                  glassFocus,
                  "block rounded-[1rem] px-3 py-3 transition-colors",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.8125rem] font-semibold text-neutral-950">
                    {session.typeLabel}
                  </span>
                  <SessionStatusBadge session={session} />
                </div>
                <p className="mt-1 text-[0.75rem] text-neutral-600">{session.meetingName}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
