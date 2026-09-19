import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getProject, getTotalSpent } from "@/lib/services/projectService";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const spent = getTotalSpent(id);
  return NextResponse.json({ ...project, spent, remaining: project.totalBudget - spent });
}
