import { AlertTriangle, CheckCircle } from "@/components/ui/Icons";
import { Insight } from "@/types/dashboard";

interface Props {
  insight: Insight;
}

export default function InsightCard({ insight }: Props) {
  const isSuccess = insight.type === "success";
  const colors: [string, string] = isSuccess
    ? ["#22D3EE", "#34D399"]
    : ["#FB923C", "#F43F5E"];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-3xl"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      />

      <div className="relative">
        <div
          className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}22)`,
            color: colors[1],
            boxShadow: `0 0 20px ${colors[isSuccess ? 1 : 0]}55`,
          }}
        >
          {isSuccess ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        </div>

        <p className="text-[15px] font-medium leading-relaxed text-[#F5F5F7]">
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
