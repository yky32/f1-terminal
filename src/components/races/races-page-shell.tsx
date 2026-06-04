import { RacesFeed } from "@/components/races/races-feed";
import { PageHeader } from "@/components/page-header";
import type { RaceProfile } from "@/lib/data/race-profile";

type RacesPageShellProps = {
  catalog: RaceProfile[];
  initialRace: RaceProfile | null;
  selectedRaceId: string | null;
};

export function RacesPageShell({
  catalog,
  initialRace,
  selectedRaceId,
}: RacesPageShellProps) {
  return (
    <>
      <PageHeader
        compact
        onGlass
        title="Grand Prix dashboards."
        description="Circuit maps, session schedules, standings, and live timing layers — organized by round."
      />
      <RacesFeed
        catalog={catalog}
        initialRace={initialRace}
        selectedRaceId={selectedRaceId}
      />
    </>
  );
}
