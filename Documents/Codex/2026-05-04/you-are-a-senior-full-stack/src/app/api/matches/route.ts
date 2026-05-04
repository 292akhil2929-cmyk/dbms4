import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateMismatchCandidates, persistShownMatches, trackEvent } from "@/lib/repositories";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const candidates = generateMismatchCandidates(user.id);
  persistShownMatches(user.id, candidates);
  trackEvent(user.id, "candidate_batch_viewed", { count: candidates.length });
  return NextResponse.json({ candidates });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { candidateId } = (await request.json()) as { candidateId?: number };
  if (!candidateId) return NextResponse.json({ error: "candidateId is required" }, { status: 400 });
  const match = getDb()
    .prepare("SELECT * FROM matches WHERE user_id = ? AND candidate_id = ?")
    .get(user.id, candidateId) as Record<string, unknown> | undefined;
  if (!match) return NextResponse.json({ error: "Match was not generated." }, { status: 404 });
  return NextResponse.json({ match });
}
