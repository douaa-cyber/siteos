import { DEMO_TODAY } from "@/lib/data/seed";
import { ReportViewer } from "./ReportViewer";

export default async function ProjectReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReportViewer projectId={id} date={DEMO_TODAY} />;
}
