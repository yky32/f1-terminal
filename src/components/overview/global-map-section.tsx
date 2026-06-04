"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { DeferredMount } from "@/components/deferred-mount";
import { GlobalRaceCalendar } from "@/components/overview/global-race-calendar";
import { GlobalRegionStats } from "@/components/overview/global-region-stats";
import { GlobalStandingsSection } from "@/components/overview/global-standings-section";
import { MapSectionSkeleton } from "@/components/loading/route-skeletons";
import type { RaceRegion } from "@/lib/data/race-profile";

const WorldMapPreview = dynamic(
  () =>
    import("@/components/overview/world-map-preview").then((module) => ({
      default: module.WorldMapPreview,
    })),
  {
    ssr: false,
    loading: () => <MapSectionSkeleton variant="map" />,
  },
);

const WeekendMonitorSection = dynamic(
  () =>
    import("@/components/overview/weekend-monitor-section").then((module) => ({
      default: module.WeekendMonitorSection,
    })),
  {
    ssr: false,
    loading: () => <MapSectionSkeleton variant="monitor" />,
  },
);

export function GlobalMapSection() {
  const [regionFilter, setRegionFilter] = useState<RaceRegion | null>(null);

  return (
    <>
      <DeferredMount placeholder={<MapSectionSkeleton variant="map" />}>
        <WorldMapPreview regionFilter={regionFilter} />
      </DeferredMount>

      <GlobalRegionStats activeRegion={regionFilter} onRegionChange={setRegionFilter} />

      <GlobalRaceCalendar />
      <GlobalStandingsSection />

      <DeferredMount
        placeholder={<MapSectionSkeleton variant="monitor" />}
        rootMargin="320px 0px"
      >
        <WeekendMonitorSection />
      </DeferredMount>
    </>
  );
}
