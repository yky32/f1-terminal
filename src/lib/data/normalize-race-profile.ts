import type { RaceProfile } from "@/lib/data/race-profile";
import {
  buildRaceCircuitInfo,
  getRaceDetailEnrichment,
} from "@/lib/data/providers/mock/race-detail-data";
import { getCatalogEntryById } from "@/lib/f1/race-catalog";

export function normalizeRaceProfile(profile: RaceProfile): RaceProfile {
  const entry = getCatalogEntryById(profile.id);
  const enrichment = getRaceDetailEnrichment(
    profile.id,
    profile.round,
    entry?.weekendStatus ?? profile.weekendStatus,
  );

  const circuitInfo =
    profile.circuitInfo ??
    buildRaceCircuitInfo(
      profile.id,
      profile.country,
      profile.city,
      profile.circuit.name,
      profile.circuit.length,
      profile.circuit.laps,
    );

  return {
    ...profile,
    circuitInfo,
    raceResults: profile.raceResults ?? enrichment.raceResults,
    driverPerformance: profile.driverPerformance ?? enrichment.driverPerformance,
    circuitHistory: profile.circuitHistory ?? enrichment.circuitHistory,
    standingsImpact: profile.standingsImpact ?? enrichment.standingsImpact,
  };
}
