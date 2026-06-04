import { GlobalPageHeader } from "@/components/overview/global-page-header";
import { GlobalSectionNav } from "@/components/overview/global-section-nav";
import { GlobalMapSection } from "@/components/overview/global-map-section";
import { MapCircuitsProvider } from "@/components/overview/map-circuits-context";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Live F1 Map & Race Weekends",
  description:
    "Follow live and upcoming Formula 1 Grand Prix on an interactive global map — race weekend sessions, standings, and circuit dashboards.",
  path: "/",
});

export default function Home() {
  return (
    <MapCircuitsProvider>
      <GlobalPageHeader />
      <GlobalSectionNav />
      <GlobalMapSection />
    </MapCircuitsProvider>
  );
}
