import { getExpenses } from "@/lib/services/expenseService";
import { getBudgetBreakdown, getSpendingByCategory } from "@/lib/services/budgetService";
import { formatDA, formatDate, categoryLabel } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { SpendingByCategoryChart } from "@/components/charts/SpendingByCategoryChart";
import { AddExpenseModal } from "./AddExpenseModal";

export default async function ProjectExpensesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const expenses = getExpenses(id);
  const breakdown = getBudgetBreakdown(id);
  const spendingByCategory = getSpendingByCategory(id);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Total expenses" />
          <div className="p-5 pt-2">
            <div className="font-mono-data text-2xl font-semibold text-text-primary">{formatDA(total)}</div>
            <p className="mt-1 text-xs text-text-secondary">{expenses.length} recorded expenses</p>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Spending by category" />
          <div className="px-2 pb-2">
            <SpendingByCategoryChart data={spendingByCategory} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Budget vs actual" subtitle="Planned vs spent, by category" />
        <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
          {breakdown.map((line) => {
            const over = line.variancePercent >= 10;
            const critical = line.variancePercent >= 25;
            return (
              <div key={line.category} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{categoryLabel(line.category)}</p>
                  <p className="font-mono-data text-xs text-text-secondary">
                    {formatDA(line.actual)} / {formatDA(line.planned)}
                  </p>
                </div>
                {over && (
                  <StatusPill status={critical ? "critical" : "warning"}>
                    {Math.round(line.variancePercent)}% over
                  </StatusPill>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Recent expenses" action={<AddExpenseModal projectId={id} />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-hair text-left text-xs text-text-secondary">
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 font-medium">Category</th>
                <th className="px-5 py-2.5 font-medium">Description</th>
                <th className="px-5 py-2.5 font-medium">Supplier</th>
                <th className="px-5 py-2.5 font-medium">Payment</th>
                <th className="px-5 py-2.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hair">
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-5 py-3 text-text-secondary">{formatDate(e.date)}</td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <StatusPill status="neutral">{categoryLabel(e.category)}</StatusPill>
                  </td>
                  <td className="px-5 py-3 text-text-primary">{e.description}</td>
                  <td className="px-5 py-3 text-text-secondary">{e.supplier ?? "—"}</td>
                  <td className="px-5 py-3 text-text-secondary">{e.paymentMethod.replace("_", " ").toLowerCase()}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-mono-data font-medium text-text-primary">
                    {formatDA(e.amount)}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-secondary">
                    No expenses recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
