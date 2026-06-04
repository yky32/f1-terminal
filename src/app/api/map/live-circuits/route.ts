import { getLiveSessionStats } from "@/lib/data/live-circuit-activity";
import type { LiveCircuitsBothResponse } from "@/lib/data/live-circuit-activity";
import type { MapSessionMode } from "@/lib/data/map-session-mode";
import { isMapSessionMode } from "@/lib/data/map-session-mode";
import { getDataProvider } from "@/lib/data/get-provider";
import type { LiveCircuitsSnapshot } from "@/lib/data/provider";
import { NextResponse } from "next/server";

/** Keep in sync with ROUTE_REVALIDATE_MAP_SEC in refresh-policy.ts */
export const revalidate = 60;

function snapshotToResponse(snapshot: LiveCircuitsSnapshot) {
  const stats = getLiveSessionStats(snapshot.circuits);

  return {
    mode: snapshot.mode,
    ...stats,
    circuits: snapshot.circuits,
    sessionsByCircuit: snapshot.sessionsByCircuit,
    updatedAt: snapshot.updatedAt,
    provider: snapshot.provider,
  };
}

function emptyResponse(mode: MapSessionMode) {
  const stats = getLiveSessionStats([]);

  return {
    mode,
    ...stats,
    circuits: [],
    sessionsByCircuit: {},
    updatedAt: new Date().toISOString(),
    provider: "mock",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modeParam = searchParams.get("mode");
  const provider = getDataProvider();

  if (modeParam === "both") {
    try {
      const [liveSnapshot, upcomingSnapshot] = await Promise.all([
        provider.getMapCircuits("live"),
        provider.getMapCircuits("upcoming"),
      ]);

      const body: LiveCircuitsBothResponse = {
        live: snapshotToResponse(liveSnapshot),
        upcoming: snapshotToResponse(upcomingSnapshot),
      };

      return NextResponse.json(body, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load circuits";
      return NextResponse.json({
        live: emptyResponse("live"),
        upcoming: emptyResponse("upcoming"),
        error: message,
      } satisfies LiveCircuitsBothResponse);
    }
  }

  const mode = isMapSessionMode(modeParam) ? modeParam : "live";

  try {
    const snapshot = await provider.getMapCircuits(mode);
    return NextResponse.json(snapshotToResponse(snapshot), {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load circuits";
    return NextResponse.json({ ...emptyResponse(mode), error: message });
  }
}
