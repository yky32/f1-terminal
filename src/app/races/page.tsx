import { RacesPageShell } from "@/components/races/races-page-shell";
import { getDataProvider } from "@/lib/data/get-provider";
import { FEATURED_RACE_ID } from "@/lib/f1/race-catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 600;

export const metadata = buildPageMetadata({
  title: "Grand Prix Dashboards",
  description:
    "Browse the Formula 1 calendar — circuit maps, session tabs, driver and constructor standings.",
  path: "/races",
});

export default async function RacesPage() {
  const provider = getDataProvider();
  const catalog = await provider.getRaceCatalog();
  const initialRace = catalog.find((race) => race.id === FEATURED_RACE_ID) ?? catalog[0] ?? null;

  return (
    <RacesPageShell
      catalog={catalog}
      initialRace={initialRace}
      selectedRaceId={initialRace?.id ?? null}
    />
  );
}
