import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { trackEvent } from "@/lib/repositories";
import { swipeSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = swipeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { candidateId, decision, sessionId } = parsed.data;
  const match = getDb()
    .prepare("SELECT id FROM matches WHERE user_id = ? AND candidate_id = ?")
    .get(user.id, candidateId) as { id: number } | undefined;
  if (!match) return NextResponse.json({ error: "Unknown match candidate." }, { status: 404 });

  getDb()
    .prepare("UPDATE matches SET status = ? WHERE id = ?")
    .run(decision === "like" ? "liked" : "passed", match.id);
  getDb()
    .prepare(
      `INSERT INTO interactions (match_id, user_id, target_user_id, type, payload_json)
       VALUES (?, ?, ?, 'swipe', ?)`
    )
    .run(match.id, user.id, candidateId, JSON.stringify({ decision }));
  trackEvent(user.id, "swipe", { decision, candidateId }, "match", match.id, sessionId);
  return NextResponse.json({ ok: true });
}
