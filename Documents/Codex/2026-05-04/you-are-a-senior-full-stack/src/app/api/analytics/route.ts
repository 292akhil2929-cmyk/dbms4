import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb, json } from "@/lib/db";
import { getPreferences, trackEvent } from "@/lib/repositories";
import type { PublicUser, ValueKey } from "@/lib/types";

const valueKeys: ValueKey[] = ["ambition", "family", "adventure", "stability", "creativity"];

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const preferences = getPreferences(user.id);
  const interactions = getDb()
    .prepare(
      `SELECT i.type, i.payload_json, m.compatibility_score, m.mismatch_score,
        u.age, u.gender, u.income, u.personality, u.lifestyle, u.values_json
       FROM interactions i
       LEFT JOIN matches m ON m.id = i.match_id
       LEFT JOIN users u ON u.id = i.target_user_id
       WHERE i.user_id = ?
       ORDER BY i.created_at DESC`
    )
    .all(user.id) as Record<string, unknown>[];

  const swipes = interactions.filter((row) => row.type === "swipe");
  const likes = swipes.filter((row) => json<{ decision?: string }>(String(row.payload_json)).decision === "like");
  const messages = interactions.filter((row) => row.type === "message_sent");
  const engaged = interactions.filter((row) => row.type === "message_sent" || json<{ decision?: string }>(String(row.payload_json)).decision === "like");
  const engagedUsers = engaged.filter((row) => row.values_json);

  const avg = (items: number[]) => (items.length ? items.reduce((sum, item) => sum + item, 0) / items.length : 0);
  const actualValues = Object.fromEntries(
    valueKeys.map((key) => [
      key,
      Number(avg(engagedUsers.map((row) => json<PublicUser["values"]>(String(row.values_json))[key])).toFixed(2))
    ])
  );

  trackEvent(user.id, "dashboard_viewed");

  return NextResponse.json({
    stated: preferences,
    observed: {
      swipeCount: swipes.length,
      likeCount: likes.length,
      messageCount: messages.length,
      responseRateProxy: swipes.length ? Number((likes.length / swipes.length).toFixed(2)) : 0,
      averageEngagedCompatibility: Number(avg(engagedUsers.map((row) => Number(row.compatibility_score))).toFixed(3)),
      averageEngagedMismatch: Number(avg(engagedUsers.map((row) => Number(row.mismatch_score))).toFixed(3)),
      averageEngagedIncome: Math.round(avg(engagedUsers.map((row) => Number(row.income)))),
      actualValues
    }
  });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  const body = (await request.json()) as {
    eventName?: string;
    payload?: Record<string, unknown>;
    sessionId?: string;
  };
  if (!body.eventName) return NextResponse.json({ error: "eventName is required" }, { status: 400 });
  trackEvent(user?.id ?? null, body.eventName, body.payload ?? {}, undefined, undefined, body.sessionId);
  return NextResponse.json({ ok: true });
}
