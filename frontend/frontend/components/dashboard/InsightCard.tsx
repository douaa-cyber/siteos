import { AlertTriangle, CheckCircle } from "@/components/ui/Icons";
import { Insight } from "@/types/dashboard";

interface Props {
  insight: Insight;
}

export default function InsightCard({ insight }: Props) {
  const isSuccess = insight.type === "success";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="relative flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            isSuccess
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {isSuccess ? <CheckCircle size={21} /> : <AlertTriangle size={21} />}
        </div>

        <div>
          <p
            className={`text-xs font-bold uppercase tracking-[0.18em] ${
              isSuccess ? "text-emerald-700" : "text-amber-700"
            }`}
          >
            SiteOS insight
          </p>

          <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-zinc-800">
            {insight.message}
          </p>

          {!isSuccess && (
            <p className="mt-3 text-xs text-zinc-500">
              Review the largest expense categories before the next reporting
              period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
