"use client";

import { useState } from "react";
import { createProject } from "@/lib/api";
import { ProjectSummary } from "@/types/dashboard";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (project: ProjectSummary) => void;
}

export default function NewProjectModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    clientName: "",
    budget: "",
    startDate: "",
    expectedEndDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const project = await createProject({
        name: form.name,
        location: form.location,
        clientName: form.clientName,
        budget: Number(form.budget),
        startDate: form.startDate,
        expectedEndDate: form.expectedEndDate,
      });
      onCreated(project);
      onClose();
      setForm({
        name: "",
        location: "",
        clientName: "",
        budget: "",
        startDate: "",
        expectedEndDate: "",
      });
    } catch {
      setError("Couldn't create the project. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E16] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] opacity-[0.15] blur-3xl" />

        <h2 className="relative text-[1.4rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          New project
        </h2>
        <p className="relative mt-1 text-[13px] text-[#9A97A6]">
          Add a new construction site to track.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
          <Field
            label="Project name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            required
          />
          <Field
            label="Location"
            value={form.location}
            onChange={(v) => setForm((f) => ({ ...f, location: v }))}
            required
          />
          <Field
            label="Client"
            value={form.clientName}
            onChange={(v) => setForm((f) => ({ ...f, clientName: v }))}
            required
          />
          <Field
            label="Budget (DA)"
            type="number"
            value={form.budget}
            onChange={(v) => setForm((f) => ({ ...f, budget: v }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Start date"
              type="date"
              value={form.startDate}
              onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
              required
            />
            <Field
              label="Expected end"
              type="date"
              value={form.expectedEndDate}
              onChange={(v) => setForm((f) => ({ ...f, expectedEndDate: v }))}
              required
            />
          </div>

          {error && <p className="text-[13px] text-[#FB923C]">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-[#9A97A6] transition hover:text-[#F5F5F7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full px-5 py-2 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#22D3EE,#A78BFA)" }}
            >
              {submitting ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#9A97A6]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-[#F5F5F7] outline-none transition focus:border-[#22D3EE]/50 focus:bg-white/[0.06] [color-scheme:dark]"
      />
    </label>
  );
}
