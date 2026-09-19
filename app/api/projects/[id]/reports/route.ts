import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getDailyReports, addDailyReport } from "@/lib/services/reportService";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ reports: getDailyReports(id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => null);
  const date = body?.date;
  const workerCount = Number(body?.workerCount);
  const workCompleted = body?.workCompleted?.trim();

  if (!date) return NextResponse.json({ error: "Date is required." }, { status: 400 });
  if (Number.isNaN(workerCount) || workerCount < 0) return NextResponse.json({ error: "Worker count must be a valid number." }, { status: 400 });
  if (!workCompleted) return NextResponse.json({ error: "Work completed description is required." }, { status: 400 });

  const report = addDailyReport({
    projectId: id,
    date,
    workerCount,
    workCompleted,
    materialsReceived: body?.materialsReceived?.trim() || undefined,
    materialsConsumed: body?.materialsConsumed?.trim() || undefined,
    issues: body?.issues?.trim() || undefined,
    weather: body?.weather?.trim() || undefined,
    notes: body?.notes?.trim() || undefined,
    createdById: auth.user.id,
    photoUrls: Array.isArray(body?.photoUrls) ? body.photoUrls : [],
  });

  return NextResponse.json(report, { status: 201 });
}
