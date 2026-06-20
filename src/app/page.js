
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

  
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-card to-card/80 px-4 sm:px-6 py-4 shadow-sm backdrop-blur">

      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
        🌍 SafePeep
      </h1>

      <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
        <button
          onClick={() => router.push("/login")}
          className="flex-1 sm:flex-none rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="flex-1 sm:flex-none rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Sign Up
        </button>
      </div>
    </header>

   
    <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-10 text-center">

      <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground">
        AI-Powered Environmental Safety Intelligence
      </h2>

      <p className="mt-4 max-w-2xl text-base sm:text-xl text-muted-foreground">
        SafePeep continuously monitors real-time environmental conditions and
        alerts you about potential hazards like air pollution, extreme weather,
        floods, fires, and earthquakes — helping you stay informed and safe.
      </p>

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <button
          onClick={() => router.push("/signup")}
          className="w-full sm:w-auto rounded-xl bg-green-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition hover:bg-green-700"
        >
          Get Started
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-full sm:w-auto rounded-xl border border-border px-6 py-3 text-sm sm:text-base font-semibold text-foreground transition hover:bg-muted"
        >
          Login
        </button>
      </div>

  
      <div className="mt-12 sm:mt-16 grid max-w-5xl gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">

        <FeatureCard icon="🌡" title="Weather Risk Monitoring" desc="Tracks temperature, storms, and extreme weather conditions in real-time." />
        <FeatureCard icon="🌫" title="Air Quality Alerts" desc="Monitors AQI levels and warns about harmful pollution exposure." />
        <FeatureCard icon="🔥" title="Fire Hazard Detection" desc="Detects fire-prone zones and active fire risk regions." />
        <FeatureCard icon="🌊" title="Flood & Tsunami Alerts" desc="Provides real-time water-related disaster notifications." />
        <FeatureCard icon="🌍" title="Earthquake Awareness" desc="Detects seismic activity and potential earthquake risk zones." />
        <FeatureCard icon="🤖" title="AI Safety Intelligence" desc="Analyzes multiple hazards and explains risk in simple human language." />

      </div>

      
      <div className="mt-12 sm:mt-16 max-w-4xl rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-lg transition-colors w-full">

        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          🧠 Smart Safety Intelligence Engine
        </h3>

        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          SafePeep does not just show data — it fuses multiple hazard signals
          (weather, AQI, fire, flood, earthquake, tsunami) into a unified
          real-time safety score.
        </p>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">

  <div className="rounded-xl border border-green-500/40 bg-green-100 dark:bg-green-950/40 p-4 shadow-sm">
    <p className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-base">
      ✔ Real-time Hazard Fusion
    </p>
    <p className="mt-2 text-xs sm:text-sm text-green-900/80 dark:text-green-100/80">
      Combines multiple environmental risks into one safety view.
    </p>
  </div>

  <div className="rounded-xl border border-blue-500/40 bg-blue-100 dark:bg-blue-950/40 p-4 shadow-sm">
    <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
      ✔ AI Risk Explanation
    </p>
    <p className="mt-2 text-xs sm:text-sm text-blue-900/80 dark:text-blue-100/80">
      Converts complex hazard data into simple human-readable alerts.
    </p>
  </div>

  <div className="rounded-xl border border-red-500/40 bg-red-100 dark:bg-red-950/40 p-4 shadow-sm">
    <p className="font-semibold text-red-800 dark:text-red-200 text-sm sm:text-base">
      ✔ Early Warning System
    </p>
    <p className="mt-2 text-xs sm:text-sm text-red-900/80 dark:text-red-100/80">
      Detects danger trends before they become critical.
    </p>
  </div>

  <div className="rounded-xl border border-yellow-500/40 bg-yellow-100 dark:bg-yellow-950/40 p-4 shadow-sm">
    <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm sm:text-base">
      ✔ Continuous Monitoring
    </p>
    <p className="mt-2 text-xs sm:text-sm text-yellow-900/80 dark:text-yellow-100/80">
      Always-on safety tracking for your environment.
    </p>
  </div>

</div>
      </div>

   
      <div className="mt-12 sm:mt-20 max-w-3xl text-center px-2">

        <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
          Why SafePeep?
        </h3>

        <p className="mt-4 text-sm sm:text-base text-muted-foreground">
          Most apps show isolated weather or AQI data. SafePeep combines all
          environmental hazards into one intelligent safety system that helps
          you stay aware of real-world risks in real time.
        </p>

      </div>

  
      <div className="mt-10 sm:mt-12 w-full max-w-3xl rounded-2xl bg-green-600 px-6 sm:px-8 py-8 sm:py-10 text-white shadow-lg">

        <h4 className="text-xl sm:text-2xl font-bold">
          Stay Aware. Stay Safe. Stay Informed.
        </h4>

        <button
          onClick={() => router.push("/signup")}
          className="mt-5 sm:mt-6 w-full sm:w-auto rounded-xl bg-white px-6 py-3 text-sm sm:text-base font-semibold text-green-700 transition hover:bg-gray-100"
        >
          Create Free Account
        </button>

      </div>

    </main>

   
    <footer className="mt-12 sm:mt-20 border-t border-border bg-card px-4 sm:px-6 py-6 text-center text-xs sm:text-sm text-muted-foreground transition-colors">

      <p className="font-medium text-foreground">
        © {new Date().getFullYear()} SafePeep. All rights reserved.
      </p>

      <p className="mt-2 text-xs sm:text-sm">
        SafePeep is a real-time environmental safety intelligence platform powered by AI and live hazard data.
      </p>

      <p className="mt-2 text-xs text-muted-foreground">
        Always follow official government emergency alerts in critical situations.
      </p>

    </footer>

  </div>
);}


function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 shadow transition-all hover:shadow-md">

      <div className="text-2xl sm:text-3xl">{icon}</div>

      <h4 className="mt-3 text-base sm:text-lg font-semibold text-foreground">
        {title}
      </h4>

      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
        {desc}
      </p>

    </div>
  );
}