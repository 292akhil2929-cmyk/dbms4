export type Gender = "woman" | "man" | "nonbinary" | "any";
export type Personality = "introvert" | "ambivert" | "extrovert";
export type Lifestyle = "quiet" | "balanced" | "social";
export type ValueKey = "ambition" | "family" | "adventure" | "stability" | "creativity";
export type SwipeDecision = "like" | "pass";

export type PreferenceVector = {
  ageMin: number;
  ageMax: number;
  incomeMin: number;
  incomeMax: number;
  preferredGender: Gender;
  personality: Personality;
  lifestyle: Lifestyle;
  values: Record<ValueKey, number>;
  weights: {
    demographics: number;
    income: number;
    personality: number;
    lifestyle: number;
    values: number;
  };
};

export type PublicUser = {
  id: number;
  email: string;
  name: string;
  age: number;
  gender: Gender;
  income: number;
  personality: Personality;
  lifestyle: Lifestyle;
  values: Record<ValueKey, number>;
  bio: string;
};

export type CandidateMatch = {
  user: PublicUser;
  compatibilityScore: number;
  mismatchScore: number;
  reasons: string[];
};
