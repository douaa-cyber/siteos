import Dashboard from "@/components/dashboard/dashboard";
import { getProjectDashboard } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const data = await getProjectDashboard(id);

  return <Dashboard data={data} />;
}
