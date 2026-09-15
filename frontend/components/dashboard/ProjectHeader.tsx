import { MapPin } from "@/components/ui/Icons";
import { DashboardProject } from "@/types/dashboard";

interface Props {
  project: DashboardProject;
}

function RingProgress({
  value,
  size = 128,
  strokeWidth = 10,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="headerRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A78BFA" />
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
          stroke="url(#headerRing)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: "drop-shadow(0 0 14px rgba(34,211,238,0.45))",
            transition: "stroke-dashoffset 700ms ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[1.6rem] font-semibold text-[#F5F5F7] [font-family:var(--font-mono)]">
          {Math.round(pct)}%
        </span>
      </div>
    </div>
  );
}

export default function ProjectHeader({ project }: Props) {
  const start = new Date(project.startDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const end = new Date(project.expectedEndDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl sm:p-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#A78BFA] opacity-[0.15] blur-[100px]" />

      <div className="relative flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium text-white shadow-[0_0_20px_rgba(34,211,238,0.35)]"
              style={{ background: "linear-gradient(135deg,#22D3EE,#34D399)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {project.status}
            </span>

            <span className="text-[12px] text-[#6B6875] [font-family:var(--font-mono)]">
              Project #{project.id.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-[2.75rem] font-semibold leading-[1.02] tracking-tight text-[#F5F5F7] sm:text-[3.6rem] [font-family:var(--font-display)]">
            {project.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-[#9A97A6]">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {project.location}
            </span>

            <span className="text-[#3A3742]">/</span>

            <span>{project.clientName}</span>
          </div>

          <p className="mt-5 text-[13px] text-[#6B6875] [font-family:var(--font-mono)]">
            {start} — {end}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2">
          <RingProgress value={project.progress} />
          <span className="text-[13px] text-[#9A97A6]">Physical progress</span>
        </div>
      </div>
    </section>
  );
}
