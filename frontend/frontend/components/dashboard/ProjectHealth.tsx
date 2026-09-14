import { AlertTriangle, CheckCircle } from "@/components/ui/Icons";
import { ProgressSummary } from "@/types/dashboard";

interface Props {
  progress: ProgressSummary;
}

export default function ProjectHealth({ progress }: Props) {
  const healthy = progress.gap <= 5;

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Project health
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
            Budget vs. physical progress
          </h2>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
            healthy
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {healthy ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}

          {healthy ? "On track" : "Needs attention"}
        </div>
      </div>

      <div className="space-y-7">
        {/* Financial */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-zinc-700">Budget consumed</span>

            <span className="font-semibold text-zinc-950">
              {progress.financial}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-950 transition-all duration-700"
              style={{
                width: `${Math.min(progress.financial, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Physical */}
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-zinc-700">Physical progress</span>

            <span className="font-semibold text-zinc-950">
              {progress.physical}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-300 transition-all duration-700"
              style={{
                width: `${Math.min(progress.physical, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-5">
        <span className="text-sm text-zinc-500">Financial / physical gap</span>

        <span
          className={`text-lg font-semibold ${
            progress.gap > 5 ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {progress.gap > 0 ? "+" : ""}
          {progress.gap}%
        </span>
      </div>
    </div>
  );
}
