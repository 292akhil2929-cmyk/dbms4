"use client";

import { BarChart3, HeartCrack, LogOut, MessageCircle, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalyticsView } from "./analytics-view";
import { AuthView } from "./auth-view";
import { ChatView } from "./chat-view";
import { OnboardingView } from "./onboarding-view";
import { SwipeView } from "./swipe-view";
import { Button } from "./ui";
import type { PreferenceVector, PublicUser } from "@/lib/types";

type MeResponse = { user: PublicUser | null; preferences: PreferenceVector | null };
type Tab = "swipe" | "preferences" | "chat" | "analytics";

export function AppShell() {
  const [me, setMe] = useState<MeResponse>({ user: null, preferences: null });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("swipe");

  async function refresh() {
    const response = await fetch("/api/me");
    const data = (await response.json()) as MeResponse;
    setMe(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe({ user: null, preferences: null });
  }

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted">Loading Blunder...</main>;
  if (!me.user) return <AuthView onAuthed={refresh} />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "swipe", label: "Mismatches", icon: <HeartCrack size={16} /> },
    { id: "preferences", label: "Preferences", icon: <SlidersHorizontal size={16} /> },
    { id: "chat", label: "Chat", icon: <MessageCircle size={16} /> },
    { id: "analytics", label: "Findings", icon: <BarChart3 size={16} /> }
  ];

  return (
    <main className="min-h-screen">
      <header className="border-b border-line bg-paper/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">Blunder</h1>
            <p className="text-sm text-muted">The matchmaker you don&apos;t need.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-2 text-muted sm:flex">
              <UserRound size={16} />
              {me.user.name}
            </span>
            <Button variant="secondary" onClick={logout}>
              <LogOut size={16} />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-5">
        <nav className="mb-5 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`focus-ring inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm ${
                tab === item.id ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        {tab === "swipe" && <SwipeView />}
        {tab === "preferences" && <OnboardingView initial={me.preferences} mode="preferences" onDone={refresh} />}
        {tab === "chat" && <ChatView />}
        {tab === "analytics" && <AnalyticsView />}
      </div>
    </main>
  );
}
