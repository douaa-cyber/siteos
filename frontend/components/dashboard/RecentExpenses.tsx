import { MoreHorizontal, Receipt } from "@/components/ui/Icons";
import { RecentExpense } from "@/types/dashboard";

interface Props {
  expenses: RecentExpense[];
}

function formatDA(value: number) {
  return `${value.toLocaleString("fr-DZ")} DA`;
}

export default function RecentExpenses({ expenses }: Props) {
  console.log("RecentExpenses component rendered with expenses:", expenses);
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 p-7">
        <h2 className="text-[1.2rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          Recent expenses
        </h2>

        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6B6875] transition hover:bg-white/[0.06] hover:text-[#F5F5F7]">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="divide-y divide-white/[0.06]">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="group flex items-center gap-4 px-7 py-4 transition hover:bg-white/[0.03]"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[#22D3EE]"
              style={{
                background: "linear-gradient(135deg,#22D3EE22,#34D39922)",
              }}
            >
              <Receipt size={17} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-[#F5F5F7]">
                {expense.description}
              </p>

              <p className="mt-0.5 truncate text-[12px] text-[#6B6875]">
                {expense.category} — {expense.supplier}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[14px] font-semibold text-[#F5F5F7] [font-family:var(--font-mono)]">
                {formatDA(expense.amount)}
              </p>

              <p className="mt-0.5 text-[12px] text-[#6B6875] [font-family:var(--font-mono)]">
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
