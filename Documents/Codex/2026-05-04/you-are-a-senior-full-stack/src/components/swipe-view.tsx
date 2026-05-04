"use client";

import { HeartCrack, RotateCcw, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CandidateMatch } from "@/lib/types";
import { getSessionId, trackClientEvent } from "./session";
import { Button, Panel } from "./ui";

export function SwipeView() {
  const [candidates, setCandidates] = useState<CandidateMatch[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/matches");
    const data = await response.json();
    setCandidates(data.candidates ?? []);
    setIndex(0);
    setLoading(false);
  }

  useEffect(() => {
    load();
    trackClientEvent("session_started", { surface: "swipe" });
    const started = Date.now();
    return () => {
      trackClientEvent("session_time", { surface: "swipe", seconds: Math.round((Date.now() - started) / 1000) });
    };
  }, []);

  async function swipe(decision: "like" | "pass") {
    const current = candidates[index];
    if (!current) return;
    await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateId: current.user.id, decision, sessionId: getSessionId() })
    });
    setIndex((value) => value + 1);
  }

  const current = candidates[index];

  return (
    <Panel>
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Mismatch Queue</h2>
              <p className="text-sm text-muted">Candidates are sorted by highest mismatch score.</p>
            </div>
            <Button variant="secondary" onClick={load}>
              <RotateCcw size={16} />
              Refresh
            </Button>
          </div>
          {loading && <p className="text-sm text-muted">Loading candidates...</p>}
          {!loading && !current && (
            <div className="border-t border-line py-10">
              <p className="font-medium">No more generated mismatches.</p>
              <p className="text-sm text-muted">Seed more users or reset interactions to continue the experiment.</p>
            </div>
          )}
          {current && (
            <article className="grid min-h-[420px] content-between rounded-md border border-line bg-white p-5 shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{current.user.name}</h3>
                    <p className="text-sm text-muted">
                      {current.user.age} · {current.user.gender} · {current.user.personality} · {current.user.lifestyle}
                    </p>
                  </div>
                  <span className="rounded-md border border-risk px-3 py-1 text-sm text-risk">
                    mismatch {Math.round(current.mismatchScore * 100)}%
                  </span>
                </div>
                <p className="mt-5 max-w-2xl text-base leading-7">{current.user.bio || "No bio provided."}</p>
                <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Metric label="Income" value={`$${current.user.income.toLocaleString()}`} />
                  <Metric label="Compatibility" value={`${Math.round(current.compatibilityScore * 100)}%`} />
                  <Metric label="Mismatch" value={`${Math.round(current.mismatchScore * 100)}%`} />
                </dl>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => swipe("pass")}>
                  <X size={18} />
                  Pass
                </Button>
                <Button className="flex-1" onClick={() => swipe("like")}>
                  <Send size={18} />
                  Engage
                </Button>
              </div>
            </article>
          )}
        </section>
        <aside className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="mb-3 flex items-center gap-2">
            <HeartCrack size={18} />
            <h3 className="font-semibold">Why this is shown</h3>
          </div>
          <ul className="grid gap-2 text-sm text-muted">
            {(current?.reasons ?? ["The queue is empty."]).map((reason) => (
              <li key={reason} className="rounded-md border border-line bg-white p-3">
                {reason}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Panel>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-paper p-3">
      <dt className="text-xs uppercase text-muted">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
