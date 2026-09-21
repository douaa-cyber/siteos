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

export interface UpdateProjectInput {
  name?: string;
  location?: string;
  clientName?: string;
  budget?: number;
  progress?: number;
  status?: string;
  startDate?: string;
  expectedEndDate?: string;
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectInput,
) {
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to update project");
  }

  return response.json();
}

export interface CreateProjectInput {
  name: string;
  location: string;
  clientName: string;
  budget: number;
  startDate: string;
  expectedEndDate: string;

  categories: {
    name: string;
  }[];

  expenses: {
    categoryName: string;
    description: string;
    amount: number;
    supplier: string;
    paymentMethod: string;
    date: string;
    notes?: string;
  }[];
}

export async function createProject(
  payload: CreateProjectInput,
): Promise<ProjectSummary> {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Failed to create project");
  }

  return response.json();
}
