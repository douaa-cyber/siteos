import { requireSession } from "@/lib/pageAuth";
import { listProjectsForUser } from "@/lib/services/projectService";
import { getMaterials } from "@/lib/services/materialService";
import { TopBar } from "@/components/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { unitLabel } from "@/lib/format";
import Link from "next/link";

export default async function OrgMaterialsPage() {
  const user = await requireSession();
  const projects = listProjectsForUser(user.id, user.role);
  const materials = projects.flatMap((p) => getMaterials(p.id).map((m) => ({ ...m, projectName: p.name })));
  const warnings = materials.filter((m) => m.status !== "OK");

  return (
    <>
      <TopBar title="Materials" subtitle={`${warnings.length} need attention across all projects`} user={user} />
      <main className="flex-1 p-6">
        <Card>
          <CardHeader title="All materials" subtitle="Across every project you have access to" />
          <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
            {materials.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{m.name}</p>
                  <Link href={`/projects/${m.projectId}`} className="text-xs text-brand hover:underline">
                    {m.projectName}
                  </Link>
                  <p className="text-xs text-text-secondary">
                    {m.currentStock} {unitLabel(m.unit)} in stock
                  </p>
                </div>
                {m.status !== "OK" && (
                  <StatusPill status={m.status === "CRITICAL" ? "critical" : "warning"}>
                    {m.daysRemaining !== null ? `${Math.max(0, Math.round(m.daysRemaining))}d left` : "Reorder soon"}
                  </StatusPill>
                )}
              </div>
            ))}
            {materials.length === 0 && (
              <p className="py-8 text-center text-sm text-text-secondary">No materials tracked yet.</p>
            )}
          </div>
        </Card>
      </main>
    </>
  );
}
