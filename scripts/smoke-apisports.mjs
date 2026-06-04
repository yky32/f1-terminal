#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const baseUrl = process.env.API_SPORTS_BASE_URL?.trim() || "https://v1.formula-1.api-sports.io";
const apiKey = process.env.API_SPORTS_KEY?.trim();
const season = Number(process.env.API_SPORTS_SEASON?.trim() || "2024");

const paths = {
  races: `/races?season=${season}`,
  drivers: `/rankings/drivers?season=${season}`,
  teams: `/rankings/teams?season=${season}`,
};

if (!apiKey) {
  console.error("Missing API_SPORTS_KEY. Add it to .env.local — see .env.example");
  process.exit(1);
}

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "x-apisports-key": apiKey },
  });
  const body = await response.json();
  const errors = body.errors
    ? Array.isArray(body.errors)
      ? body.errors
      : Object.values(body.errors)
    : [];

  if (!response.ok || errors.length > 0) {
    throw new Error(errors[0] ?? `Request failed (${response.status})`);
  }

  return body.response;
}

try {
  const [races, drivers, teams] = await Promise.all([
    get(paths.races),
    get(paths.drivers),
    get(paths.teams),
  ]);

  const raceSessions = races.filter((race) => race.type === "Race");
  const live = races.filter((race) => race.status === "Live");
  const upcoming = races.filter((race) => race.status === "Scheduled");

  console.log(`API-Sports F1 · season ${season}`);
  console.log(`- Docs: https://api-sports.io/documentation/formula-1/v1`);
  console.log(`- Race weekends: ${raceSessions.length}`);
  console.log(`- Sessions total: ${races.length}`);
  console.log(`- Live sessions: ${live.length}`);
  console.log(`- Scheduled sessions: ${upcoming.length}`);
  console.log(`- Driver standings: ${drivers.length}`);
  console.log(`- Team standings: ${teams.length}`);

  if (drivers[0]) {
    console.log(`- Championship leader: ${drivers[0].driver.name} (${drivers[0].points} pts)`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
