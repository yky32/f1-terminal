export const RACE_CALENDAR_COLLAPSED_KEY = "f1-terminal-races-calendar-collapsed";

export function readRaceCalendarCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(RACE_CALENDAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeRaceCalendarCollapsed(collapsed: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RACE_CALENDAR_COLLAPSED_KEY, String(collapsed));
  } catch {
    // ignore quota / private mode
  }
}
