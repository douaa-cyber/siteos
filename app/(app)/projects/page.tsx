import { requireSession } from "@/lib/pageAuth";
import { listProjectsForUser, getTotalSpent } from "@/lib/services/projectService";
import { getAllActiveAlerts } from "@/lib/services/alertService";
import { TopBar } from "@/components/TopBar";
import { ProjectCard } from "@/components/ProjectCard";
import { Card } from "@/components/ui/Card";

export default async function ProjectsPage() {
  const user = await requireSession();
  const projects = listProjectsForUser(user.id, user.role);
  const alerts = getAllActiveAlerts(projects.map((p) => p.id));

  return (
    <>
      <TopBar title="Projects" subtitle={`${projects.length} construction site${projects.length === 1 ? "" : "s"}`} user={user} />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              spent={getTotalSpent(p.id)}
              alerts={alerts.filter((a) => a.projectId === p.id)}
            />
          ))}
          {projects.length === 0 && (
            <Card className="p-8 text-center text-sm text-text-secondary sm:col-span-2 xl:col-span-3">
              No projects assigned to your account yet.
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
