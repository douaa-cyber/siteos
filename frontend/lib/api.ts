import { DashboardData, ProjectSummary } from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api";

export async function getProjectDashboard(
  projectId: string,
): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard/projects/${projectId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project dashboard");
  }

  return response.json();
}

export async function getProjects(): Promise<ProjectSummary[]> {
  const response = await fetch(`${API_URL}/projects`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function createProject(payload: {
  name: string;
  location: string;
  clientName: string;
  budget: number;
  startDate: string;
  expectedEndDate: string;
}): Promise<ProjectSummary> {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}
