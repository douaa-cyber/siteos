"use client";

import { useEffect, useState } from "react";
import { updateProject } from "@/lib/api";
import { ProjectSummary } from "@/types/dashboard";

interface Props {
  open: boolean;
  project: ProjectSummary | null;
  onClose: () => void;
  onUpdated: (project: ProjectSummary) => void;
}

interface FormState {
  name: string;
  location: string;
  clientName: string;
  budget: string;
  progress: string;
  status: string;
  startDate: string;
  expectedEndDate: string;
}

function formatDateForInput(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function EditProjectModal({
  open,
  project,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    clientName: "",
    budget: "",
    progress: "",
    status: "ACTIVE",
    startDate: "",
    expectedEndDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!project || !open) return;

    setForm({
      name: project.name,
      location: project.location,
      clientName: project.clientName,
      budget: String(project.budget),
      progress: String(project.progress),
      status: project.status,
      startDate: formatDateForInput(project.startDate),
      expectedEndDate: formatDateForInput(project.expectedEndDate),
    });

    setError("");
  }, [project, open]);

  if (!open || !project) {
    return null;
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const budget = Number(form.budget);
    const progress = Number(form.progress);

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }

    if (!form.clientName.trim()) {
      setError("Client name is required.");
      return;
    }

    if (!Number.isFinite(budget) || budget <= 0) {
      setError("Budget must be greater than 0.");
      return;
    }

    if (!Number.isFinite(progress) || progress < 0 || progress > 100) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    if (!form.startDate || !form.expectedEndDate) {
      setError("Both project dates are required.");
      return;
    }

    if (form.expectedEndDate < form.startDate) {
      setError("Expected end date cannot be before the start date.");
      return;
    }

    try {
      setLoading(true);

      const updatedProject = await updateProject(project.id, {
        name: form.name.trim(),
        location: form.location.trim(),
        clientName: form.clientName.trim(),
        budget,
        progress,
        status: form.status,
        startDate: form.startDate,
        expectedEndDate: form.expectedEndDate,
      });

      onUpdated(updatedProject);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update project.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#111118] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#22D3EE] [font-family:var(--font-mono)]">
              Project settings
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#F5F5F7]">
              Edit project
            </h2>

            <p className="mt-1 text-sm text-[#777582]">
              Update project information and physical progress.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-xl text-[#777582] transition hover:bg-white/5 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Project name
                </label>

                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#55535F] focus:border-[#22D3EE]/50"
                  placeholder="Villa Hydra"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                />
              </div>

              {/* Client */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Client
                </label>

                <input
                  value={form.clientName}
                  onChange={(e) => updateField("clientName", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Budget (DA)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={(e) => updateField("budget", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111118] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_HOLD">On hold</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Progress */}
              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-[#9A98A5]">
                    Physical progress
                  </label>

                  <span className="text-sm font-semibold text-[#22D3EE]">
                    {form.progress || 0}%
                  </span>
                </div>

                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={form.progress || 0}
                    onChange={(e) => updateField("progress", e.target.value)}
                    className="flex-1 accent-[#22D3EE]"
                  />

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.progress}
                    onChange={(e) => updateField("progress", e.target.value)}
                    className="w-24 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center text-sm text-white outline-none focus:border-[#22D3EE]/50"
                  />
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, Number(form.progress) || 0),
                      )}%`,
                      background: "linear-gradient(90deg,#22D3EE,#A78BFA)",
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#5F5D68]">
                  This is the manually reported physical completion of the
                  construction work.
                </p>
              </div>

              {/* Dates */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Start date
                </label>

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-[#9A98A5]">
                  Expected end date
                </label>

                <input
                  type="date"
                  value={form.expectedEndDate}
                  onChange={(e) =>
                    updateField("expectedEndDate", e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#22D3EE]/50"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-4 py-2.5 text-sm text-[#8C8995] transition hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(34,211,238,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#22D3EE,#A78BFA)",
              }}
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
