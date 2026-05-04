import type { CandidateMatch, Gender, Lifestyle, Personality, PreferenceVector, PublicUser, ValueKey } from "./types";

const personalityIndex: Record<Personality, number> = {
  introvert: 0,
  ambivert: 0.5,
  extrovert: 1
};

const lifestyleIndex: Record<Lifestyle, number> = {
  quiet: 0,
  balanced: 0.5,
  social: 1
};

const valueKeys: ValueKey[] = ["ambition", "family", "adventure", "stability", "creativity"];

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function rangeScore(value: number, min: number, max: number, tolerance: number) {
  if (value >= min && value <= max) return 1;
  const distance = value < min ? min - value : value - max;
  return clamp01(1 - distance / tolerance);
}

function categoricalScore(actual: Gender, preferred: Gender) {
  if (preferred === "any") return 1;
  return actual === preferred ? 1 : 0;
}

function axisScore<T extends string>(actual: T, preferred: T, index: Record<T, number>) {
  return 1 - Math.abs(index[actual] - index[preferred]);
}

function valueSimilarity(preferences: PreferenceVector, user: PublicUser) {
  const totalDistance = valueKeys.reduce((sum, key) => {
    return sum + Math.abs(preferences.values[key] - user.values[key]) / 4;
  }, 0);
  return clamp01(1 - totalDistance / valueKeys.length);
}

export function compatibilityScore(preferences: PreferenceVector, candidate: PublicUser) {
  const weights = preferences.weights;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0) || 1;

  const demographics =
    (rangeScore(candidate.age, preferences.ageMin, preferences.ageMax, 12) +
      categoricalScore(candidate.gender, preferences.preferredGender)) /
    2;
  const income = rangeScore(candidate.income, preferences.incomeMin, preferences.incomeMax, 60000);
  const personality = axisScore(candidate.personality, preferences.personality, personalityIndex);
  const lifestyle = axisScore(candidate.lifestyle, preferences.lifestyle, lifestyleIndex);
  const values = valueSimilarity(preferences, candidate);

  const weighted =
    demographics * weights.demographics +
    income * weights.income +
    personality * weights.personality +
    lifestyle * weights.lifestyle +
    values * weights.values;

  return clamp01(weighted / totalWeight);
}

export function buildMismatchMatch(preferences: PreferenceVector, candidate: PublicUser): CandidateMatch {
  const compatibility = compatibilityScore(preferences, candidate);
  const mismatch = 1 - compatibility;
  return {
    user: candidate,
    compatibilityScore: Number(compatibility.toFixed(3)),
    mismatchScore: Number(mismatch.toFixed(3)),
    reasons: buildReasons(preferences, candidate)
  };
}

function buildReasons(preferences: PreferenceVector, candidate: PublicUser) {
  const reasons: string[] = [];
  if (categoricalScore(candidate.gender, preferences.preferredGender) === 0) {
    reasons.push(`You selected ${preferences.preferredGender}; ${candidate.name} is ${candidate.gender}.`);
  }
  if (candidate.income < preferences.incomeMin || candidate.income > preferences.incomeMax) {
    reasons.push(`Income sits outside your stated range.`);
  }
  if (personalityIndex[candidate.personality] !== personalityIndex[preferences.personality]) {
    reasons.push(`Personality differs from your target.`);
  }
  if (lifestyleIndex[candidate.lifestyle] !== lifestyleIndex[preferences.lifestyle]) {
    reasons.push(`Lifestyle rhythm conflicts with your preference.`);
  }
  const valueGap = valueKeys
    .map((key) => ({ key, gap: Math.abs(preferences.values[key] - candidate.values[key]) }))
    .sort((a, b) => b.gap - a.gap)[0];
  if (valueGap.gap >= 3) reasons.push(`Largest values gap: ${valueGap.key}.`);
  return reasons.slice(0, 3);
}

export const defaultWeights: PreferenceVector["weights"] = {
  demographics: 1,
  income: 1,
  personality: 1,
  lifestyle: 1,
  values: 1.5
};
