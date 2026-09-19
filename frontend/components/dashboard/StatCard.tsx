"use client";

import { ArrowUpRight, TrendingUp, Wallet } from "@/components/ui/Icons";
import { useCountUp, useInView } from "./useCountUp";

interface StatCardProps {
  label: string;
  value: number;
  format: "currency" | "percent";
  description: string;
  type: "budget" | "spent" | "remaining" | "progress";
  delay?: number;
}

const themes: Record<
  StatCardProps["type"],
  { colors: [string, string]; glow: string }
> = {
  budget: { colors: ["#818CF8", "#22D3EE"], glow: "rgba(129,140,248,0.35)" },
  spent: { colors: ["#FB923C", "#F43F5E"], glow: "rgba(244,63,94,0.35)" },
  remaining: { colors: ["#22D3EE", "#34D399"], glow: "rgba(34,211,238,0.3)" },
  progress: { colors: ["#A78BFA", "#F472B6"], glow: "rgba(167,139,250,0.35)" },
};

function formatValue(v: number, format: "currency" | "percent") {
  const rounded = Math.round(v);
  return format === "percent"
    ? `${rounded}%`
    : `${rounded.toLocaleString("fr-DZ")} DA`;
}

export default function StatCard({
  label,
  value,
  format,
  description,
  type,
  delay = 0,
}: StatCardProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const animated = useCountUp(value, inView, 1300);

  const icons = {
    budget: <Wallet size={18} strokeWidth={1.7} />,
    spent: <TrendingUp size={18} strokeWidth={1.7} />,
    remaining: <Wallet size={18} strokeWidth={1.7} />,
    progress: <ArrowUpRight size={18} strokeWidth={1.7} />,
  };

  const theme = themes[type];

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transitionProperty:
          "opacity, transform, background-color, border-color",
        transitionDuration: "700ms, 700ms, 300ms, 300ms",
        transitionTimingFunction: "ease",
        transitionDelay: `${delay}ms, ${delay}ms, 0ms, 0ms`,
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
        style={{
          background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
        }}
      />

      <div className="relative mb-8 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${theme.colors[0]}22, ${theme.colors[1]}22)`,
            color: theme.colors[1],
            boxShadow: `0 0 20px ${theme.glow}`,
          }}
        >
          {icons[type]}
        </div>

        <span className="text-[11px] font-medium text-[#6B6875]">{label}</span>
      </div>

      <div className="relative">
        <p className="text-[2rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          {formatValue(animated, format)}
        </p>

        <p className="mt-1.5 text-[13px] text-[#9A97A6]">{description}</p>
      </div>
    </div>
  );
}
