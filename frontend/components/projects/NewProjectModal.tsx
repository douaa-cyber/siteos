"use client";

import { useState } from "react";
import { createProject } from "@/lib/api";
import { ProjectSummary } from "@/types/dashboard";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (project: ProjectSummary) => void;
}

type Step = 1 | 2 | 3;

interface CategoryForm {
  name: string;
}

interface ExpenseForm {
  categoryName: string;
  description: string;
  amount: string;
  supplier: string;
  paymentMethod: string;
  date: string;
  notes: string;
}

const DEFAULT_CATEGORIES = [
  "Materials",
  "Labor",
  "Transport",
  "Equipment",
  "Subcontracting",
  "Other",
];

const EMPTY_EXPENSE: ExpenseForm = {
  categoryName: "Materials",
  description: "",
  amount: "",
  supplier: "",
  paymentMethod: "Bank Transfer",
  date: "",
  notes: "",
};

export default function NewProjectModal({ open, onClose, onCreated }: Props) {
  const [step, setStep] = useState<Step>(1);

  const [form, setForm] = useState({
    name: "",
    location: "",
    clientName: "",
    budget: "",
    startDate: "",
    expectedEndDate: "",
  });

  const [categories, setCategories] = useState<CategoryForm[]>(
    DEFAULT_CATEGORIES.map((name) => ({ name })),
  );

  const [newCategory, setNewCategory] = useState("");

  const [expenses, setExpenses] = useState<ExpenseForm[]>([]);

  const [expenseForm, setExpenseForm] = useState<ExpenseForm>(EMPTY_EXPENSE);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function resetForm() {
    setStep(1);

    setForm({
      name: "",
      location: "",
      clientName: "",
      budget: "",
      startDate: "",
      expectedEndDate: "",
    });

    setCategories(DEFAULT_CATEGORIES.map((name) => ({ name })));

    setNewCategory("");
    setExpenses([]);
    setExpenseForm(EMPTY_EXPENSE);
    setError(null);
  }

  function close() {
    if (submitting) return;

    resetForm();
    onClose();
  }

  function nextStep() {
    setError(null);

    if (step === 1) {
      if (
        !form.name.trim() ||
        !form.location.trim() ||
        !form.clientName.trim() ||
        !form.budget ||
        !form.startDate ||
        !form.expectedEndDate
      ) {
        setError("Please complete all project fields.");
        return;
      }

      if (Number(form.budget) <= 0) {
        setError("Budget must be greater than 0.");
        return;
      }

      if (new Date(form.expectedEndDate) <= new Date(form.startDate)) {
        setError("Expected end date must be after the start date.");
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (categories.length === 0) {
        setError("Add at least one category.");
        return;
      }

      if (categories.some((category) => !category.name.trim())) {
        setError("Category names cannot be empty.");
        return;
      }

      setStep(3);
    }
  }

  function previousStep() {
    setError(null);

    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }

  function addCategory() {
    const name = newCategory.trim();

    if (!name) return;

    const exists = categories.some(
      (category) => category.name.toLowerCase() === name.toLowerCase(),
    );

    if (exists) {
      setError("This category already exists.");
      return;
    }

    setCategories((prev) => [...prev, { name }]);
    setNewCategory("");
    setError(null);
  }

  function removeCategory(index: number) {
    const category = categories[index];

    const isUsed = expenses.some(
      (expense) =>
        expense.categoryName.toLowerCase() === category.name.toLowerCase(),
    );

    if (isUsed) {
      setError("You cannot remove a category used by an expense.");
      return;
    }

    setCategories((prev) => prev.filter((_, i) => i !== index));
  }

  function addExpense() {
    if (
      !expenseForm.description.trim() ||
      !expenseForm.amount ||
      !expenseForm.supplier.trim() ||
      !expenseForm.paymentMethod ||
      !expenseForm.date
    ) {
      setError("Complete all expense fields.");
      return;
    }

    if (Number(expenseForm.amount) <= 0) {
      setError("Expense amount must be greater than 0.");
      return;
    }

    setExpenses((prev) => [
      ...prev,
      {
        ...expenseForm,
        description: expenseForm.description.trim(),
        supplier: expenseForm.supplier.trim(),
        notes: expenseForm.notes.trim(),
      },
    ]);

    setExpenseForm({
      ...EMPTY_EXPENSE,
      categoryName: categories[0]?.name ?? "Materials",
      date: form.startDate,
    });

    setError(null);
  }

  function removeExpense(index: number) {
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const project = await createProject({
        name: form.name.trim(),
        location: form.location.trim(),
        clientName: form.clientName.trim(),
        budget: Number(form.budget),
        startDate: form.startDate,
        expectedEndDate: form.expectedEndDate,

        categories: categories.map((category) => ({
          name: category.name.trim(),
        })),

        expenses: expenses.map((expense) => ({
          categoryName: expense.categoryName,
          description: expense.description,
          amount: Number(expense.amount),
          supplier: expense.supplier,
          paymentMethod: expense.paymentMethod,
          date: expense.date,
          notes: expense.notes || undefined,
        })),
      });

      onCreated(project);
      close();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Couldn't create the project. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const totalInitialExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0E0E16] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] opacity-[0.15] blur-3xl" />

        {/* Header */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[1.4rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
                New project
              </h2>

              <p className="mt-1 text-[13px] text-[#9A97A6]">
                Set up your construction site.
              </p>
            </div>

            <span className="text-[12px] text-[#6B6875] [font-family:var(--font-mono)]">
              STEP {step}/3
            </span>
          </div>

          {/* Progress */}
          <div className="mt-6 flex gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full transition ${
                  item <= step
                    ? "bg-gradient-to-r from-[#22D3EE] to-[#A78BFA]"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="relative mt-7 space-y-4">
            <Field
              label="Project name"
              value={form.name}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  name: v,
                }))
              }
              required
            />

            <Field
              label="Location"
              value={form.location}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  location: v,
                }))
              }
              required
            />

            <Field
              label="Client"
              value={form.clientName}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  clientName: v,
                }))
              }
              required
            />

            <Field
              label="Budget (DA)"
              type="number"
              value={form.budget}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  budget: v,
                }))
              }
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    startDate: v,
                  }))
                }
                required
              />

              <Field
                label="Expected end"
                type="date"
                value={form.expectedEndDate}
                onChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    expectedEndDate: v,
                  }))
                }
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="relative mt-7">
            <div className="mb-4">
              <h3 className="text-[15px] font-medium text-[#F5F5F7]">
                Project categories
              </h3>

              <p className="mt-1 text-[13px] text-[#6B6875]">
                These categories will be used to organize your expenses.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category, index) => (
                <div
                  key={`${category.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#22D3EE]/10 text-[#22D3EE]">
                      ✓
                    </div>

                    <span className="text-[13px] text-[#F5F5F7]">
                      {category.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="text-[12px] text-[#6B6875] transition hover:text-[#FB7185]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                placeholder="New category..."
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-[#F5F5F7] outline-none placeholder:text-[#6B6875] focus:border-[#22D3EE]/50"
              />

              <button
                type="button"
                onClick={addCategory}
                className="rounded-xl border border-white/10 px-4 text-[13px] text-[#9A97A6] transition hover:bg-white/[0.06] hover:text-white"
              >
                + Add
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="relative mt-7">
            <div className="mb-5">
              <h3 className="text-[15px] font-medium text-[#F5F5F7]">
                Initial expenses
              </h3>

              <p className="mt-1 text-[13px] text-[#6B6875]">
                Optional. Add expenses already incurred on this project.
              </p>
            </div>

            {/* Existing expenses */}
            {expenses.length > 0 && (
              <div className="mb-5 space-y-2">
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-medium text-[#F5F5F7]">
                          {expense.description}
                        </span>

                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-[#9A97A6]">
                          {expense.categoryName}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-[#6B6875]">
                        {expense.supplier}
                      </p>
                    </div>

                    <div className="ml-4 flex shrink-0 items-center gap-3">
                      <span className="text-[13px] font-medium text-[#F5F5F7]">
                        {Number(expense.amount).toLocaleString("fr-DZ")} DA
                      </span>

                      <button
                        type="button"
                        onClick={() => removeExpense(index)}
                        className="text-[#6B6875] hover:text-[#FB7185]"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2 text-[12px] text-[#9A97A6]">
                  Initial expenses:{" "}
                  <span className="ml-1 text-[#F5F5F7]">
                    {totalInitialExpenses.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              </div>
            )}

            {/* Add expense */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Category"
                  value={expenseForm.categoryName}
                  options={categories.map((category) => category.name)}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      categoryName: v,
                    }))
                  }
                />

                <Field
                  label="Amount (DA)"
                  type="number"
                  value={expenseForm.amount}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      amount: v,
                    }))
                  }
                />
              </div>

              <div className="mt-3">
                <Field
                  label="Description"
                  value={expenseForm.description}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      description: v,
                    }))
                  }
                />
              </div>

              <div className="mt-3">
                <Field
                  label="Supplier"
                  value={expenseForm.supplier}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      supplier: v,
                    }))
                  }
                />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SelectField
                  label="Payment method"
                  value={expenseForm.paymentMethod}
                  options={["Bank Transfer", "Cash", "Check", "Card"]}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      paymentMethod: v,
                    }))
                  }
                />

                <Field
                  label="Date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      date: v,
                    }))
                  }
                />
              </div>

              <div className="mt-3">
                <Field
                  label="Notes"
                  value={expenseForm.notes}
                  onChange={(v) =>
                    setExpenseForm((f) => ({
                      ...f,
                      notes: v,
                    }))
                  }
                />
              </div>

              <button
                type="button"
                onClick={addExpense}
                className="mt-4 rounded-xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 px-4 py-2.5 text-[13px] font-medium text-[#22D3EE] transition hover:bg-[#22D3EE]/10"
              >
                + Add expense
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="relative mt-4 text-[13px] text-[#FB923C]">{error}</p>
        )}

        {/* Footer */}
        <div className="relative mt-7 flex items-center justify-between border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={step === 1 ? close : previousStep}
            disabled={submitting}
            className="rounded-full px-4 py-2 text-[13px] font-medium text-[#9A97A6] transition hover:text-[#F5F5F7] disabled:opacity-50"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg,#22D3EE,#A78BFA)",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-full px-5 py-2.5 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(34,211,238,0.35)] transition-transform hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg,#22D3EE,#A78BFA)",
              }}
            >
              {submitting ? "Creating…" : "Create project"}
            </button>
          )}
        </div>
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

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#9A97A6]">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-[#F5F5F7] outline-none transition focus:border-[#22D3EE]/50 [color-scheme:dark]"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0E0E16]">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
