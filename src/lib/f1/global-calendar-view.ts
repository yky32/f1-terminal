import type { GlobalRaceCalendarEntry } from "@/lib/data/global-overview";

export type GlobalCalendarViewMode = "carousel" | "calendar" | "grid";

export const GLOBAL_CALENDAR_VIEW_KEY = "f1-terminal-global-calendar-view";

const VALID_MODES = new Set<GlobalCalendarViewMode>(["carousel", "calendar", "grid"]);

export function readGlobalCalendarView(): GlobalCalendarViewMode {
  if (typeof window === "undefined") return "carousel";
  try {
    const stored = window.localStorage.getItem(GLOBAL_CALENDAR_VIEW_KEY);
    if (stored && VALID_MODES.has(stored as GlobalCalendarViewMode)) {
      return stored as GlobalCalendarViewMode;
    }
  } catch {
    // ignore quota / private mode
  }
  return "carousel";
}

export function writeGlobalCalendarView(mode: GlobalCalendarViewMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GLOBAL_CALENDAR_VIEW_KEY, mode);
  } catch {
    // ignore quota / private mode
  }
}

export type CalendarMonthBucket = {
  key: string;
  year: number;
  month: number;
  label: string;
  races: GlobalRaceCalendarEntry[];
};

export function groupRacesByMonth(
  races: GlobalRaceCalendarEntry[],
): CalendarMonthBucket[] {
  const map = new Map<string, CalendarMonthBucket>();

  for (const race of races) {
    const date = new Date(race.raceDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    const existing = map.get(key);
    if (existing) {
      existing.races.push(race);
    } else {
      map.set(key, {
        key,
        year,
        month,
        label: date.toLocaleString(undefined, { month: "long", year: "numeric" }),
        races: [race],
      });
    }
  }

  return [...map.values()]
    .map((bucket) => ({
      ...bucket,
      races: [...bucket.races].sort(
        (a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
      ),
    }))
    .sort((a, b) => a.year - b.year || a.month - b.month);
}

export function racesByDayInMonth(races: GlobalRaceCalendarEntry[]) {
  const byDay = new Map<number, GlobalRaceCalendarEntry[]>();

  for (const race of races) {
    const day = new Date(race.raceDate).getDate();
    const list = byDay.get(day) ?? [];
    list.push(race);
    byDay.set(day, list);
  }

  return byDay;
}

/** Monday-first offset (0 = Monday … 6 = Sunday). */
export function mondayFirstOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Month index to open first: live weekend, else current month, else next with races. */
export function initialCalendarMonthIndex(months: CalendarMonthBucket[]): number {
  if (months.length === 0) return 0;

  const focus = calendarFocusTarget(months);
  if (focus) return focus.monthIndex;

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`;
  const currentIndex = months.findIndex((month) => month.key === currentKey);
  if (currentIndex >= 0) return currentIndex;

  const today = now.getTime();
  const upcomingIndex = months.findIndex((month) =>
    month.races.some((race) => new Date(race.raceDate).getTime() >= today),
  );
  if (upcomingIndex >= 0) return upcomingIndex;

  return months.length - 1;
}

export type CalendarFocusTarget = {
  monthIndex: number;
  raceId: string;
  kind: "active" | "upcoming";
};

/** Live weekend month first, else next upcoming race month. */
export function calendarFocusTarget(
  months: CalendarMonthBucket[],
): CalendarFocusTarget | null {
  for (let index = 0; index < months.length; index += 1) {
    const race = months[index].races.find((entry) => entry.weekendStatus === "active");
    if (race) {
      return { monthIndex: index, raceId: race.id, kind: "active" };
    }
  }

  for (let index = 0; index < months.length; index += 1) {
    const race = months[index].races.find((entry) => entry.weekendStatus === "upcoming");
    if (race) {
      return { monthIndex: index, raceId: race.id, kind: "upcoming" };
    }
  }

  return null;
}
