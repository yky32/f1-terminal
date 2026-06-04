import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/metadata";
import { RACE_CATALOG } from "@/lib/f1/race-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/races"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...RACE_CATALOG.map((race) => ({
      url: absoluteUrl(`/races/${race.id}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
