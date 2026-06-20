
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, []);

return (
  <div className="min-h-screen bg-background text-foreground transition-colors">
    <header className="flex items-center justify-between border-b border-border bg-gradient-to-r from-card to-card/80 px-6 py-4 shadow-sm backdrop-blur">
      <h1 className="text-2xl font-bold text-foreground">
        🌍 SafePeep
      </h1>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg px-4 py-2 font-medium text-foreground transition hover:bg-muted"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </header>

    <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
      <h2 className="text-5xl font-extrabold text-foreground">
        AI-Powered Environmental Safety Intelligence
      </h2>

      <p className="mt-4 max-w-2xl text-xl text-muted-foreground">
        SafePeep continuously monitors real-time environmental conditions and
        alerts you about potential hazards like air pollution, extreme weather,
        floods, fires, and earthquakes — helping you stay informed and safe.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.push("/signup")}
          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
        >
          Get Started
        </button>

        <button
          onClick={() => router.push("/login")}
          className="rounded-xl border border-border px-6 py-3 font-semibold text-foreground transition hover:bg-muted"
        >
          Login
        </button>
      </div>

      <div className="mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon="🌡"
          title="Weather Risk Monitoring"
          desc="Tracks temperature, storms, and extreme weather conditions in real-time."
        />

        <FeatureCard
          icon="🌫"
          title="Air Quality Alerts"
          desc="Monitors AQI levels and warns about harmful pollution exposure."
        />

        <FeatureCard
          icon="🔥"
          title="Fire Hazard Detection"
          desc="Detects fire-prone zones and active fire risk regions."
        />

        <FeatureCard
          icon="🌊"
          title="Flood & Tsunami Alerts"
          desc="Provides real-time water-related disaster notifications."
        />

        <FeatureCard
          icon="🌍"
          title="Earthquake Awareness"
          desc="Detects seismic activity and potential earthquake risk zones."
        />

        <FeatureCard
          icon="🤖"
          title="AI Safety Intelligence"
          desc="Analyzes multiple hazards and explains risk in simple human language."
        />
      </div>

     <div className="mt-16 max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-lg transition-colors">
  <h3 className="text-2xl font-bold text-foreground">
    🧠 Smart Safety Intelligence Engine
  </h3>

  <p className="mt-3 text-muted-foreground">
    SafePeep does not just show data — it fuses multiple hazard signals
    (weather, AQI, fire, flood, earthquake, tsunami) into a unified
    real-time safety score.
  </p>

  <div className="mt-6 grid gap-4 sm:grid-cols-2">
    {/* Green */}
    <div className="rounded-xl border border-green-500/30 bg-green-50 p-4 shadow-sm transition-colors dark:bg-green-950/20">
      <p className="font-semibold text-green-700 dark:text-green-300">
        ✔ Real-time Hazard Fusion
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Combines multiple environmental risks into one safety view.
      </p>
    </div>

    {/* Blue */}
    <div className="rounded-xl border border-blue-500/30 bg-blue-50 p-4 shadow-sm transition-colors dark:bg-blue-950/20">
      <p className="font-semibold text-blue-700 dark:text-blue-300">
        ✔ AI Risk Explanation
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Converts complex hazard data into simple human-readable alerts.
      </p>
    </div>

    {/* Red */}
    <div className="rounded-xl border border-red-500/30 bg-red-50 p-4 shadow-sm transition-colors dark:bg-red-950/20">
      <p className="font-semibold text-red-700 dark:text-red-300">
        ✔ Early Warning System
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Detects danger trends before they become critical.
      </p>
    </div>

    {/* Yellow */}
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-50 p-4 shadow-sm transition-colors dark:bg-yellow-950/20">
      <p className="font-semibold text-yellow-700 dark:text-yellow-300">
        ✔ Continuous Monitoring
      </p>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Always-on safety tracking for your environment.
      </p>
    </div>
  </div>
</div>

      <div className="mt-20 max-w-3xl text-center">
        <h3 className="text-3xl font-bold text-foreground">
          Why SafePeep?
        </h3>

        <p className="mt-4 text-muted-foreground">
          Most apps show isolated weather or AQI data. SafePeep combines all
          environmental hazards into one intelligent safety system that helps
          you stay aware of real-world risks in real time.
        </p>
      </div>

      <div className="mt-12 rounded-2xl bg-green-600 px-8 py-10 text-white shadow-lg">
        <h4 className="text-2xl font-bold">
          Stay Aware. Stay Safe. Stay Informed.
        </h4>

        <button
          onClick={() => router.push("/signup")}
          className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-gray-100"
        >
          Create Free Account
        </button>
      </div>
    </main>

    <footer className="mt-20 border-t border-border bg-card px-6 py-6 text-center text-sm text-muted-foreground transition-colors">
      <p className="font-medium text-foreground">
        © {new Date().getFullYear()} SafePeep. All rights reserved.
      </p>

      <p className="mt-2">
        SafePeep is a real-time environmental safety intelligence platform powered by AI and live hazard data.
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        Always follow official government emergency alerts in critical situations.
      </p>
    </footer>
  </div>
);
}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow transition-all hover:shadow-md">
      <div className="text-3xl">{icon}</div>

      <h4 className="mt-3 text-lg font-semibold text-foreground">
        {title}
      </h4>

      <p className="mt-2 text-sm text-muted-foreground">
        {desc}
      </p>
    </div>
  );
}