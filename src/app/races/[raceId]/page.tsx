import { notFound } from "next/navigation";
import { RacesPageShell } from "@/components/races/races-page-shell";
import { getDataProvider } from "@/lib/data/get-provider";
import { getCatalogEntryById } from "@/lib/f1/race-catalog";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 600;

type RacePageProps = {
  params: Promise<{ raceId: string }>;
};

export async function generateMetadata({ params }: RacePageProps) {
  const { raceId } = await params;
  const entry = getCatalogEntryById(raceId);

  if (!entry) {
    return buildPageMetadata({
      title: "Race not found",
      index: false,
    });
  }

  return buildPageMetadata({
    title: entry.name,
    description: `${entry.name} dashboard — sessions, standings, circuit map, and live timing.`,
    path: `/races/${raceId}`,
  });
}

export default async function RacePage({ params }: RacePageProps) {
  const { raceId } = await params;
  const entry = getCatalogEntryById(raceId);

  if (!entry) notFound();

  const provider = getDataProvider();
  const catalog = await provider.getRaceCatalog();
  const initialRace = await provider.getRaceById(raceId);

  if (!initialRace) notFound();

  return (
    <RacesPageShell
      catalog={catalog}
      initialRace={initialRace}
      selectedRaceId={raceId}
    />
  );
}
