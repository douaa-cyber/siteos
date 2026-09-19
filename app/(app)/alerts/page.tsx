import { requireSession } from "@/lib/pageAuth";
import { listProjectsForUser } from "@/lib/services/projectService";
import { getAllActiveAlerts } from "@/lib/services/alertService";
import { TopBar } from "@/components/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function AlertsPage() {
  const user = await requireSession();
  const projects = listProjectsForUser(user.id, user.role);
  const alerts = getAllActiveAlerts(projects.map((p) => p.id)).sort((a, b) =>
    a.severity === b.severity ? 0 : a.severity === "CRITICAL" ? -1 : 1
  );

  return (
    <>
      <TopBar title="Alerts" subtitle={`${alerts.length} active across all projects`} user={user} />
      <main className="flex-1 p-6">
        <Card>
          <CardHeader title="All active alerts" />
          <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
            {alerts.length === 0 && (
              <p className="py-8 text-center text-sm text-text-secondary">No active alerts. Everything looks healthy.</p>
            )}
            {alerts.map((a) => {
              const project = projects.find((p) => p.id === a.projectId);
              return (
                <div key={a.id} className="flex items-start gap-3 py-4">
                  {a.severity === "CRITICAL" ? (
                    <AlertOctagon size={16} className="mt-0.5 shrink-0 text-status-critical" />
                  ) : (
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-status-warning" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StatusPill status={a.severity === "CRITICAL" ? "critical" : "warning"}>
                        {a.severity === "CRITICAL" ? "Critical" : "Warning"}
                      </StatusPill>
                      {project && (
                        <Link href={`/projects/${project.id}`} className="text-xs font-medium text-brand hover:underline">
                          {project.name}
                        </Link>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-text-primary">{a.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </>
  );
}
