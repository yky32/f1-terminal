import { GlobalHeroBanner } from "@/components/overview/global-hero-banner";
import { GlobalSectionNav } from "@/components/overview/global-section-nav";
import { GlobalMapSection } from "@/components/overview/global-map-section";
import { GlobalOverviewProvider } from "@/components/overview/global-overview-context";
import { MapCircuitsProvider } from "@/components/overview/map-circuits-context";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Live F1 Map & Race Weekends",
  description:
    "Follow live and upcoming Formula 1 Grand Prix on an interactive global map — full season calendar, championship standings, and circuit dashboards.",
  path: "/",
});

export default function Home() {
  return (
    <MapCircuitsProvider>
      <GlobalOverviewProvider>
        <GlobalHeroBanner />
        <GlobalSectionNav />
        <GlobalMapSection />
      </GlobalOverviewProvider>
    </MapCircuitsProvider>
  );
}
