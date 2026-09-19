"use client";

import { DashboardData } from "@/types/dashboard";
import ProjectHeader from "./ProjectHeader";
import StatCard from "./StatCard";
import ProjectHealth from "./ProjectHealth";
import AISummaryCard from "./AISummaryCard";
import ExpenseChart from "./ExpenseChart";
import RecentExpenses from "./RecentExpenses";
import AskProjectCard from "../projects/AskProjectCard";

interface Props {
  data: DashboardData;
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
            value={data.financial.budget}
            format="currency"
            description="Approved project budget"
            type="budget"
            delay={0}
          />

          <StatCard
            label="Total spent"
            value={data.financial.spent}
            format="currency"
            description={`${data.financial.budgetConsumed}% of budget consumed`}
            type="spent"
            delay={90}
          />

          <StatCard
            label="Remaining"
            value={data.financial.remaining}
            format="currency"
            description="Available project budget"
            type="remaining"
            delay={180}
          />

          <StatCard
            label="Progress"
            value={data.progress.physical}
            format="percent"
            description="Physical project completion"
            type="progress"
            delay={270}
          />
        </section>

        {/* Main intelligence */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <ProjectHealth progress={data.progress} />

          <AISummaryCard data={data} />
        </section>

        {/* AI assistant */}
        <section className="mt-6">
          <AskProjectCard data={data} />
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
