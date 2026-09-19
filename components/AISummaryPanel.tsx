"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import type { AIReport } from "@/lib/types";

export function AISummaryPanel({ projectId, date }: { projectId: string; date: string }) {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/ai-report?date=${date}`)
      .then((r) => r.json())
      .then((data) => setReport(data.report))
      .finally(() => setLoading(false));
  }, [projectId, date]);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/ai-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      setReport(data);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title="AI daily summary"
        subtitle="Generated from today's structured project data"
        action={
          <Button size="sm" variant="secondary" onClick={generate} disabled={generating}>
            <Sparkles size={13} />
            {generating ? "Generating…" : report ? "Regenerate" : "Generate summary"}
          </Button>
        }
      />
      <div className="p-5">
        {loading && <p className="text-sm text-text-secondary">Loading…</p>}
        {!loading && !report && (
          <p className="text-sm text-text-secondary">
            No summary yet for this date. Generate one from today&apos;s expenses, materials, and site report.
          </p>
        )}
        {report && (
          <>
            <p className="text-sm leading-relaxed text-text-primary">{report.summary}</p>
            {report.isMocked && (
              <p className="mt-3 text-xs text-text-secondary">
                Generated from project data without an external AI provider. Set{" "}
                <code className="font-mono-data">ANTHROPIC_API_KEY</code> to enable AI-written summaries.
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
