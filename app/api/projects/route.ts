import { NextResponse } from "next/server";
import { requireUser } from "@/lib/apiAuth";
import { listProjectsForUser, getTotalSpent } from "@/lib/services/projectService";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const projects = listProjectsForUser(auth.user.id, auth.user.role).map((p) => {
    const spent = getTotalSpent(p.id);
    return { ...p, spent, remaining: p.totalBudget - spent };
  });

  return NextResponse.json({ projects });
}
