import { events } from "@/data/events";
import type { AstraEvent } from "@/types/Event";

/**
 * Data-access layer for events. Every function here returns mock data today
 * and a real API response tomorrow — callers never import from data/ directly.
 * See ARCHITECTURE.md section 6.
 */

export function eventStartsAt({ date, time }: Pick<AstraEvent, "date" | "time">) {
  // Dates/times are supplied in the club's local time, not as UTC timestamps.
  return new Date(`${date}T${time}:00`).getTime();
}

function sortByDateAsc(a: AstraEvent, b: AstraEvent) {
  return eventStartsAt(a) - eventStartsAt(b);
}

export async function getEvents(): Promise<AstraEvent[]> {
  return [...events].sort(sortByDateAsc);
}

export async function getNextEvent(): Promise<AstraEvent | null> {
  const now = Date.now();
  const upcoming = events
    .filter((event) => eventStartsAt(event) >= now)
    .sort(sortByDateAsc);
  return upcoming[0] ?? null;
}

export async function getRecentEvents(limit = 3): Promise<AstraEvent[]> {
  return [...events].sort(sortByDateAsc).reverse().slice(0, limit);
}
