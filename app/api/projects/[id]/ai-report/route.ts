import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { generateAndSaveAIReport, getCachedAIReport } from "@/lib/services/aiReportService";
import { DEMO_TODAY } from "@/lib/data/seed";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => ({}));
  const date = body?.date || DEMO_TODAY;

  const report = await generateAndSaveAIReport(id, date);
  return NextResponse.json(report);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const date = new URL(req.url).searchParams.get("date") || DEMO_TODAY;
  const report = getCachedAIReport(id, date);
  return NextResponse.json({ report: report ?? null });
}
