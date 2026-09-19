import { Card, CardHeader } from "@/components/ui/Card";
import type { Insight } from "@/lib/services/insightsService";
import { AlertOctagon, AlertTriangle, Sparkles } from "lucide-react";

export function InsightsList({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardHeader title="Smart insights" subtitle="Calculated from this project's real data" />
      <div className="space-y-3 p-5">
        {insights.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Sparkles size={15} />
            No notable risks detected right now.
          </div>
        )}
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 rounded-sm px-4 py-3 text-sm ${
              insight.severity === "CRITICAL"
                ? "bg-status-critical-bg text-status-critical"
                : "bg-status-warning-bg text-status-warning"
            }`}
          >
            {insight.severity === "CRITICAL" ? (
              <AlertOctagon size={16} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            )}
            <span>{insight.message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
