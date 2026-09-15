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
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A10]">
      {/* ambient gradient glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#22D3EE] opacity-[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-20 h-[480px] w-[480px] rounded-full bg-[#A78BFA] opacity-[0.10] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#34D399] opacity-[0.06] blur-[140px]" />

      <div className="relative mx-auto max-w-[1400px] px-5 py-8 font-sans sm:px-8 lg:px-12 lg:py-12">
        {/* Header */}
        <ProjectHeader project={data.project} />

        {/* KPI */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <ProjectHealth progress={data.progress} />

          <InsightCard insight={data.insight} />
        </section>

        {/* Analytics */}
        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <ExpenseChart expenses={data.expensesByCategory} />

          <RecentExpenses expenses={data.recentExpenses} />
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-[#6B6875] sm:flex-row">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
            </span>
            Live sync — updated just now
          </span>

          <span>SiteOS · Construction Intelligence</span>
        </footer>
      </div>
    </main>
  );
}