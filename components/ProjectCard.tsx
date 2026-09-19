import Link from "next/link";
import { formatDA } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";
import { AlertTriangle, MapPin } from "lucide-react";
import type { Alert, Project } from "@/lib/types";

const STATUS_LABEL: Record<Project["status"], string> = {
  ON_TRACK: "On track",
  AT_RISK: "Budget risk",
  CRITICAL: "Critical",
  COMPLETED: "Completed",
};

const STATUS_TONE: Record<Project["status"], "good" | "warning" | "critical" | "neutral"> = {
  ON_TRACK: "good",
  AT_RISK: "warning",
  CRITICAL: "critical",
  COMPLETED: "neutral",
};

export function ProjectCard({
  project,
  spent,
  alerts,
}: {
  project: Project;
  spent: number;
  alerts: Alert[];
}) {
  const percentSpent = project.totalBudget > 0 ? (spent / project.totalBudget) * 100 : 0;
  const barTone =
    percentSpent - project.progressPercent >= 10 ? "bg-status-warning" : "bg-brand";

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-md border border-border-hair bg-surface-card p-5 transition-shadow hover:shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(20,24,28,0.12)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{project.name}</h3>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
            <MapPin size={12} />
            {project.location}
          </div>
        </div>
        <StatusPill status={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</StatusPill>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Progress</span>
          <span className="font-mono-data font-medium text-text-primary">{project.progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-page">
          <div className={`h-full ${barTone}`} style={{ width: `${project.progressPercent}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xs text-text-secondary">Budget</div>
          <div className="font-mono-data text-sm text-text-primary">
            {formatDA(spent)} <span className="text-text-secondary">/ {formatDA(project.totalBudget)}</span>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-status-warning">
            <AlertTriangle size={13} />
            {alerts.length} alert{alerts.length === 1 ? "" : "s"}
          </div>
        )}
      </div>
    </Link>
  );
}
