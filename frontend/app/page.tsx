import Dashboard from "@/components/dashboard/dashboard";
import { getProjectDashboard } from "@/lib/api";

const PROJECT_ID = "72f0a3ae-ea93-41cd-9d86-963f96523698";

export default async function Home() {
  const data = await getProjectDashboard(PROJECT_ID);

  return <Dashboard data={data} />;
}
