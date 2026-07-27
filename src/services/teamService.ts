import { teamMembers } from "@/data/teamMembers";
import { departments } from "@/data/departments";
import type { TeamMember } from "@/types/TeamMember";
import type { Department } from "@/types/Department";

export async function getTeamMembers(): Promise<TeamMember[]> {
  return teamMembers;
}

export async function getFeaturedTeamMembers(limit = 4): Promise<TeamMember[]> {
  return teamMembers.slice(0, limit);
}

export async function getDepartments(): Promise<Department[]> {
  return departments;
}
