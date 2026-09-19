import { NextResponse } from "next/server";
import { requireUser } from "@/lib/apiAuth";
import { getOrgOverview, getTotalSpent } from "@/lib/services/projectService";
import { getSpendingEfficiency } from "@/lib/services/insightsService";
import { getAllActiveAlerts } from "@/lib/services/alertService";
import { getMaterials } from "@/lib/services/materialService";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const overview = getOrgOverview(auth.user.id, auth.user.role);
  const alerts = getAllActiveAlerts(overview.projects.map((p) => p.id));
  const materialWarnings = overview.projects
    .flatMap((p) => getMaterials(p.id))
    .filter((m) => m.status !== "OK").length;

  const projects = overview.projects.map((p) => {
    const spent = getTotalSpent(p.id);
    const efficiency = getSpendingEfficiency(p.id);
    const projectAlerts = alerts.filter((a) => a.projectId === p.id);
    return {
      ...p,
      spent,
      remaining: p.totalBudget - spent,
      spendingEfficiency: efficiency,
      activeAlertCount: projectAlerts.length,
      alerts: projectAlerts,
    };
  });

  return NextResponse.json({
    totalBudget: overview.totalBudget,
    totalSpent: overview.totalSpent,
    remainingBudget: overview.remainingBudget,
    activeProjects: overview.activeProjects,
    projectsAtRisk: overview.projectsAtRisk,
    materialWarnings,
    projects,
  });
}
