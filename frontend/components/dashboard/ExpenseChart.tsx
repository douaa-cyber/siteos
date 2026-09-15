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
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="text-[1.2rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          Expenses by category
        </h2>

        <span className="text-[13px] text-[#6B6875] [font-family:var(--font-mono)]">
          {formatCompactDA(total)} DA total
        </span>
      </div>

      <div className="space-y-6">
        {expenses.map((item) => {
          const percentage = (item.amount / total) * 100;
          const width = (item.amount / max) * 100;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-baseline justify-between text-[13px]">
                <span className="font-medium text-[#F5F5F7]">
                  {item.category}
                </span>

                <span className="flex items-baseline gap-2.5">
                  <span className="text-[#6B6875] [font-family:var(--font-mono)]">
                    {percentage.toFixed(0)}%
                  </span>

                  <span className="font-semibold text-[#F5F5F7] [font-family:var(--font-mono)]">
                    {formatCompactDA(item.amount)} DA
                  </span>
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${width}%`,
                    background: "linear-gradient(90deg,#22D3EE,#34D399)",
                    boxShadow: "0 0 12px rgba(34,211,238,0.45)",
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
