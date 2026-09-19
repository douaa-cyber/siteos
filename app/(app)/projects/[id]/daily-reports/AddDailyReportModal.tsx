"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function AddDailyReportModal({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/projects/${projectId}/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.get("date"),
          workerCount: Number(form.get("workerCount")),
          workCompleted: form.get("workCompleted"),
          materialsReceived: form.get("materialsReceived") || undefined,
          materialsConsumed: form.get("materialsConsumed") || undefined,
          issues: form.get("issues") || undefined,
          weather: form.get("weather") || undefined,
          notes: form.get("notes") || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not save report.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={14} /> New daily report
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="New daily site report">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date" htmlFor="date" required>
              <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </Field>
            <Field label="Workers on site" htmlFor="workerCount" required>
              <Input id="workerCount" name="workerCount" type="number" min="0" required placeholder="12" />
            </Field>
          </div>
          <Field label="Work completed" htmlFor="workCompleted" required>
            <Textarea id="workCompleted" name="workCompleted" rows={2} required placeholder="Completed concrete columns on the second floor." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Materials received" htmlFor="materialsReceived">
              <Textarea id="materialsReceived" name="materialsReceived" rows={2} placeholder="50 cement bags, 200kg steel" />
            </Field>
            <Field label="Materials consumed" htmlFor="materialsConsumed">
              <Textarea id="materialsConsumed" name="materialsConsumed" rows={2} placeholder="35 cement bags" />
            </Field>
          </div>
          <Field label="Issues / problems" htmlFor="issues">
            <Textarea id="issues" name="issues" rows={2} placeholder="Concrete delivery delayed by 2 hours." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Weather" htmlFor="weather">
              <Input id="weather" name="weather" placeholder="Clear" />
            </Field>
            <Field label="Notes" htmlFor="notes">
              <Input id="notes" name="notes" placeholder="Optional" />
            </Field>
          </div>
          {error && (
            <p role="alert" className="rounded-sm bg-status-critical-bg px-3 py-2 text-xs text-status-critical">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save report"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
