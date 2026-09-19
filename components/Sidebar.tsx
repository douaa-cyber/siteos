"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Building2,
  Receipt,
  Boxes,
  FileText,
  AlertTriangle,
  Settings,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Building2 },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/materials", label: "Materials", icon: Boxes },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-surface-ink text-text-inverse md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand font-mono-data text-xs font-semibold">
          S
        </div>
        <span className="text-sm font-semibold tracking-tight">SiteOS</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-surface-ink-2 text-text-inverse font-medium"
                  : "text-text-inverse-muted hover:bg-surface-ink-2 hover:text-text-inverse"
              )}
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border-hair-dark px-5 py-4 text-xs text-text-inverse-muted">
        SiteOS MVP · v0.1
      </div>
    </aside>
  );
}
