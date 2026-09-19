import { getDailyReports } from "@/lib/services/reportService";
import { Card, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { AddDailyReportModal } from "./AddDailyReportModal";
import { HardHat, AlertTriangle, CloudSun, Image as ImageIcon } from "lucide-react";

export default async function ProjectDailyReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reports = getDailyReports(id);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddDailyReportModal projectId={id} />
      </div>

      {reports.length === 0 && (
        <Card className="p-8 text-center text-sm text-text-secondary">No daily reports submitted yet.</Card>
      )}

      {reports.map((r) => (
        <Card key={r.id}>
          <CardHeader
            title={formatDate(r.date)}
            subtitle={`${r.workerCount} workers on site`}
            action={
              r.weather ? (
                <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <CloudSun size={14} /> {r.weather}
                </span>
              ) : undefined
            }
          />
          <div className="space-y-3 p-5 pt-3 text-sm">
            <div className="flex items-start gap-2.5">
              <HardHat size={15} className="mt-0.5 shrink-0 text-text-secondary" />
              <p className="text-text-primary">{r.workCompleted}</p>
            </div>
            {(r.materialsReceived || r.materialsConsumed) && (
              <div className="grid grid-cols-1 gap-3 rounded-sm bg-surface-page p-3 sm:grid-cols-2">
                {r.materialsReceived && (
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Materials received</p>
                    <p className="text-text-primary">{r.materialsReceived}</p>
                  </div>
                )}
                {r.materialsConsumed && (
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Materials consumed</p>
                    <p className="text-text-primary">{r.materialsConsumed}</p>
                  </div>
                )}
              </div>
            )}
            {r.issues && (
              <div className="flex items-start gap-2.5 rounded-sm bg-status-warning-bg px-3 py-2 text-status-warning">
                <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                <p>{r.issues}</p>
              </div>
            )}
            {r.notes && <p className="text-text-secondary">{r.notes}</p>}
            {r.photos.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <ImageIcon size={13} /> {r.photos.length} photo{r.photos.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
