import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { generateReport, type ReportType } from "@/lib/services/reportGenerationService";
import { DEMO_TODAY } from "@/lib/data/seed";

const VALID: ReportType[] = ["health", "daily", "weekly", "expense", "material"];

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const url = new URL(req.url);
  const type = url.searchParams.get("type") as ReportType;
  const date = url.searchParams.get("date") || DEMO_TODAY;

  if (!VALID.includes(type)) return NextResponse.json({ error: "Invalid report type." }, { status: 400 });

  const content = generateReport(id, type, date);
  return NextResponse.json({ content });
}
