import { z } from "zod";
import { defaultWeights } from "./scoring";

const valuesSchema = z.object({
  ambition: z.coerce.number().min(1).max(5),
  family: z.coerce.number().min(1).max(5),
  adventure: z.coerce.number().min(1).max(5),
  stability: z.coerce.number().min(1).max(5),
  creativity: z.coerce.number().min(1).max(5)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
  age: z.coerce.number().min(18).max(90),
  gender: z.enum(["woman", "man", "nonbinary", "any"]),
  income: z.coerce.number().min(0).max(1000000),
  personality: z.enum(["introvert", "ambivert", "extrovert"]),
  lifestyle: z.enum(["quiet", "balanced", "social"]),
  values: valuesSchema,
  bio: z.string().max(280).default("")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const preferencesSchema = z
  .object({
    ageMin: z.coerce.number().min(18).max(90),
    ageMax: z.coerce.number().min(18).max(90),
    incomeMin: z.coerce.number().min(0).max(1000000),
    incomeMax: z.coerce.number().min(0).max(1000000),
    preferredGender: z.enum(["woman", "man", "nonbinary", "any"]),
    personality: z.enum(["introvert", "ambivert", "extrovert"]),
    lifestyle: z.enum(["quiet", "balanced", "social"]),
    values: valuesSchema,
    weights: z
      .object({
        demographics: z.coerce.number().min(0).max(5),
        income: z.coerce.number().min(0).max(5),
        personality: z.coerce.number().min(0).max(5),
        lifestyle: z.coerce.number().min(0).max(5),
        values: z.coerce.number().min(0).max(5)
      })
      .default(defaultWeights)
  })
  .refine((data) => data.ageMin <= data.ageMax && data.incomeMin <= data.incomeMax, {
    message: "Minimum values must not exceed maximum values."
  });

export const swipeSchema = z.object({
  candidateId: z.coerce.number(),
  decision: z.enum(["like", "pass"]),
  sessionId: z.string().optional()
});

export const messageSchema = z.object({
  matchId: z.coerce.number(),
  body: z.string().min(1).max(1000),
  sessionId: z.string().optional()
});
