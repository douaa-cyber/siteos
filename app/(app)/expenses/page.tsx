import { requireSession } from "@/lib/pageAuth";
import { listProjectsForUser } from "@/lib/services/projectService";
import { getExpenses } from "@/lib/services/expenseService";
import { TopBar } from "@/components/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDA, formatDate, categoryLabel } from "@/lib/format";
import Link from "next/link";

export default async function OrgExpensesPage() {
  const user = await requireSession();
  const projects = listProjectsForUser(user.id, user.role);
  const expenses = projects
    .flatMap((p) => getExpenses(p.id).map((e) => ({ ...e, projectName: p.name })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <TopBar title="Expenses" subtitle={`${formatDA(total)} across ${projects.length} projects`} user={user} />
      <main className="flex-1 p-6">
        <Card>
          <CardHeader title="All expenses" subtitle="Across every project you have access to" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-hair text-left text-xs text-text-secondary">
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium">Project</th>
                  <th className="px-5 py-2.5 font-medium">Category</th>
                  <th className="px-5 py-2.5 font-medium">Description</th>
                  <th className="px-5 py-2.5 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hair">
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="whitespace-nowrap px-5 py-3 text-text-secondary">{formatDate(e.date)}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Link href={`/projects/${e.projectId}`} className="text-brand hover:underline">
                        {e.projectName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <StatusPill status="neutral">{categoryLabel(e.category)}</StatusPill>
                    </td>
                    <td className="px-5 py-3 text-text-primary">{e.description}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right font-mono-data font-medium text-text-primary">
                      {formatDA(e.amount)}
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-secondary">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </>
  );
}
