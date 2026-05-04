"use client";

export function getSessionId() {
  const key = "blunder_session_id";
  let value = window.sessionStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    window.sessionStorage.setItem(key, value);
  }
  return value;
}

export async function trackClientEvent(eventName: string, payload: Record<string, unknown> = {}) {
  await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, payload, sessionId: getSessionId() })
  });
}
