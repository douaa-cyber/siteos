"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function ProjectSubNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;
  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/expenses`, label: "Expenses" },
    { href: `${base}/materials`, label: "Materials" },
    { href: `${base}/daily-reports`, label: "Daily Reports" },
    { href: `${base}/photos`, label: "Photos" },
    { href: `${base}/reports`, label: "Reports" },
  ];

  return (
    <div className="flex gap-1 border-b border-border-hair bg-surface-card px-6">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              active
                ? "border-brand text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
