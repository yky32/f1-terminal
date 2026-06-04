import { NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data/get-provider";

export async function GET() {
  try {
    const provider = getDataProvider();
    const overview = await provider.getGlobalOverview();

    return NextResponse.json(overview, {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load overview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
