"use client";

import dynamic from "next/dynamic";
import { DeferredMount } from "@/components/deferred-mount";
import { MapSectionSkeleton } from "@/components/loading/route-skeletons";

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
  return (
    <>
      <DeferredMount placeholder={<MapSectionSkeleton variant="map" />}>
        <WorldMapPreview />
      </DeferredMount>
      <DeferredMount
        placeholder={<MapSectionSkeleton variant="monitor" />}
        rootMargin="320px 0px"
      >
        <WeekendMonitorSection />
      </DeferredMount>
    </>
  );
}
