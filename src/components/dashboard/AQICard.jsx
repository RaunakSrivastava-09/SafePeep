

import { Wind } from "lucide-react";

export default function AQICard({ aqi }) {
  if (!aqi) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
        <p className="text-slate-500">
          Loading AQI...
        </p>
      </div>
    );
  }

return (
  <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow transition-colors">

    <div className="flex items-center gap-2">
      <Wind
        size={20}
        className="text-emerald-600 dark:text-emerald-400 sm:w-6 sm:h-6"
      />

      <h2 className="text-lg sm:text-xl font-bold text-foreground">
        Air Quality
      </h2>
    </div>

    <p className="mt-4 text-3xl sm:text-5xl font-bold text-emerald-600 dark:text-emerald-400">
      {aqi.us_aqi}
    </p>

  </div>
);
}