import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { recordMaterialTransaction, getMaterialTransactions } from "@/lib/services/materialService";
import { getDB } from "@/lib/data/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  const { id, materialId } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ transactions: getMaterialTransactions(materialId) });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  const { id, materialId } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const material = getDB().materials.find((m) => m.id === materialId && m.projectId === id);
  if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const type = body?.type;
  const quantity = Number(body?.quantity);
  const date = body?.date ?? new Date().toISOString();

  if (!["PURCHASE", "CONSUMPTION", "ADJUSTMENT"].includes(type)) {
    return NextResponse.json({ error: "Invalid transaction type." }, { status: 400 });
  }
  if (Number.isNaN(quantity) || quantity < 0) {
    return NextResponse.json({ error: "Quantity must be a valid number." }, { status: 400 });
  }

  const tx = recordMaterialTransaction({ materialId, type, quantity, date, note: body?.note?.trim() || undefined });
  return NextResponse.json(tx, { status: 201 });
}
