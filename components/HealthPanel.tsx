import { Card, CardHeader } from "@/components/ui/Card";
import { formatDA } from "@/lib/format";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { SpendingEfficiency } from "@/lib/services/insightsService";

export function HealthPanel({
  totalBudget,
  spent,
  progressPercent,
  efficiency,
}: {
  totalBudget: number;
  spent: number;
  progressPercent: number;
  efficiency: SpendingEfficiency | null;
}) {
  const remaining = totalBudget - spent;
  const isAhead = efficiency?.isAhead ?? false;

  return (
    <Card>
      <CardHeader title="Project health" subtitle="Budget, progress, and how they compare" />
      <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-3">
        <div>
          <div className="text-xs text-text-secondary">Budget</div>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Planned</dt>
              <dd className="font-mono-data font-medium text-text-primary">{formatDA(totalBudget)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Spent</dt>
              <dd className="font-mono-data font-medium text-text-primary">{formatDA(spent)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Remaining</dt>
              <dd className="font-mono-data font-medium text-status-good">{formatDA(remaining)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="text-xs text-text-secondary">Progress</div>
          <div className="mt-2 font-mono-data text-3xl font-semibold text-text-primary">
            {progressPercent}%
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-page">
            <div className="h-full bg-brand" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div>
          <div className="text-xs text-text-secondary">Spending efficiency</div>
          {efficiency && (
            <div className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Progress</span>
                <span className="font-mono-data font-medium text-text-primary">
                  {Math.round(efficiency.progressPercent)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Budget consumed</span>
                <span className="font-mono-data font-medium text-text-primary">
                  {Math.round(efficiency.budgetConsumedPercent)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {efficiency && (
        <div
          className={`mx-5 mb-5 flex items-start gap-2.5 rounded-sm px-4 py-3 text-sm ${
            isAhead ? "bg-status-warning-bg text-status-warning" : "bg-status-good-bg text-status-good"
          }`}
        >
          {isAhead ? (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          )}
          <span>
            {isAhead
              ? `Spending is ahead of project progress — ${Math.round(efficiency.budgetConsumedPercent)}% of budget consumed vs ${Math.round(efficiency.progressPercent)}% complete.`
              : `Spending is tracking in line with physical progress.`}
          </span>
        </div>
      )}
    </Card>
  );
}
