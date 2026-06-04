"use client";

import Link from "next/link";
import { CalendarDays, Flag } from "lucide-react";
import { useMapCircuits } from "@/components/overview/map-circuits-context";
import { glass, glassFocus, glassHover } from "@/components/glass-surface";
import { sessionCountdownLabel } from "@/lib/data/live-session";
import { getMockWeekendSessions } from "@/lib/data/providers/mock/f1-data";
import { cn } from "@/lib/utils";

export function WeekendMonitorSection() {
  const { data } = useMapCircuits();

  const sessions = data
    ? [...(data.live.sessionsByCircuit ? Object.values(data.live.sessionsByCircuit).flat() : []), ...(data.upcoming.sessionsByCircuit ? Object.values(data.upcoming.sessionsByCircuit).flat() : [])]
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    : getMockWeekendSessions();

  return (
    <section id="weekend-monitor" className="scroll-mt-28">
      <div className="page-container py-10 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
              Weekend monitor
            </p>
            <h2 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-neutral-950">
              Today &amp; this weekend&apos;s sessions
            </h2>
          </div>
          <Link
            href="/races"
            className={cn(glassHover, glassFocus, glass, "rounded-full px-4 py-2 text-[0.8125rem] font-medium text-neutral-700")}
          >
            Open race dashboards
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => {
            const isLive = session.status === "Live";

            return (
              <Link
                key={session.id}
                href={`/races/${session.raceId}`}
                className={cn(glass, glassHover, glassFocus, "block rounded-[1.25rem] p-4 transition-transform hover:-translate-y-0.5")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                      {session.city}, {session.country}
                    </p>
                    <h3 className="mt-1 text-[1rem] font-semibold text-neutral-950">{session.typeLabel}</h3>
                    <p className="mt-1 text-[0.8125rem] text-neutral-600">{session.meetingName}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em]",
                      isLive ? "bg-red-500/15 text-red-700" : "bg-neutral-900/8 text-neutral-600",
                    )}
                  >
                    {isLive ? "Live" : sessionCountdownLabel(session.startTime)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-[0.75rem] text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    Round {session.round}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5" aria-hidden />
                    {session.circuit}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
