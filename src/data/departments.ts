import type { Department } from "@/types/Department";

/**
 * Placeholder roster structure — seat counts only, no names/photos yet.
 * Once real members exist, give Department a `members: TeamMember[]` and
 * DepartmentSection can render real cards instead of empty slots with no
 * changes to the section/grid layout itself.
 */
export const departments: Department[] = [
  { id: "leadership", name: "Leadership", placeholderCount: 4 },
  { id: "robotics", name: "Robotics", placeholderCount: 1 },
  { id: "space", name: "Space", placeholderCount: 1 },
  { id: "tech", name: "Tech", placeholderCount: 2 },
  { id: "media", name: "Media", placeholderCount: 2 },
  { id: "design", name: "Design", placeholderCount: 1 },
  { id: "content", name: "Content", placeholderCount: 2 },
  { id: "documentation", name: "Documentation", placeholderCount: 1 },
  { id: "publicity", name: "Publicity", placeholderCount: 2 },
  { id: "outreach", name: "Outreach", placeholderCount: 1 },
  { id: "events", name: "Events", placeholderCount: 2 },
  { id: "marketing", name: "Marketing", placeholderCount: 2 },
  { id: "ambience", name: "Ambience", placeholderCount: 1 },
];
