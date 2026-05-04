import { NextResponse } from "next/server";
import { clearAuthCookie, getCurrentUser } from "@/lib/auth";
import { trackEvent } from "@/lib/repositories";

export async function POST() {
  const user = getCurrentUser();
  if (user) trackEvent(user.id, "logged_out");
  clearAuthCookie();
  return NextResponse.json({ ok: true });
}
