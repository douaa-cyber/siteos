import { NextResponse } from "next/server";
import { requireProjectAccess } from "@/lib/apiAuth";
import { getExpenses, addExpense } from "@/lib/services/expenseService";
import { EXPENSE_CATEGORIES } from "@/lib/types";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ expenses: getExpenses(id) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await requireProjectAccess(id);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => null);
  const amount = Number(body?.amount);
  const category = body?.category;
  const description = body?.description?.trim();
  const date = body?.date;
  const paymentMethod = body?.paymentMethod;

  if (!amount || amount <= 0) return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  if (!EXPENSE_CATEGORIES.includes(category)) return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Description is required." }, { status: 400 });
  if (!date) return NextResponse.json({ error: "Date is required." }, { status: 400 });
  if (!paymentMethod) return NextResponse.json({ error: "Payment method is required." }, { status: 400 });

  const expense = addExpense({
    projectId: id,
    amount,
    category,
    description,
    supplier: body?.supplier?.trim() || undefined,
    date,
    paymentMethod,
    receiptPhotoUrl: body?.receiptPhotoUrl || undefined,
    notes: body?.notes?.trim() || undefined,
    createdById: auth.user.id,
  });

  return NextResponse.json(expense, { status: 201 });
}
