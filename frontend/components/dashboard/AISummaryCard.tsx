"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Sparkles } from "@/components/ui/Icons";
import { DashboardData, Insight } from "@/types/dashboard";
import { useInView } from "./useCountUp";

interface Props {
  data: DashboardData;
}

export default function AISummaryCard({ data }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [insight, setInsight] = useState<Insight>(data.insight);
  const [source, setSource] = useState<"rule" | "ai">("rule");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    setLoading(true);

    fetch("/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: data.project,
        financial: data.financial,
        progress: data.progress,
        expensesByCategory: data.expensesByCategory,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json?.message) return;
        setInsight({
          type: json.tone === "warning" ? "warning" : "success",
          message: json.message,
        });
        setSource("ai");
      })
      .catch(() => {
        // silent fallback — the rule-based insight already showing stays put
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const isSuccess = insight.type === "success";
  const colors: [string, string] = isSuccess
    ? ["#22D3EE", "#34D399"]
    : ["#FB923C", "#F43F5E"];

  return (
    <div
      ref={ref}
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 700ms ease, transform 700ms ease",
        transitionDelay: "120ms",
      }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}22)`,
              color: colors[1],
              boxShadow: `0 0 20px ${colors[isSuccess ? 1 : 0]}55`,
            }}
          >
            {isSuccess ? (
              <CheckCircle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}
          </div>

          {source === "ai" && (
            <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-medium text-[#9A97A6]">
              <Sparkles size={11} />
              AI
            </span>
          )}
        </div>

        <p
          className={`text-[15px] font-medium leading-relaxed text-[#F5F5F7] transition-opacity duration-300 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {insight.message}
        </p>
      </div>

      {!isSuccess && (
        <p className="relative mt-5 border-t border-white/10 pt-4 text-[13px] text-[#9A97A6]">
          Review the largest expense categories before the next reporting
          period.
        </p>
      )}
    </div>
  );
}
