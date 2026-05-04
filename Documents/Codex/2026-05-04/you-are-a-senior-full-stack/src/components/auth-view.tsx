"use client";

import { useState } from "react";
import { Button, Field, Input, Select, Textarea } from "./ui";

const initialValues = { ambition: 3, family: 3, adventure: 3, stability: 3, creativity: 3 };

export function AuthView({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setError("");
    const values = Object.fromEntries(formData.entries());
    const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const payload =
      mode === "register"
        ? {
            ...values,
            age: Number(values.age),
            income: Number(values.income),
            values: {
              ambition: Number(values.ambition),
              family: Number(values.family),
              adventure: Number(values.adventure),
              stability: Number(values.stability),
              creativity: Number(values.creativity)
            }
          }
        : { email: values.email, password: values.password };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const body = await response.json();
      setError(typeof body.error === "string" ? body.error : "Please check the form and try again.");
      return;
    }
    onAuthed();
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-5xl gap-8 px-4 py-8 md:grid-cols-[0.9fr_1.1fr]">
      <section className="self-start border-t border-line pt-6">
        <h1 className="text-3xl font-semibold tracking-normal">Blunder</h1>
        <p className="mt-2 max-w-md text-muted">
          A reverse dating experiment that measures the distance between stated preferences and actual behavior.
        </p>
      </section>
      <form action={submit} className="grid gap-4 border-t border-line pt-6">
        <div className="flex gap-2">
          <Button type="button" variant={mode === "register" ? "primary" : "secondary"} onClick={() => setMode("register")}>
            Create account
          </Button>
          <Button type="button" variant={mode === "login" ? "primary" : "secondary"} onClick={() => setMode("login")}>
            Sign in
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Password" help={mode === "register" ? "At least 8 characters." : undefined}>
            <Input name="password" type="password" required minLength={mode === "register" ? 8 : 1} />
          </Field>
        </div>
        {mode === "register" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <Input name="name" required minLength={2} />
              </Field>
              <Field label="Age">
                <Input name="age" type="number" min={18} max={90} required />
              </Field>
              <Field label="Gender">
                <Select name="gender" defaultValue="woman">
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                  <option value="nonbinary">Non-binary</option>
                  <option value="any">Prefer not to bucket</option>
                </Select>
              </Field>
              <Field label="Income">
                <Input name="income" type="number" min={0} step={1000} required />
              </Field>
              <Field label="Personality">
                <Select name="personality" defaultValue="ambivert">
                  <option value="introvert">Introvert</option>
                  <option value="ambivert">Ambivert</option>
                  <option value="extrovert">Extrovert</option>
                </Select>
              </Field>
              <Field label="Lifestyle">
                <Select name="lifestyle" defaultValue="balanced">
                  <option value="quiet">Quiet</option>
                  <option value="balanced">Balanced</option>
                  <option value="social">Social</option>
                </Select>
              </Field>
            </div>
            <ValueInputs defaults={initialValues} />
            <Field label="Bio">
              <Textarea name="bio" maxLength={280} placeholder="One plain sentence is enough." />
            </Field>
          </>
        )}
        {error && <p className="rounded-md border border-risk bg-white px-3 py-2 text-sm text-risk">{error}</p>}
        <Button type="submit">{mode === "register" ? "Enter experiment" : "Sign in"}</Button>
      </form>
    </main>
  );
}

export function ValueInputs({ defaults }: { defaults: Record<string, number> }) {
  return (
    <fieldset className="grid gap-3 border-t border-line pt-4">
      <legend className="mb-1 text-sm font-medium">Values, 1 to 5</legend>
      <div className="grid gap-3 sm:grid-cols-5">
        {Object.entries(defaults).map(([key, value]) => (
          <Field label={key} key={key}>
            <Input name={key} type="number" min={1} max={5} defaultValue={value} />
          </Field>
        ))}
      </div>
    </fieldset>
  );
}
