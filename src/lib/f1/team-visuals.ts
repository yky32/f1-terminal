export type TeamVisual = {
  id: number;
  name: string;
  abbr: string;
  primary: string;
  secondary: string;
};

export const F1_TEAMS: TeamVisual[] = [
  { id: 1, name: "Red Bull Racing", abbr: "RBR", primary: "#3671C6", secondary: "#1E41C3" },
  { id: 2, name: "McLaren", abbr: "MCL", primary: "#FF8000", secondary: "#47C7FC" },
  { id: 3, name: "Ferrari", abbr: "FER", primary: "#E8002D", secondary: "#FFF200" },
  { id: 4, name: "Mercedes", abbr: "MER", primary: "#27F4D2", secondary: "#007560" },
  { id: 5, name: "Aston Martin", abbr: "AMR", primary: "#229971", secondary: "#CEDC00" },
  { id: 6, name: "Alpine", abbr: "ALP", primary: "#0093CC", secondary: "#FF87BC" },
  { id: 7, name: "Williams", abbr: "WIL", primary: "#64C4FF", secondary: "#041E42" },
  { id: 8, name: "RB", abbr: "RB", primary: "#6692FF", secondary: "#061D42" },
  { id: 9, name: "Sauber", abbr: "SAU", primary: "#52E252", secondary: "#006629" },
  { id: 10, name: "Haas F1 Team", abbr: "HAA", primary: "#B6BABD", secondary: "#FFFFFF" },
];

const DEFAULT_TEAM: TeamVisual = {
  id: 0,
  name: "Unknown",
  abbr: "F1",
  primary: "#475569",
  secondary: "#94A3B8",
};

export function getTeamVisual(teamId?: number | null, teamName?: string | null): TeamVisual {
  if (teamId != null) {
    const byId = F1_TEAMS.find((team) => team.id === teamId);
    if (byId) return byId;
  }

  if (teamName) {
    const normalized = teamName.trim().toLowerCase();
    const byName = F1_TEAMS.find((team) => team.name.toLowerCase() === normalized);
    if (byName) return byName;
  }

  return DEFAULT_TEAM;
}

export function driverAbbrFromName(driverName: string) {
  const parts = driverName.trim().split(/\s+/);
  const surname = parts[parts.length - 1] ?? driverName;
  return surname.slice(0, 3).toUpperCase();
}
