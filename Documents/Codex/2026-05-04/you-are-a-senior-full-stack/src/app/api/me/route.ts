import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPreferences } from "@/lib/repositories";

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user, preferences: getPreferences(user.id) });
}
