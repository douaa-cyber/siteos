"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import { categoryLabel } from "@/lib/format";
import { Plus } from "lucide-react";

export function AddExpenseModal({ projectId }: { projectId: string }) {
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
      const res = await fetch(`/api/projects/${projectId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(form.get("amount")),
          category: form.get("category"),
          description: form.get("description"),
          supplier: form.get("supplier") || undefined,
          date: form.get("date"),
          paymentMethod: form.get("paymentMethod"),
          notes: form.get("notes") || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Could not add expense.");
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
        <Plus size={14} /> Add expense
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Add expense">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (DA)" htmlFor="amount" required>
              <Input id="amount" name="amount" type="number" min="1" step="1" required placeholder="150000" />
            </Field>
            <Field label="Category" htmlFor="category" required>
              <Select id="category" name="category" required defaultValue="MATERIALS">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabel(c)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Description" htmlFor="description" required>
            <Input id="description" name="description" required placeholder="Cement bulk order" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Supplier" htmlFor="supplier">
              <Input id="supplier" name="supplier" placeholder="SOMACIM Distribution" />
            </Field>
            <Field label="Date" htmlFor="date" required>
              <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
            </Field>
          </div>
          <Field label="Payment method" htmlFor="paymentMethod" required>
            <Select id="paymentMethod" name="paymentMethod" required defaultValue="BANK_TRANSFER">
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="CHECK">Check</option>
              <option value="CARD">Card</option>
              <option value="OTHER">Other</option>
            </Select>
          </Field>
          <Field label="Notes" htmlFor="notes">
            <Textarea id="notes" name="notes" rows={2} placeholder="Optional notes" />
          </Field>
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
              {loading ? "Saving…" : "Save expense"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
