"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Field";
import { StatusPill } from "@/components/ui/StatusPill";
import { unitLabel } from "@/lib/format";
import type { MaterialWithStatus } from "@/lib/services/materialService";
import { ChevronDown, ChevronUp } from "lucide-react";

export function MaterialRow({ projectId, material }: { projectId: string; material: MaterialWithStatus }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/projects/${projectId}/materials/${material.id}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.get("type"),
          quantity: Number(form.get("quantity")),
          date: new Date().toISOString(),
          note: form.get("note") || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not record transaction.");
        return;
      }
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-3">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-medium text-text-primary">{material.name}</p>
          <p className="text-xs text-text-secondary">
            {material.currentStock} {unitLabel(material.unit)} in stock · min {material.minStock}{" "}
            {unitLabel(material.unit)} · avg {material.avgDailyUsage}/day
          </p>
        </div>
        <div className="flex items-center gap-3">
          {material.status !== "OK" && (
            <StatusPill status={material.status === "CRITICAL" ? "critical" : "warning"}>
              {material.daysRemaining !== null
                ? `${Math.max(0, Math.round(material.daysRemaining))}d left`
                : "Reorder soon"}
            </StatusPill>
          )}
          {expanded ? <ChevronUp size={16} className="text-text-secondary" /> : <ChevronDown size={16} className="text-text-secondary" />}
        </div>
      </button>

      {expanded && (
        <form onSubmit={onSubmit} className="mt-3 flex flex-wrap items-end gap-3 rounded-sm bg-surface-page p-3">
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Type</label>
            <Select name="type" defaultValue="PURCHASE" className="w-40">
              <option value="PURCHASE">Purchase</option>
              <option value="CONSUMPTION">Consumption</option>
              <option value="ADJUSTMENT">Adjustment (set to)</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Quantity</label>
            <Input name="quantity" type="number" min="0" step="any" required className="w-28" placeholder="35" />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="mb-1 block text-xs text-text-secondary">Note</label>
            <Input name="note" placeholder="Optional" />
          </div>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Saving…" : "Record"}
          </Button>
        </form>
      )}
      {error && <p className="mt-2 text-xs text-status-critical">{error}</p>}
    </div>
  );
}
