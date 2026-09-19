import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-surface-ink p-12 text-text-inverse lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand font-mono-data text-sm font-semibold">
            S
          </div>
          <span className="text-lg font-semibold tracking-tight">SiteOS</span>
        </div>
        <div>
          <p className="max-w-md text-2xl font-medium leading-snug text-text-inverse">
            Open SiteOS for 30 seconds and know exactly which sites need your attention.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border-hair-dark pt-6 font-mono-data">
            <div>
              <div className="text-xl font-semibold">3</div>
              <div className="text-xs text-text-inverse-muted">Active sites</div>
            </div>
            <div>
              <div className="text-xl font-semibold">18.4M</div>
              <div className="text-xs text-text-inverse-muted">DA tracked</div>
            </div>
            <div>
              <div className="text-xl font-semibold">1</div>
              <div className="text-xs text-text-inverse-muted">Needs attention</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-text-inverse-muted">Site intelligence for contractors.</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-surface-page p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand font-mono-data text-sm font-semibold text-white">
                S
              </div>
              <span className="text-lg font-semibold tracking-tight">SiteOS</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Sign in</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Monitor your construction sites from one place.
          </p>
          <LoginForm />
          <div className="mt-8 rounded-sm border border-border-hair bg-surface-card p-4 text-xs text-text-secondary">
            <p className="mb-2 font-medium text-text-primary">Demo accounts</p>
            <p>Owner — karim@siteos.dz / owner123</p>
            <p>Supervisor — amine@siteos.dz / super123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
