import { getProject, getTotalSpent } from "@/lib/services/projectService";
import { getSpendingEfficiency, getInsights } from "@/lib/services/insightsService";
import { getSpendingByCategory, getSpendingOverTime } from "@/lib/services/budgetService";
import { getMaterials } from "@/lib/services/materialService";
import { getAlerts } from "@/lib/services/alertService";
import { getLatestDailyReport } from "@/lib/services/reportService";
import { getTimeline } from "@/lib/services/timelineService";
import { DEMO_TODAY } from "@/lib/data/seed";
import { notFound } from "next/navigation";

import { HealthPanel } from "@/components/HealthPanel";
import { InsightsList } from "@/components/InsightsList";
import { Timeline } from "@/components/Timeline";
import { AISummaryPanel } from "@/components/AISummaryPanel";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { SpendingByCategoryChart } from "@/components/charts/SpendingByCategoryChart";
import { SpendingOverTimeChart } from "@/components/charts/SpendingOverTimeChart";
import { formatDA, formatDate } from "@/lib/format";
import Link from "next/link";

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const spent = getTotalSpent(id);
  const efficiency = getSpendingEfficiency(id);
  const insights = getInsights(id);
  const spendingByCategory = getSpendingByCategory(id);
  const spendingOverTime = getSpendingOverTime(id);
  const materials = getMaterials(id);
  const alerts = getAlerts(id);
  const latestReport = getLatestDailyReport(id);
  const timeline = getTimeline(id, DEMO_TODAY);
  const criticalMaterials = materials.filter((m) => m.status !== "OK");

  return (
    <div className="space-y-6">
      <HealthPanel
        totalBudget={project.totalBudget}
        spent={spent}
        progressPercent={project.progressPercent}
        efficiency={efficiency}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader title="Spending by category" />
              <div className="px-2 pb-3">
                <SpendingByCategoryChart data={spendingByCategory} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Spending over time" subtitle="Cumulative" />
              <div className="px-2 pb-3">
                <SpendingOverTimeChart data={spendingOverTime} />
              </div>
            </Card>
          </div>

          <InsightsList insights={insights} />
          <AISummaryPanel projectId={id} date={DEMO_TODAY} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Alerts"
              subtitle={`${alerts.length} active`}
              action={
                <Link href={`/projects/${id}/reports`} className="text-xs font-medium text-brand hover:underline">
                  View reports
                </Link>
              }
            />
            <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
              {alerts.length === 0 && <p className="py-3 text-sm text-text-secondary">No active alerts.</p>}
              {alerts.map((a) => (
                <div key={a.id} className="py-3">
                  <StatusPill status={a.severity === "CRITICAL" ? "critical" : "warning"} className="mb-1.5">
                    {a.severity === "CRITICAL" ? "Critical" : "Warning"}
                  </StatusPill>
                  <p className="text-sm text-text-primary">{a.message}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Materials"
              subtitle={`${criticalMaterials.length} need attention`}
              action={
                <Link href={`/projects/${id}/materials`} className="text-xs font-medium text-brand hover:underline">
                  View all
                </Link>
              }
            />
            <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
              {materials.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm text-text-primary">{m.name}</p>
                    <p className="text-xs text-text-secondary">
                      {m.currentStock} {m.unit.toLowerCase()} in stock
                    </p>
                  </div>
                  {m.status !== "OK" && (
                    <StatusPill status={m.status === "CRITICAL" ? "critical" : "warning"}>
                      {m.daysRemaining !== null ? `${Math.max(0, Math.round(m.daysRemaining))}d left` : "Low"}
                    </StatusPill>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {latestReport && (
            <Card>
              <CardHeader
                title="Latest daily report"
                subtitle={formatDate(latestReport.date)}
                action={
                  <Link href={`/projects/${id}/daily-reports`} className="text-xs font-medium text-brand hover:underline">
                    View all
                  </Link>
                }
              />
              <div className="space-y-2 p-5 pt-2 text-sm">
                <p className="text-text-primary">{latestReport.workCompleted}</p>
                <p className="text-text-secondary">{latestReport.workerCount} workers on site</p>
                {latestReport.issues && (
                  <p className="text-status-warning">Issue: {latestReport.issues}</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Timeline events={timeline} title={`Today, ${formatDate(DEMO_TODAY)}`} />
    </div>
  );
}
