import { ExpenseByCategory } from "@/types/dashboard";

interface Props {
  expenses: ExpenseByCategory[];
}

function formatCompactDA(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }

  return value.toLocaleString();
}

export default function ExpenseChart({ expenses }: Props) {
  const max = Math.max(...expenses.map((item) => item.amount), 1);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Cost distribution
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
            Expenses by category
          </h2>
        </div>

        <span className="text-sm font-medium text-zinc-400">
          {formatCompactDA(total)} DA
        </span>
      </div>

      <div className="space-y-5">
        {expenses.map((item) => {
          const percentage = (item.amount / total) * 100;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">
                  {item.category}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400">
                    {percentage.toFixed(0)}%
                  </span>

                  <span className="text-sm font-semibold text-zinc-950">
                    {formatCompactDA(item.amount)} DA
                  </span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-700"
                  style={{
                    width: `${(item.amount / max) * 100}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
