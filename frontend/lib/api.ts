import { DashboardData } from "@/types/dashboard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api";

export async function getProjectDashboard(
  projectId: string,
): Promise<DashboardData> {
  const response = await fetch(
    `http://localhost:4001/api/dashboard/projects/${projectId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project dashboard");
  }

  return response.json();
}
