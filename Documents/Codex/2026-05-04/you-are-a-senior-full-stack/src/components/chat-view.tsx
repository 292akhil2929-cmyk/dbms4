"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getSessionId } from "./session";
import { Button, Field, Panel, Textarea } from "./ui";

type Conversation = {
  match_id: number;
  candidate_id: number;
  mismatch_score: number;
  name: string;
  bio: string;
  last_message: string | null;
};

export function ChatView() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [body, setBody] = useState("");

  async function load() {
    const response = await fetch("/api/chat");
    const data = await response.json();
    const next = data.conversations ?? [];
    setConversations(next);
    setActive((current) => current ?? next[0] ?? null);
  }

  useEffect(() => {
    load();
  }, []);

  async function send() {
    if (!active || !body.trim()) return;
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId: active.match_id, body: body.trim(), sessionId: getSessionId() })
    });
    setBody("");
    await load();
  }

  return (
    <Panel>
      <div className="grid gap-5 md:grid-cols-[300px_1fr]">
        <aside className="grid content-start gap-2">
          <h2 className="mb-2 text-lg font-semibold">Engaged Mismatches</h2>
          {conversations.length === 0 && (
            <p className="text-sm text-muted">Engage with someone in the mismatch queue to open a basic conversation.</p>
          )}
          {conversations.map((conversation) => (
            <button
              key={conversation.match_id}
              onClick={() => setActive(conversation)}
              className={`focus-ring rounded-md border p-3 text-left text-sm ${
                active?.match_id === conversation.match_id ? "border-ink bg-white" : "border-line bg-white"
              }`}
            >
              <span className="block font-medium">{conversation.name}</span>
              <span className="block text-muted">mismatch {Math.round(conversation.mismatch_score * 100)}%</span>
            </button>
          ))}
        </aside>
        <section className="min-h-[360px] border-t border-line pt-5 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          {!active && <p className="text-sm text-muted">No conversation selected.</p>}
          {active && (
            <div className="grid gap-4">
              <div>
                <h3 className="text-xl font-semibold">{active.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted">{active.bio}</p>
              </div>
              <div className="rounded-md border border-line bg-white p-4">
                <p className="text-xs uppercase text-muted">Latest message</p>
                <p className="mt-2 text-sm">{active.last_message || "No message sent yet."}</p>
              </div>
              <Field label="Send message">
                <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Start with a real question." />
              </Field>
              <Button onClick={send} disabled={!body.trim()}>
                <Send size={16} />
                Send
              </Button>
            </div>
          )}
        </section>
      </div>
    </Panel>
  );
}
