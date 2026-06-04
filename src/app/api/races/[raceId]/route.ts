import { normalizeRaceProfile } from "@/lib/data/normalize-race-profile";
import { getDataProvider } from "@/lib/data/get-provider";
import { NextResponse } from "next/server";

/** Keep in sync with ROUTE_REVALIDATE_RACE_SEC in refresh-policy.ts */
export const revalidate = 120;

type RouteContext = {
  params: Promise<{ raceId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { raceId } = await context.params;
  const provider = getDataProvider();

  try {
    const profile = await provider.getRaceById(raceId);

    if (!profile) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeRaceProfile(profile), {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load race";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
