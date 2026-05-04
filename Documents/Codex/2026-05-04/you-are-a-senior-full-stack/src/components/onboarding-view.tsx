"use client";

import { useState } from "react";
import { defaultWeights } from "@/lib/scoring";
import type { PreferenceVector } from "@/lib/types";
import { ValueInputs } from "./auth-view";
import { Button, Field, Input, Panel, Select } from "./ui";

const fallback: PreferenceVector = {
  ageMin: 25,
  ageMax: 45,
  incomeMin: 40000,
  incomeMax: 180000,
  preferredGender: "any",
  personality: "ambivert",
  lifestyle: "balanced",
  values: { ambition: 3, family: 3, adventure: 3, stability: 3, creativity: 3 },
  weights: defaultWeights
};

export function OnboardingView({
  initial,
  onDone
}: {
  initial: PreferenceVector | null;
  mode?: "preferences";
  onDone: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const data = initial ?? fallback;

  async function submit(formData: FormData) {
    setSaved(false);
    setError("");
    const values = Object.fromEntries(formData.entries());
    const payload: PreferenceVector = {
      ageMin: Number(values.ageMin),
      ageMax: Number(values.ageMax),
      incomeMin: Number(values.incomeMin),
      incomeMax: Number(values.incomeMax),
      preferredGender: values.preferredGender as PreferenceVector["preferredGender"],
      personality: values.personality as PreferenceVector["personality"],
      lifestyle: values.lifestyle as PreferenceVector["lifestyle"],
      values: {
        ambition: Number(values.ambition),
        family: Number(values.family),
        adventure: Number(values.adventure),
        stability: Number(values.stability),
        creativity: Number(values.creativity)
      },
      weights: {
        demographics: Number(values.demographics),
        income: Number(values.income),
        personality: Number(values.personalityWeight),
        lifestyle: Number(values.lifestyleWeight),
        values: Number(values.valuesWeight)
      }
    };
    const response = await fetch("/api/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      setError("Those preferences could not be saved. Check ranges and weights.");
      return;
    }
    setSaved(true);
    onDone();
  }

  return (
    <Panel>
      <form action={submit} className="grid max-w-4xl gap-5">
        <div>
          <h2 className="text-lg font-semibold">Stated Preferences</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            These are treated as the user&apos;s stated ideal. The matching engine scores toward these values, then serves the lowest compatibility candidates first.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Minimum age">
            <Input name="ageMin" type="number" min={18} max={90} defaultValue={data.ageMin} />
          </Field>
          <Field label="Maximum age">
            <Input name="ageMax" type="number" min={18} max={90} defaultValue={data.ageMax} />
          </Field>
          <Field label="Minimum income">
            <Input name="incomeMin" type="number" min={0} step={1000} defaultValue={data.incomeMin} />
          </Field>
          <Field label="Maximum income">
            <Input name="incomeMax" type="number" min={0} step={1000} defaultValue={data.incomeMax} />
          </Field>
          <Field label="Preferred gender">
            <Select name="preferredGender" defaultValue={data.preferredGender}>
              <option value="any">Any</option>
              <option value="woman">Woman</option>
              <option value="man">Man</option>
              <option value="nonbinary">Non-binary</option>
            </Select>
          </Field>
          <Field label="Preferred personality">
            <Select name="personality" defaultValue={data.personality}>
              <option value="introvert">Introvert</option>
              <option value="ambivert">Ambivert</option>
              <option value="extrovert">Extrovert</option>
            </Select>
          </Field>
          <Field label="Preferred lifestyle">
            <Select name="lifestyle" defaultValue={data.lifestyle}>
              <option value="quiet">Quiet</option>
              <option value="balanced">Balanced</option>
              <option value="social">Social</option>
            </Select>
          </Field>
        </div>
        <ValueInputs defaults={data.values} />
        <fieldset className="grid gap-3 border-t border-line pt-4">
          <legend className="mb-1 text-sm font-medium">Scoring weights</legend>
          <div className="grid gap-3 sm:grid-cols-5">
            <Field label="Demographics">
              <Input name="demographics" type="number" min={0} max={5} step={0.5} defaultValue={data.weights.demographics} />
            </Field>
            <Field label="Income">
              <Input name="income" type="number" min={0} max={5} step={0.5} defaultValue={data.weights.income} />
            </Field>
            <Field label="Personality">
              <Input name="personalityWeight" type="number" min={0} max={5} step={0.5} defaultValue={data.weights.personality} />
            </Field>
            <Field label="Lifestyle">
              <Input name="lifestyleWeight" type="number" min={0} max={5} step={0.5} defaultValue={data.weights.lifestyle} />
            </Field>
            <Field label="Values">
              <Input name="valuesWeight" type="number" min={0} max={5} step={0.5} defaultValue={data.weights.values} />
            </Field>
          </div>
        </fieldset>
        <div className="flex items-center gap-3">
          <Button type="submit">Save preferences</Button>
          {saved && <span className="text-sm text-accent">Saved.</span>}
          {error && <span className="text-sm text-risk">{error}</span>}
        </div>
      </form>
    </Panel>
  );
}
