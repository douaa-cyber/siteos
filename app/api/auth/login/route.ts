import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getDB } from "@/lib/data/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = getDB().users.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const session = await getSession();
  session.userId = user.id;
  session.name = user.name;
  session.email = user.email;
  session.role = user.role;
  await session.save();

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
