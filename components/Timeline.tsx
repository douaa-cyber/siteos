import { Card, CardHeader } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format";
import type { TimelineEvent } from "@/lib/services/timelineService";
import { HardHat, Truck, Wallet, FileText, AlertTriangle, PackageMinus } from "lucide-react";

const ICONS: Record<TimelineEvent["icon"], typeof HardHat> = {
  workers: HardHat,
  delivery: Truck,
  expense: Wallet,
  report: FileText,
  issue: AlertTriangle,
  consumption: PackageMinus,
};

export function Timeline({ events, title = "Today" }: { events: TimelineEvent[]; title?: string }) {
  return (
    <Card>
      <CardHeader title="Site activity" subtitle={title} />
      <div className="p-5">
        {events.length === 0 && <p className="text-sm text-text-secondary">No activity recorded yet.</p>}
        <ol className="space-y-4">
          {events.map((e) => {
            const Icon = ICONS[e.icon];
            return (
              <li key={e.id} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-page text-text-secondary">
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-sm text-text-primary">{e.label}</p>
                  <p className="font-mono-data text-xs text-text-secondary">{formatDateTime(e.time)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
