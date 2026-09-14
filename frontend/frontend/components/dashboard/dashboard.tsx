"use client";

import { DashboardData } from "@/types/dashboard";
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatCard";
import ProjectHealth from "./ProjectHealth";
import InsightCard from "./InsightCard";
import ExpenseChart from "./ExpenseChart";
import RecentExpenses from "./RecentExpenses";

interface Props {
  data: DashboardData;
}

function formatDA(value: number) {
  return `${value.toLocaleString("fr-DZ")} DA`;
}

export default function Dashboard({ data }: Props) {
  return (
    <main className="min-h-screen bg-[#f6f6f4]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        {/* Header */}
        <ProjectHeader project={data.project} />

        {/* KPI */}
        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total budget"
            value={formatDA(data.financial.budget)}
            description="Approved project budget"
            type="budget"
          />

          <StatCard
            label="Total spent"
            value={formatDA(data.financial.spent)}
            description={`${data.financial.budgetConsumed}% of budget consumed`}
            type="spent"
          />

          <StatCard
            label="Remaining"
            value={formatDA(data.financial.remaining)}
            description="Available project budget"
            type="remaining"
          />

          <StatCard
            label="Progress"
            value={`${data.progress.physical}%`}
            description="Physical project completion"
            type="progress"
          />
        </section>

        {/* Main intelligence */}
        <section className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <ProjectHealth progress={data.progress} />

          <InsightCard insight={data.insight} />
        </section>

        {/* Analytics */}
        <section className="mt-5 grid gap-5 xl:grid-cols-2">
          <ExpenseChart expenses={data.expensesByCategory} />

          <RecentExpenses expenses={data.recentExpenses} />
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-400 sm:flex-row">
          <span>SiteOS · Construction Intelligence</span>

          <span>Last dashboard calculation · just now</span>
        </footer>
      </div>
    </main>
  );
}
