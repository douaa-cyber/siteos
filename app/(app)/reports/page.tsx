import { requireSession } from "@/lib/pageAuth";
import { listProjectsForUser } from "@/lib/services/projectService";
import { TopBar } from "@/components/TopBar";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function OrgReportsPage() {
  const user = await requireSession();
  const projects = listProjectsForUser(user.id, user.role);

  return (
    <>
      <TopBar title="Reports" subtitle="Pick a project to generate its reports" user={user} />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}/reports`}>
              <Card className="flex items-center justify-between p-5 transition-colors hover:border-brand/50">
                <div>
                  <p className="text-sm font-medium text-text-primary">{p.name}</p>
                  <p className="text-xs text-text-secondary">{p.location}</p>
                </div>
                <ChevronRight size={16} className="text-text-secondary" />
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
