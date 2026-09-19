"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function TopBar({
  title,
  subtitle,
  user,
  actions,
}: {
  title: string;
  subtitle?: string;
  user: { name: string; role: string };
  actions?: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-border-hair bg-surface-card px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <div className="flex items-center gap-3 border-l border-border-hair pl-4">
          <div className="text-right">
            <div className="text-sm font-medium text-text-primary">{user.name}</div>
            <div className="text-xs text-text-secondary">
              {user.role === "OWNER" ? "Contractor / Owner" : "Site Supervisor"}
            </div>
          </div>
          <button
            onClick={logout}
            aria-label="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-sm text-text-secondary hover:bg-surface-page hover:text-text-primary"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
