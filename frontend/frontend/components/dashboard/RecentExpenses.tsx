import { MoreHorizontal, Receipt } from "@/components/ui/Icons";
import { RecentExpense } from "@/types/dashboard";

interface Props {
  expenses: RecentExpense[];
}

function formatDA(value: number) {
  return `${value.toLocaleString("fr-DZ")} DA`;
}

export default function RecentExpenses({ expenses }: Props) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Activity
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
            Recent expenses
          </h2>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="divide-y divide-zinc-100">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="group flex items-center gap-4 px-6 py-4 transition hover:bg-zinc-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
              <Receipt size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {expense.description}
              </p>

              <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-400">
                <span>{expense.category}</span>
                <span>•</span>
                <span>{expense.supplier}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-zinc-950">
                {formatDA(expense.amount)}
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                {new Date(expense.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
