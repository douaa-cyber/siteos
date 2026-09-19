import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getProject, getTotalSpent } from "@/lib/services/projectService";
import { getBudgetBreakdown, getSpendingOverTime, getSpendingByCategory } from "@/lib/services/budgetService";
import { getSpendingEfficiency } from "@/lib/services/insightsService";
import { getMaterials } from "@/lib/services/materialService";
import { getAlerts } from "@/lib/services/alertService";
import { getLatestDailyReport } from "@/lib/services/reportService";
import { getTimeline } from "@/lib/services/timelineService";
import { DEMO_TODAY } from "@/lib/data/seed";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const spent = getTotalSpent(id);

  return NextResponse.json({
    project: { ...project, spent, remaining: project.totalBudget - spent },
    spendingEfficiency: getSpendingEfficiency(id),
    budgetBreakdown: getBudgetBreakdown(id),
    spendingOverTime: getSpendingOverTime(id),
    spendingByCategory: getSpendingByCategory(id),
    materials: getMaterials(id),
    alerts: getAlerts(id),
    latestReport: getLatestDailyReport(id) ?? null,
    timeline: getTimeline(id, DEMO_TODAY),
  });
}
