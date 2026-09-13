import type { TeamMember } from "@/types/TeamMember";

/**
 * Placeholder team data for the Home page teaser. Replace with a real API
 * response shaped as TeamMember[] once the backend exists — see
 * services/teamService.ts. The full roster lives on the Team page.
 */
export const teamMembers: TeamMember[] = [
  { id: "chairperson", name: "Ananya Menon", role: "Chairperson", initials: "AM" },
  { id: "robotics-lead", name: "Rohan Nair", role: "Robotics Lead", initials: "RN" },
  { id: "astronomy-lead", name: "Diya Thomas", role: "Astronomy Lead", initials: "DT" },
  { id: "events-lead", name: "Arjun Kumar", role: "Events Lead", initials: "AK" },
  { id: "outreach-lead", name: "Farah Rahman", role: "Outreach Lead", initials: "FR" },
];
