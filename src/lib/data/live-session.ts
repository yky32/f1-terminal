import type { ApiSportsRaceStatus, ApiSportsRaceType } from "@/lib/f1/api-sports-types";

export type SessionType = "FP1" | "FP2" | "FP3" | "Q" | "SQ" | "S" | "R";

export type WeekendStatus = "upcoming" | "active" | "finished";

export type LiveSession = {
  id: number;
  raceId: string;
  sessionType: SessionType;
  typeLabel: ApiSportsRaceType;
  meetingName: string;
  circuit: string;
  circuitId: number;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  status: ApiSportsRaceStatus;
  statusShort: string;
  startTime: string;
  weekendStatus: WeekendStatus;
  round: number;
  season: number;
  lapsCurrent: number | null;
  lapsTotal: number | null;
};

export function sessionTypeFromApi(type: ApiSportsRaceType): SessionType {
  switch (type) {
    case "1st Practice":
      return "FP1";
    case "2nd Practice":
      return "FP2";
    case "3rd Practice":
      return "FP3";
    case "1st Qualifying":
    case "2nd Qualifying":
    case "3rd Qualifying":
      return "Q";
    case "Sprint Qualifying":
      return "SQ";
    case "Sprint":
      return "S";
    case "Race":
      return "R";
    default:
      return "R";
  }
}

export function isSessionLive(session: LiveSession) {
  return session.status === "Live";
}

export function isSessionUpcoming(session: LiveSession) {
  return session.status === "Scheduled";
}

export function sessionCountdownLabel(startTime: string, now = Date.now()) {
  const start = new Date(startTime).getTime();
  const diffMs = start - now;

  if (diffMs <= 0) return "Started";

  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);

  if (hours >= 48) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
