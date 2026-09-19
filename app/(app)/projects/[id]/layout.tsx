import { requireProjectPageAccess } from "@/lib/pageAuth";
import { getProject, getTotalSpent } from "@/lib/services/projectService";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProjectSubNav } from "./ProjectSubNav";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDA, formatDate } from "@/lib/format";
import { MapPin, User, Calendar } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  ON_TRACK: "On track",
  AT_RISK: "Budget risk",
  CRITICAL: "Critical",
  COMPLETED: "Completed",
};
const STATUS_TONE: Record<string, "good" | "warning" | "critical" | "neutral"> = {
  ON_TRACK: "good",
  AT_RISK: "warning",
  CRITICAL: "critical",
  COMPLETED: "neutral",
};

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireProjectPageAccess(id);
  const project = getProject(id);
  if (!project) notFound();

  const spent = getTotalSpent(id);

  return (
    <>
      <TopBar title={project.name} subtitle={project.location} user={user} />
      <div className="border-b border-border-hair bg-surface-card px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {project.location}
            </span>
            {project.client && (
              <span className="flex items-center gap-1.5">
                <User size={14} /> {project.client}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(project.startDate)} → {formatDate(project.expectedEndDate)}
            </span>
            <StatusPill status={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</StatusPill>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Progress</div>
              <div className="font-mono-data text-lg font-semibold text-text-primary">
                {project.progressPercent}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-secondary">Budget / Spent</div>
              <div className="font-mono-data text-lg font-semibold text-text-primary">
                {formatDA(project.totalBudget)}{" "}
                <span className="text-sm font-normal text-text-secondary">/ {formatDA(spent)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProjectSubNav projectId={id} />
      <main className="flex-1 p-6">{children}</main>
    </>
  );
}
