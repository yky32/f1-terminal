/** Round track width — keep panel axis and item grid column in sync (matches former w-9). */
export const raceCalendarTimelineVars = "[--race-calendar-round-col:2.25rem]" as const;

export const raceCalendarRoundColClass = "w-[var(--race-calendar-round-col)]" as const;

export const raceCalendarItemGridClass =
  "grid w-full grid-cols-[var(--race-calendar-round-col)_minmax(0,1fr)]" as const;

export const raceCalendarTimelineAxisClass =
  "left-[calc(var(--race-calendar-round-col)/2)]" as const;

export function scrollRaceCalendarItemToTop(
  container: HTMLElement,
  raceId: string,
  behavior: ScrollBehavior = "smooth",
) {
  const item = container.querySelector<HTMLElement>(`[data-race-id="${raceId}"]`);
  if (!item) {
    return false;
  }

  const scrollTop =
    container.scrollTop +
    item.getBoundingClientRect().top -
    container.getBoundingClientRect().top;

  container.scrollTo({ top: Math.max(0, scrollTop), behavior });
  return true;
}
