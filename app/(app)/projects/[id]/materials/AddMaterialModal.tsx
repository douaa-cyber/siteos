"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const UNITS = ["BAG", "KG", "TON", "M3", "UNIT", "METER", "LITER"];

export function AddMaterialModal({ projectId }: { projectId: string }) {
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
      const res = await fetch(`/api/projects/${projectId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          unit: form.get("unit"),
          currentStock: Number(form.get("currentStock")),
          minStock: Number(form.get("minStock")),
          avgDailyUsage: Number(form.get("avgDailyUsage") || 0),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not add material.");
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
        <Plus size={14} /> Add material
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add material">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Material name" htmlFor="name" required>
              <Input id="name" name="name" required placeholder="Cement" />
            </Field>
            <Field label="Unit" htmlFor="unit" required>
              <Select id="unit" name="unit" required defaultValue="BAG">
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u.toLowerCase()}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Current stock" htmlFor="currentStock" required>
              <Input id="currentStock" name="currentStock" type="number" min="0" required placeholder="120" />
            </Field>
            <Field label="Minimum stock" htmlFor="minStock" required>
              <Input id="minStock" name="minStock" type="number" min="0" required placeholder="100" />
            </Field>
            <Field label="Avg. daily usage" htmlFor="avgDailyUsage">
              <Input id="avgDailyUsage" name="avgDailyUsage" type="number" min="0" placeholder="35" />
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
              {loading ? "Saving…" : "Save material"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
