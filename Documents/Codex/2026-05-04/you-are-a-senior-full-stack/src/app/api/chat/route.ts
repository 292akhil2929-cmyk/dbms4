import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { trackEvent } from "@/lib/repositories";
import { messageSchema } from "@/lib/validators";

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const conversations = getDb()
    .prepare(
      `SELECT m.id as match_id, m.candidate_id, m.mismatch_score, u.name, u.bio,
        (SELECT body FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message
       FROM matches m
       JOIN users u ON u.id = m.candidate_id
       WHERE m.user_id = ? AND m.status = 'liked'
       ORDER BY m.created_at DESC`
    )
    .all(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = messageSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const match = getDb()
    .prepare("SELECT id, candidate_id FROM matches WHERE id = ? AND user_id = ? AND status = 'liked'")
    .get(parsed.data.matchId, user.id) as { id: number; candidate_id: number } | undefined;
  if (!match) return NextResponse.json({ error: "Conversation not available." }, { status: 404 });
  getDb().prepare("INSERT INTO messages (match_id, sender_id, body) VALUES (?, ?, ?)").run(match.id, user.id, parsed.data.body);
  getDb()
    .prepare(
      `INSERT INTO interactions (match_id, user_id, target_user_id, type, payload_json)
       VALUES (?, ?, ?, 'message_sent', ?)`
    )
    .run(match.id, user.id, match.candidate_id, JSON.stringify({ length: parsed.data.body.length }));
  trackEvent(user.id, "message_sent", { length: parsed.data.body.length }, "match", match.id, parsed.data.sessionId);
  return NextResponse.json({ ok: true });
}
