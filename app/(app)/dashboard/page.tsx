import { requireSession } from "@/lib/pageAuth";
import { getOrgOverview, getTotalSpent } from "@/lib/services/projectService";
import { getAllActiveAlerts } from "@/lib/services/alertService";
import { getMaterials } from "@/lib/services/materialService";
import { TopBar } from "@/components/TopBar";
import { StatCard } from "@/components/StatCard";
import { ProjectCard } from "@/components/ProjectCard";
import { formatDA } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import Link from "next/link";
import { AlertTriangle, AlertOctagon } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireSession();
  const overview = getOrgOverview(user.id, user.role);
  const alerts = getAllActiveAlerts(overview.projects.map((p) => p.id));
  const materialWarnings = overview.projects
    .flatMap((p) => getMaterials(p.id))
    .filter((m) => m.status !== "OK");

  const topAlerts = [...alerts]
    .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "CRITICAL" ? -1 : 1))
    .slice(0, 5);

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${user.name.split(" ")[0]} — here's how your sites are doing.`}
        user={user}
      />
      <main className="flex-1 space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard label="Total budget" value={formatDA(overview.totalBudget)} />
          <StatCard label="Total spent" value={formatDA(overview.totalSpent)} tone="brand" />
          <StatCard label="Remaining" value={formatDA(overview.remainingBudget)} tone="good" />
          <StatCard label="Active projects" value={String(overview.activeProjects)} />
          <StatCard
            label="Budget at risk"
            value={`${overview.projectsAtRisk} project${overview.projectsAtRisk === 1 ? "" : "s"}`}
            tone={overview.projectsAtRisk > 0 ? "warning" : "good"}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">Your projects</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {overview.projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  spent={getTotalSpent(p.id)}
                  alerts={alerts.filter((a) => a.projectId === p.id)}
                />
              ))}
              {overview.projects.length === 0 && (
                <Card className="p-8 text-center text-sm text-text-secondary sm:col-span-2">
                  No projects assigned to your account yet.
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader
                title="Active alerts"
                subtitle={`${alerts.length} across all projects`}
                action={
                  <Link href="/alerts" className="text-xs font-medium text-brand hover:underline">
                    View all
                  </Link>
                }
              />
              <div className="mt-3 divide-y divide-border-hair px-5 pb-5">
                {topAlerts.length === 0 && (
                  <p className="py-3 text-sm text-text-secondary">No active alerts. Everything looks healthy.</p>
                )}
                {topAlerts.map((a) => {
                  const project = overview.projects.find((p) => p.id === a.projectId);
                  return (
                    <div key={a.id} className="flex items-start gap-2.5 py-3">
                      {a.severity === "CRITICAL" ? (
                        <AlertOctagon size={15} className="mt-0.5 shrink-0 text-status-critical" />
                      ) : (
                        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-status-warning" />
                      )}
                      <div>
                        <p className="text-sm text-text-primary">{a.message}</p>
                        {project && (
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-xs text-text-secondary hover:text-brand"
                          >
                            {project.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <CardHeader title="Material warnings" subtitle={`${materialWarnings.length} materials need attention`} />
              <div className="mt-3 divide-y divide-border-hair px-5 pb-5">
                {materialWarnings.length === 0 && (
                  <p className="py-3 text-sm text-text-secondary">All material stock levels are healthy.</p>
                )}
                {materialWarnings.slice(0, 5).map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-text-primary">{m.name}</p>
                      <p className="text-xs text-text-secondary">
                        {overview.projects.find((p) => p.id === m.projectId)?.name}
                      </p>
                    </div>
                    <StatusPill status={m.status === "CRITICAL" ? "critical" : "warning"}>
                      {m.daysRemaining !== null ? `${Math.max(0, Math.round(m.daysRemaining))}d left` : "Low"}
                    </StatusPill>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
