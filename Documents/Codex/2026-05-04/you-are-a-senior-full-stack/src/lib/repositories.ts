import { getDb, json } from "./db";
import { buildMismatchMatch, defaultWeights } from "./scoring";
import type { CandidateMatch, PreferenceVector, PublicUser, ValueKey } from "./types";

export function getPreferences(userId: number): PreferenceVector | null {
  const row = getDb().prepare("SELECT * FROM preferences WHERE user_id = ?").get(userId) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  return {
    ageMin: Number(row.age_min),
    ageMax: Number(row.age_max),
    incomeMin: Number(row.income_min),
    incomeMax: Number(row.income_max),
    preferredGender: row.preferred_gender as PreferenceVector["preferredGender"],
    personality: row.personality as PreferenceVector["personality"],
    lifestyle: row.lifestyle as PreferenceVector["lifestyle"],
    values: json<Record<ValueKey, number>>(String(row.values_json)),
    weights: json<PreferenceVector["weights"]>(String(row.weights_json))
  };
}

export function upsertPreferences(userId: number, preferences: PreferenceVector) {
  getDb()
    .prepare(
      `INSERT INTO preferences
      (user_id, age_min, age_max, income_min, income_max, preferred_gender, personality, lifestyle, values_json, weights_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        age_min = excluded.age_min,
        age_max = excluded.age_max,
        income_min = excluded.income_min,
        income_max = excluded.income_max,
        preferred_gender = excluded.preferred_gender,
        personality = excluded.personality,
        lifestyle = excluded.lifestyle,
        values_json = excluded.values_json,
        weights_json = excluded.weights_json,
        updated_at = CURRENT_TIMESTAMP`
    )
    .run(
      userId,
      preferences.ageMin,
      preferences.ageMax,
      preferences.incomeMin,
      preferences.incomeMax,
      preferences.preferredGender,
      preferences.personality,
      preferences.lifestyle,
      JSON.stringify(preferences.values),
      JSON.stringify(preferences.weights ?? defaultWeights)
    );
}

export function listPublicUsersExcept(userId: number): PublicUser[] {
  const rows = getDb()
    .prepare("SELECT id, email, name, age, gender, income, personality, lifestyle, values_json, bio FROM users WHERE id != ?")
    .all(userId) as Record<string, unknown>[];
  return rows.map((row) => ({
    id: Number(row.id),
    email: String(row.email),
    name: String(row.name),
    age: Number(row.age),
    gender: row.gender as PublicUser["gender"],
    income: Number(row.income),
    personality: row.personality as PublicUser["personality"],
    lifestyle: row.lifestyle as PublicUser["lifestyle"],
    values: json<Record<ValueKey, number>>(String(row.values_json)),
    bio: String(row.bio)
  }));
}

export function generateMismatchCandidates(userId: number): CandidateMatch[] {
  const preferences = getPreferences(userId);
  if (!preferences) return [];
  const swipedIds = new Set(
    (
      getDb()
        .prepare("SELECT target_user_id FROM interactions WHERE user_id = ? AND type = 'swipe'")
        .all(userId) as { target_user_id: number }[]
    ).map((row) => row.target_user_id)
  );
  return listPublicUsersExcept(userId)
    .filter((candidate) => !swipedIds.has(candidate.id))
    .map((candidate) => buildMismatchMatch(preferences, candidate))
    .sort((a, b) => b.mismatchScore - a.mismatchScore)
    .slice(0, 10);
}

export function persistShownMatches(userId: number, candidates: CandidateMatch[]) {
  const stmt = getDb().prepare(
    `INSERT INTO matches (user_id, candidate_id, compatibility_score, mismatch_score)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, candidate_id) DO UPDATE SET
       compatibility_score = excluded.compatibility_score,
       mismatch_score = excluded.mismatch_score`
  );
  const transaction = getDb().transaction((items: CandidateMatch[]) => {
    items.forEach((item) => stmt.run(userId, item.user.id, item.compatibilityScore, item.mismatchScore));
  });
  transaction(candidates);
}

export function trackEvent(
  userId: number | null,
  eventName: string,
  payload: Record<string, unknown> = {},
  entityType?: string,
  entityId?: number,
  sessionId?: string | null
) {
  getDb()
    .prepare(
      `INSERT INTO analytics_events (user_id, event_name, entity_type, entity_id, payload_json, session_id)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(userId, eventName, entityType ?? null, entityId ?? null, JSON.stringify(payload), sessionId ?? null);
}
