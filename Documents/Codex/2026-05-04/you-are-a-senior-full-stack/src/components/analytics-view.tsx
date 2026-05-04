"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PreferenceVector, ValueKey } from "@/lib/types";
import { Panel } from "./ui";

type Analytics = {
  stated: PreferenceVector | null;
  observed: {
    swipeCount: number;
    likeCount: number;
    messageCount: number;
    responseRateProxy: number;
    averageEngagedCompatibility: number;
    averageEngagedMismatch: number;
    averageEngagedIncome: number;
    actualValues: Record<ValueKey, number>;
  };
};

const valueKeys: ValueKey[] = ["ambition", "family", "adventure", "stability", "creativity"];

export function AnalyticsView() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((response) => response.json())
      .then(setData);
  }, []);

  if (!data) return <Panel>Loading findings...</Panel>;

  const chartData = valueKeys.map((key) => ({
    value: key,
    stated: data.stated?.values[key] ?? 0,
    engaged: data.observed.actualValues[key] ?? 0
  }));

  const incomeGap = data.stated ? data.observed.averageEngagedIncome - (data.stated.incomeMin + data.stated.incomeMax) / 2 : 0;

  return (
    <Panel>
      <div className="grid gap-6">
        <div>
          <h2 className="text-lg font-semibold">Stated vs Actual</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            This dashboard uses likes and sent messages as engagement proxies. It does not claim attraction, chemistry, or intent.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <Kpi label="Swipes" value={data.observed.swipeCount} />
          <Kpi label="Engages" value={data.observed.likeCount} />
          <Kpi label="Messages" value={data.observed.messageCount} />
          <Kpi label="Engage rate" value={`${Math.round(data.observed.responseRateProxy * 100)}%`} />
        </div>
        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="h-80 rounded-md border border-line bg-white p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8d3c8" />
                <XAxis dataKey="value" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="stated" fill="#171717" name="Stated" />
                <Bar dataKey="engaged" fill="#1f7668" name="Engaged" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid content-start gap-3 text-sm">
            <Insight title="Mismatch pull">
              Average engaged mismatch is {Math.round(data.observed.averageEngagedMismatch * 100)}%, while engaged compatibility is{" "}
              {Math.round(data.observed.averageEngagedCompatibility * 100)}%.
            </Insight>
            <Insight title="Income drift">
              Engaged profiles average ${data.observed.averageEngagedIncome.toLocaleString()},{" "}
              {incomeGap >= 0 ? "above" : "below"} the midpoint of the stated income range by ${Math.abs(Math.round(incomeGap)).toLocaleString()}.
            </Insight>
            <Insight title="Constraint">
              With a small user pool, mismatch results can reflect inventory more than preference contradiction.
            </Insight>
          </div>
        </section>
      </div>
    </Panel>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <p className="text-xs uppercase text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Insight({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted">{children}</p>
    </div>
  );
}
