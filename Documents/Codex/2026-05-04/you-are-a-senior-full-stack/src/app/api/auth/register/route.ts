import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createToken, hashPassword, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import { trackEvent, upsertPreferences } from "@/lib/repositories";
import { defaultWeights } from "@/lib/scoring";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const passwordHash = await hashPassword(data.password);
  try {
    const result = getDb()
      .prepare(
        `INSERT INTO users (email, password_hash, name, age, gender, income, personality, lifestyle, values_json, bio)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.email.toLowerCase(),
        passwordHash,
        data.name,
        data.age,
        data.gender,
        data.income,
        data.personality,
        data.lifestyle,
        JSON.stringify(data.values),
        data.bio
      );
    const userId = Number(result.lastInsertRowid);
    upsertPreferences(userId, {
      ageMin: Math.max(18, data.age - 8),
      ageMax: data.age + 8,
      incomeMin: Math.max(0, data.income - 30000),
      incomeMax: data.income + 50000,
      preferredGender: "any",
      personality: data.personality,
      lifestyle: data.lifestyle,
      values: data.values,
      weights: defaultWeights
    });
    trackEvent(userId, "registered", { source: "email" }, "user", userId);
    setAuthCookie(createToken(userId));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
  }
}
