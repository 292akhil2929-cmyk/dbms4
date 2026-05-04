import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { trackEvent, upsertPreferences } from "@/lib/repositories";
import { preferencesSchema } from "@/lib/validators";

export async function PUT(request: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = preferencesSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  upsertPreferences(user.id, parsed.data);
  trackEvent(user.id, "preferences_updated", parsed.data, "user", user.id);
  return NextResponse.json({ ok: true });
}
