import { events } from "@/data/events";
import type { AstraEvent } from "@/types/Event";

/**
 * Data-access layer for events. Every function here returns mock data today
 * and a real API response tomorrow — callers never import from data/ directly.
 * See ARCHITECTURE.md section 6.
 */

function sortByDateAsc(a: AstraEvent, b: AstraEvent) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export async function getEvents(): Promise<AstraEvent[]> {
  return [...events].sort(sortByDateAsc);
}

export async function getNextEvent(): Promise<AstraEvent | null> {
  const now = Date.now();
  const upcoming = events
    .filter((event) => new Date(event.date).getTime() >= now)
    .sort(sortByDateAsc);
  return upcoming[0] ?? null;
}

export async function getRecentEvents(limit = 3): Promise<AstraEvent[]> {
  return [...events].sort(sortByDateAsc).reverse().slice(0, limit);
}
