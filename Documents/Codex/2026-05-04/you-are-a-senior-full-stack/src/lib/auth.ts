import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getDb, json } from "./db";
import type { PublicUser, ValueKey } from "./types";

const cookieName = "blunder_token";
const jwtSecret = process.env.JWT_SECRET ?? "dev-only-change-me";

type JwtPayload = { userId: number };

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createToken(userId: number) {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

export function setAuthCookie(token: string) {
  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().delete(cookieName);
}

export function getCurrentUser(): PublicUser | null {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;
    return findPublicUser(payload.userId);
  } catch {
    return null;
  }
}

export function findPublicUser(userId: number): PublicUser | null {
  const row = getDb()
    .prepare(
      "SELECT id, email, name, age, gender, income, personality, lifestyle, values_json, bio FROM users WHERE id = ?"
    )
    .get(userId) as Record<string, unknown> | undefined;
  if (!row) return null;
  return {
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
  };
}
