import { requireSession } from "@/lib/pageAuth";
import { TopBar } from "@/components/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";

export default async function SettingsPage() {
  const user = await requireSession();

  return (
    <>
      <TopBar title="Settings" subtitle="Your account" user={user} />
      <main className="flex-1 p-6">
        <Card className="max-w-lg">
          <CardHeader title="Account" />
          <div className="space-y-3 p-5 pt-2 text-sm">
            <div className="flex justify-between border-b border-border-hair pb-3">
              <span className="text-text-secondary">Name</span>
              <span className="font-medium text-text-primary">{user.name}</span>
            </div>
            <div className="flex justify-between border-b border-border-hair pb-3">
              <span className="text-text-secondary">Email</span>
              <span className="font-medium text-text-primary">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Role</span>
              <span className="font-medium text-text-primary">
                {user.role === "OWNER" ? "Contractor / Owner" : "Site Supervisor"}
              </span>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
