import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getMaterials, addMaterial } from "@/lib/services/materialService";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ materials: getMaterials(id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();
  const unit = body?.unit;
  const currentStock = Number(body?.currentStock);
  const minStock = Number(body?.minStock);
  const avgDailyUsage = Number(body?.avgDailyUsage ?? 0);

  if (!name) return NextResponse.json({ error: "Material name is required." }, { status: 400 });
  if (!unit) return NextResponse.json({ error: "Unit is required." }, { status: 400 });
  if (Number.isNaN(currentStock) || currentStock < 0) return NextResponse.json({ error: "Current stock must be a valid number." }, { status: 400 });
  if (Number.isNaN(minStock) || minStock < 0) return NextResponse.json({ error: "Minimum stock must be a valid number." }, { status: 400 });

  const material = addMaterial({ projectId: id, name, unit, currentStock, minStock, avgDailyUsage });
  return NextResponse.json(material, { status: 201 });
}
