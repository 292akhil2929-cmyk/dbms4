import { hashPassword } from "../src/lib/auth";
import { getDb } from "../src/lib/db";
import { defaultWeights } from "../src/lib/scoring";
import { upsertPreferences } from "../src/lib/repositories";
import type { PublicUser } from "../src/lib/types";

const people: Omit<PublicUser, "id">[] = [
  {
    email: "maya@example.com",
    name: "Maya",
    age: 31,
    gender: "woman",
    income: 78000,
    personality: "introvert",
    lifestyle: "quiet",
    values: { ambition: 4, family: 2, adventure: 2, stability: 5, creativity: 4 },
    bio: "Keeps a small circle, reads contracts too carefully, and likes dates that end before midnight."
  },
  {
    email: "leo@example.com",
    name: "Leo",
    age: 39,
    gender: "man",
    income: 220000,
    personality: "extrovert",
    lifestyle: "social",
    values: { ambition: 5, family: 1, adventure: 5, stability: 1, creativity: 3 },
    bio: "Travels often, says yes quickly, and treats plans as suggestions."
  },
  {
    email: "sam@example.com",
    name: "Sam",
    age: 27,
    gender: "nonbinary",
    income: 42000,
    personality: "ambivert",
    lifestyle: "balanced",
    values: { ambition: 2, family: 5, adventure: 3, stability: 4, creativity: 5 },
    bio: "Community organizer, weekend cook, and suspicious of people who describe themselves as chill."
  },
  {
    email: "nora@example.com",
    name: "Nora",
    age: 46,
    gender: "woman",
    income: 145000,
    personality: "introvert",
    lifestyle: "quiet",
    values: { ambition: 3, family: 5, adventure: 1, stability: 5, creativity: 2 },
    bio: "Prefers direct talk, early mornings, and a calendar that means what it says."
  },
  {
    email: "amir@example.com",
    name: "Amir",
    age: 34,
    gender: "man",
    income: 95000,
    personality: "extrovert",
    lifestyle: "social",
    values: { ambition: 4, family: 3, adventure: 5, stability: 2, creativity: 5 },
    bio: "Hosts dinners, changes hobbies seasonally, and believes conflict can be useful when handled cleanly."
  }
];

async function seed() {
  const passwordHash = await hashPassword("password123");
  const insert = getDb().prepare(
    `INSERT OR IGNORE INTO users (email, password_hash, name, age, gender, income, personality, lifestyle, values_json, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const person of people) {
    insert.run(
      person.email,
      passwordHash,
      person.name,
      person.age,
      person.gender,
      person.income,
      person.personality,
      person.lifestyle,
      JSON.stringify(person.values),
      person.bio
    );
    const row = getDb().prepare("SELECT id FROM users WHERE email = ?").get(person.email) as { id: number };
    upsertPreferences(row.id, {
      ageMin: 25,
      ageMax: 42,
      incomeMin: 60000,
      incomeMax: 160000,
      preferredGender: "any",
      personality: "ambivert",
      lifestyle: "balanced",
      values: person.values,
      weights: defaultWeights
    });
  }
  console.log("Seeded users. Login password for seed users: password123");
}

seed();
