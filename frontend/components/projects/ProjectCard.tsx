"use client";

import Link from "next/link";
import { MapPin } from "@/components/ui/Icons";
import { ProjectSummary } from "@/types/dashboard";
import { useInView } from "@/components/dashboard/useCountUp";

function formatCompactDA(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "— DA";
  }
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M DA`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K DA`;
  return `${value.toLocaleString()} DA`;
}

export default function ProjectCard({
  project,
  delay = 0,
}: {
  project: ProjectSummary;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLAnchorElement>();

  const budget = project.budget ?? 0;
  const spent = project.spent ?? 0;
  const progress = project.progress ?? 0;
  const consumed = budget > 0 ? (spent / budget) * 100 : 0;

  return (
    <Link
      ref={ref}
      href={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionProperty:
          "opacity, transform, background-color, border-color",
        transitionDuration: "600ms, 600ms, 300ms, 300ms",
        transitionTimingFunction: "ease",
        transitionDelay: `${delay}ms, ${delay}ms, 0ms, 0ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] opacity-[0.12] blur-3xl transition-opacity duration-300 group-hover:opacity-25" />

      <div className="relative mb-6 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-white"
          style={{ background: "linear-gradient(135deg,#22D3EE,#34D399)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {project.status ?? "Unknown"}
        </span>

        <span className="text-[13px] font-semibold text-[#F5F5F7] [font-family:var(--font-mono)]">
          {Math.round(progress)}%
        </span>
      </div>

      <h3 className="text-[1.3rem] font-semibold leading-tight tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
        {project.name ?? "Untitled project"}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[13px] text-[#9A97A6]">
        <MapPin size={13} />
        {project.location ?? "—"}
        <span className="text-[#3A3742]">/</span>
        {project.clientName ?? "—"}
      </div>

      <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(consumed, 100)}%`,
            background: "linear-gradient(90deg,#22D3EE,#34D399)",
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[12px] text-[#6B6875] [font-family:var(--font-mono)]">
        <span>{formatCompactDA(spent)} spent</span>
        <span>{formatCompactDA(budget)} budget</span>
      </div>
    </Link>
  );
}
