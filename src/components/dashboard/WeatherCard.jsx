
export default function WeatherCard({ weather }) {
  if (!weather) {
 return (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow transition-colors">
    <p className="text-slate-500 text-sm sm:text-base">
      Loading Weather...
    </p>
  </div>
);}


return (
  <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow transition-colors">

    <h2 className="text-lg sm:text-xl font-bold text-foreground">
      Weather
    </h2>

    <p className="mt-4 text-3xl sm:text-5xl font-bold text-sky-600 dark:text-sky-400">
      {weather.temperature_2m}°C
    </p>

    <p className="mt-2 text-sm sm:text-base text-muted-foreground">
      Wind: {weather.wind_speed_10m} km/h
    </p>

  </div>
);}