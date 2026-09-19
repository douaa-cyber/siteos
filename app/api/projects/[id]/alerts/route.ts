import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getAlerts } from "@/lib/services/alertService";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  const includeResolved = new URL(req.url).searchParams.get("all") === "true";
  return NextResponse.json({ alerts: getAlerts(id, includeResolved) });
}
