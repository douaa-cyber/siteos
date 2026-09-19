"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

const REPORT_TYPES: { value: string; label: string; description: string }[] = [
  { value: "health", label: "Project health", description: "Budget, progress, and risk insights" },
  { value: "daily", label: "Daily report", description: "Today's activity, expenses, and issues" },
  { value: "weekly", label: "Weekly report", description: "Last 7 days of activity and spend" },
  { value: "expense", label: "Expense report", description: "Spending by category vs plan" },
  { value: "material", label: "Material report", description: "Stock levels and reorder risk" },
];

export function ReportViewer({ projectId, date }: { projectId: string; date: string }) {
  const [type, setType] = useState("health");
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(t: string) {
    setType(t);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/generated-report?type=${t}&date=${date}`);
      const data = await res.json();
      setContent(data.content);
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-1">
        {REPORT_TYPES.map((r) => (
          <button
            key={r.value}
            onClick={() => load(r.value)}
            className={`w-full rounded-md border p-4 text-left transition-colors ${
              type === r.value
                ? "border-brand bg-surface-card"
                : "border-border-hair bg-surface-card hover:border-brand/50"
            }`}
          >
            <p className="text-sm font-medium text-text-primary">{r.label}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{r.description}</p>
          </button>
        ))}
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader
            title={REPORT_TYPES.find((r) => r.value === type)?.label ?? "Report"}
            action={
              <Button size="sm" variant="secondary" onClick={download} disabled={!content}>
                <Download size={13} /> Download .txt
              </Button>
            }
          />
          <div className="p-5">
            {!content && !loading && (
              <p className="text-sm text-text-secondary">Select a report type to generate it from live project data.</p>
            )}
            {loading && <p className="text-sm text-text-secondary">Generating…</p>}
            {content && (
              <pre className="whitespace-pre-wrap font-mono-data text-xs leading-relaxed text-text-primary">
                {content}
              </pre>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
