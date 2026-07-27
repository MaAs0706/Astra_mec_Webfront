export type EventCategory = "hackathon" | "workshop" | "observation" | "talk";

export interface AstraEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string; // ISO date string
  time: string;
  venue: string;
  summary: string;
}
