
export default function RiskTimeline({
  forecast,
}) {
  if (!forecast)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <p className="text-slate-500">
          Loading Forecast...
        </p>
      </div>
    );

  const days = forecast.time.slice(0, 5);


return (
  <div className="rounded-xl border border-border bg-card p-6 shadow transition-colors">

    <h2 className="mb-4 text-2xl font-bold text-foreground">
      Risk Timeline 📈
    </h2>

    <div className="space-y-3">

      {days.map((day, index) => {
        const temp = forecast.temperature_2m_max[index];

        let risk = 2;

        if (temp > 40) risk = 8;
        else if (temp > 35) risk = 6;
        else if (temp > 30) risk = 4;

        return (
          <div
            key={day}
            className="flex justify-between border-b border-border pb-2 transition-colors"
          >

            <span className="text-foreground/80">
              {day}
            </span>

            <span
              className={`font-bold ${
                risk >= 7
                  ? "text-red-500 dark:text-red-400"
                  : risk >= 5
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {risk}/10
            </span>

          </div>
        );
      })}

    </div>

  </div>
);}