export type TeamVisual = {
  id: number;
  name: string;
  abbr: string;
  primary: string;
  secondary: string;
};

/** Team ids aligned with API-Sports GET /teams — https://api-sports.io/documentation/formula-1/v1 */
export const F1_TEAMS: TeamVisual[] = [
  { id: 1, name: "Red Bull Racing", abbr: "RBR", primary: "#3671C6", secondary: "#1E41C3" },
  { id: 2, name: "McLaren", abbr: "MCL", primary: "#FF8000", secondary: "#47C7FC" },
  { id: 3, name: "Ferrari", abbr: "FER", primary: "#E8002D", secondary: "#FFF200" },
  { id: 5, name: "Mercedes", abbr: "MER", primary: "#27F4D2", secondary: "#007560" },
  { id: 17, name: "Aston Martin", abbr: "AMR", primary: "#229971", secondary: "#CEDC00" },
  { id: 13, name: "Alpine", abbr: "ALP", primary: "#0093CC", secondary: "#FF87BC" },
  { id: 12, name: "Williams", abbr: "WIL", primary: "#64C4FF", secondary: "#041E42" },
  { id: 7, name: "RB", abbr: "RB", primary: "#6692FF", secondary: "#061D42" },
  { id: 18, name: "Sauber", abbr: "SAU", primary: "#52E252", secondary: "#006629" },
  { id: 14, name: "Haas F1 Team", abbr: "HAA", primary: "#B6BABD", secondary: "#FFFFFF" },
];

const TEAM_NAME_ALIASES: Record<string, number> = {
  "mclaren racing": 2,
  "scuderia ferrari": 3,
  "mercedes-amg petronas": 5,
  "mercedes-amg petronas f1 team": 5,
  "aston martin f1 team": 17,
  "alpine f1 team": 13,
  "williams f1 team": 12,
  "racing bulls": 7,
  "visa cash app rb": 7,
  "stake f1 team kick sauber": 18,
  "kick sauber": 18,
  "haas": 14,
};

const DEFAULT_TEAM: TeamVisual = {
  id: 0,
  name: "Unknown",
  abbr: "F1",
  primary: "#475569",
  secondary: "#94A3B8",
};

/** Official team logo from API-Sports media CDN (GET /teams). */
export function getTeamLogoUrl(teamId?: number | null, logo?: string | null) {
  if (logo) return logo;
  if (teamId == null || teamId <= 0) return null;
  return `https://media.api-sports.io/formula-1/teams/${teamId}.png`;
}

/** Official driver headshot from API-Sports media CDN (GET /drivers, rankings). */
export function getDriverImageUrl(driverId?: number | null, image?: string | null) {
  if (image) return image;
  if (driverId == null || driverId <= 0) return null;
  return `https://media.api-sports.io/formula-1/drivers/${driverId}.png`;
}

export function getTeamVisual(teamId?: number | null, teamName?: string | null): TeamVisual {
  if (teamId != null && teamId > 0) {
    const byId = F1_TEAMS.find((team) => team.id === teamId);
    if (byId) return byId;
  }

  if (teamName) {
    const normalized = teamName.trim().toLowerCase();
    const aliasId = TEAM_NAME_ALIASES[normalized];
    if (aliasId != null) {
      const byAlias = F1_TEAMS.find((team) => team.id === aliasId);
      if (byAlias) return byAlias;
    }

    const byName = F1_TEAMS.find((team) => team.name.toLowerCase() === normalized);
    if (byName) return byName;

    const byPartial = F1_TEAMS.find((team) => {
      const teamNameLower = team.name.toLowerCase();
      return normalized.includes(teamNameLower) || teamNameLower.includes(normalized);
    });
    if (byPartial) return byPartial;
  }

  return DEFAULT_TEAM;
}

export function driverAbbrFromName(driverName: string) {
  const parts = driverName.trim().split(/\s+/);
  const surname = parts[parts.length - 1] ?? driverName;
  return surname.slice(0, 3).toUpperCase();
}
