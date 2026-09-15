import { AlertTriangle, CheckCircle } from "@/components/ui/Icons";
import { ProgressSummary } from "@/types/dashboard";

interface Props {
  progress: ProgressSummary;
}

function RingProgress({
  value,
  size = 96,
  strokeWidth = 8,
  gradientId,
  colors,
  glow,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  colors: [string, string];
  glow: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: `drop-shadow(0 0 8px ${glow})`,
            transition: "stroke-dashoffset 700ms ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold text-[#F5F5F7] [font-family:var(--font-mono)]">
        {Math.round(pct)}%
      </div>
    </div>
  );
}

export default function ProjectHealth({ progress }: Props) {
  const healthy = progress.gap <= 5;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <h2 className="text-[1.2rem] font-semibold tracking-tight text-[#F5F5F7] [font-family:var(--font-display)]">
          Budget vs. physical progress
        </h2>

        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium"
          style={{
            background: healthy
              ? "rgba(52,211,153,0.12)"
              : "rgba(251,146,60,0.12)",
            color: healthy ? "#34D399" : "#FB923C",
          }}
        >
          {healthy ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
          {healthy ? "On track" : "Needs attention"}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-around gap-8">
        <div className="flex flex-col items-center gap-3">
          <RingProgress
            value={progress.financial}
            gradientId="ringFinancial"
            colors={["#818CF8", "#22D3EE"]}
            glow="rgba(129,140,248,0.4)"
          />
          <span className="text-[13px] text-[#9A97A6]">Budget consumed</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <RingProgress
            value={progress.physical}
            gradientId="ringPhysical"
            colors={["#22D3EE", "#34D399"]}
            glow="rgba(34,211,238,0.4)"
          />
          <span className="text-[13px] text-[#9A97A6]">Physical progress</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <span className="text-[13px] text-[#9A97A6]">
          Financial / physical gap
        </span>

        <span
          className="text-[1.15rem] font-semibold [font-family:var(--font-mono)]"
          style={{ color: progress.gap > 5 ? "#FB923C" : "#34D399" }}
        >
          {progress.gap > 0 ? "+" : ""}
          {progress.gap}%
        </span>
      </div>
    </div>
  );
}
