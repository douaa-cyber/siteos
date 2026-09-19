import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getInsights, getSpendingEfficiency } from "@/lib/services/insightsService";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ insights: getInsights(id), spendingEfficiency: getSpendingEfficiency(id) });
}
