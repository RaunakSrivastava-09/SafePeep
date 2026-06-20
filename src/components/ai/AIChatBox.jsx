"use client";

import { useState, useEffect } from "react";

export default function AISafetyAssistant({
  riskScore,
  temperature,
  aqi,

  fireAlerts = [],
  earthquakeAlerts = [],
  floodAlerts = [],
  tsunamiAlerts = [],
  weatherAlerts = [],

   destinationRisk,

  location,
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [storedDestination, setStoredDestination] = useState(null);

  /* ---------------- LOAD DESTINATION (SAFE SSR HANDLING) ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("destination");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStoredDestination(parsed);
      } catch (err) {
        console.error("Invalid destination in localStorage", err);
        setStoredDestination(null);
      }
    }
  }, []);

  useEffect(() => {
  const handler = () => {
    const saved = localStorage.getItem("destination");
    setStoredDestination(saved ? JSON.parse(saved) : null);
  };

  window.addEventListener("destinationChanged", handler);

  return () => window.removeEventListener("destinationChanged", handler);
}, []);

  /* ---------------- ASK AI ---------------- */
async function askAI() {
  if (!question.trim()) return;

  setLoading(true);
  setAnswer("");

  try {
    // 🔥 always get fresh destination
    const freshDestination = JSON.parse(
      localStorage.getItem("destination") || "null"
    );

    if (!freshDestination?.lat || !freshDestination?.lon) {
      setLoading(false);
      setAnswer("Please select a destination first.");
      return;
    }

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        question,
        riskScore,
        temperature,
        aqi,

        fireAlerts,
        earthquakeAlerts,
        floodAlerts,
        tsunamiAlerts,
        weatherAlerts,

        location,
       destinationRisk: destinationRisk?.score || 0,
        destination: freshDestination,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setAnswer(data.response);
    } else {
      setAnswer(data.message || "AI couldn't answer right now.");
    }
  } catch (err) {
    console.error(err);
    setAnswer("Something went wrong.");
  } finally {
    setLoading(false);
  }
}


return (
  <div className="mt-6 sm:mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md transition-colors">

    <h2 className="mb-2 text-xl sm:text-2xl font-bold text-foreground">
      🤖 AI Safety Assistant
    </h2>

    <p className="mb-4 sm:mb-5 text-xs sm:text-sm text-muted-foreground">
      Ask about safety, weather, AQI, or travel risk.
    </p>

    {/* DESTINATION DISPLAY */}
    <div className="mb-3 hidden text-sm">

      {storedDestination ? (
        <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-green-700 dark:text-green-300">
          📍 Destination: {storedDestination.name}
        </span>
      ) : (
        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-gray-500 dark:text-gray-300">
          📍 No destination selected
        </span>
      )}

    </div>

    <textarea
      rows={3}
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      placeholder="Example: Is it safe to travel today?"
      className="w-full rounded-xl border border-border bg-background text-foreground p-3 text-sm sm:text-base outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500"
    />

    <button
      onClick={askAI}
      disabled={loading}
      className="mt-4 w-full sm:w-auto rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
    >
      {loading ? "Thinking..." : "Ask AI"}
    </button>

    {answer && (
      <div className="mt-5 sm:mt-6 rounded-2xl border border-border bg-background p-4 sm:p-5 shadow-sm transition-colors">

        <h3 className="mb-2 font-semibold text-foreground text-sm sm:text-base">
          🧠 SafePeep AI
        </h3>

        <p className="whitespace-pre-wrap text-xs sm:text-sm text-muted-foreground">
          {answer}
        </p>

      </div>
    )}

  </div>
);
}