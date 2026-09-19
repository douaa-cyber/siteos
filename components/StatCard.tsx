import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warning" | "critical" | "brand";
  hint?: string;
}) {
  const toneClass = {
    neutral: "text-text-primary",
    good: "text-status-good",
    warning: "text-status-warning",
    critical: "text-status-critical",
    brand: "text-brand",
  }[tone];

  return (
    <div className="rounded-md border border-border-hair bg-surface-card px-5 py-4">
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className={cn("mt-1.5 font-mono-data text-2xl font-semibold leading-none", toneClass)}>
        {value}
      </div>
      {hint && <div className="mt-1.5 text-xs text-text-secondary">{hint}</div>}
    </div>
  );
}
