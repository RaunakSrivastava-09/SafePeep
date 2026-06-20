
"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RiskHistoryChart() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/risk/history", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const formatted = [...data.data]
            .sort(
              (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            )
            .map((item) => ({
              date: new Date(item.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              ),
              risk: item.riskScore,
            }));

          setHistory(formatted);
        } else {
          setHistory([]);
        }
      } catch (error) {
        console.error(error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <p className="text-slate-500">
          Loading risk history...
        </p>
      </div>
    );
  }


return (
  <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow transition-colors">

    <h2 className="mb-4 text-xl sm:text-2xl font-bold text-foreground">
      Risk History 📊
    </h2>

    {history.length === 0 ? (
      <p className="text-sm sm:text-base text-muted-foreground">
        No history available yet
      </p>
    ) : (
      <div className="h-[250px] sm:h-[350px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={history}>

            <CartesianGrid
              stroke="currentColor"
              className="text-border opacity-40"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-muted-foreground"
              tick={{ fontSize: 10 }}
            />

            <YAxis
              domain={[0, 10]}
              stroke="currentColor"
              className="text-muted-foreground"
              tick={{ fontSize: 10 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              labelStyle={{
                color: "var(--foreground)",
              }}
            />

            <Line
              type="monotone"
              dataKey="risk"
              stroke="currentColor"
              className="text-foreground"
              strokeWidth={3}
              dot={{ r: 3, fill: "currentColor" }}
              activeDot={{ r: 5, fill: "currentColor" }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    )}

  </div>
);}