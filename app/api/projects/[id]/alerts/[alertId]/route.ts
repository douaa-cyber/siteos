import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { resolveAlert } from "@/lib/services/alertService";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string; alertId: string }> }
) {
  const { id, alertId } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  resolveAlert(alertId);
  return NextResponse.json({ ok: true });
}
