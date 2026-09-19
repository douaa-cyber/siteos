import { cn } from "@/lib/cn";

export type Status = "good" | "warning" | "critical" | "neutral";

const STYLES: Record<Status, string> = {
  good: "bg-status-good-bg text-status-good",
  warning: "bg-status-warning-bg text-status-warning",
  critical: "bg-status-critical-bg text-status-critical",
  neutral: "bg-status-neutral-bg text-status-neutral",
};

export function StatusPill({
  status,
  children,
  className,
}: {
  status: Status;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium",
        STYLES[status],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusDotColor(status: Status): string {
  return {
    good: "bg-status-good",
    warning: "bg-status-warning",
    critical: "bg-status-critical",
    neutral: "bg-status-neutral",
  }[status];
}
