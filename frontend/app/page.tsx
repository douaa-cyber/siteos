import ProjectsGrid from "@/components/projects/ProjectsGrid";
import { getProjects } from "@/lib/api";

export default async function Home() {
  const projects = await getProjects();

  return <ProjectsGrid projects={projects} />;
}
