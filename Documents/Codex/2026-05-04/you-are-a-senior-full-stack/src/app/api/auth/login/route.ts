import { NextResponse } from "next/server";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { trackEvent } from "@/lib/repositories";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid login payload." }, { status: 400 });
  const row = getDb()
    .prepare("SELECT id, password_hash FROM users WHERE email = ?")
    .get(parsed.data.email.toLowerCase()) as { id: number; password_hash: string } | undefined;
  if (!row || !(await verifyPassword(parsed.data.password, row.password_hash))) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  trackEvent(row.id, "logged_in");
  setAuthCookie(createToken(row.id));
  return NextResponse.json({ ok: true });
}
