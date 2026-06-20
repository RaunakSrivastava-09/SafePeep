

export default function AlertCard({
  alert,
  onStop,
  isStopped,
}) {
  const colors = {
    High: "border-red-500",
    Medium: "border-amber-500",
    Low: "border-green-500",
  };



return (
  <div
    className={`mb-3 rounded-lg border border-border border-l-4 bg-card p-4 shadow transition-colors ${
      isStopped ? "opacity-50" : ""
    }`}
  >

    <h3 className="font-semibold text-foreground">
      {alert.message}
    </h3>

    <p className="mt-1 text-sm text-muted-foreground">
      Type: {alert.type}
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      Severity{" "}

      <span
        className={`font-medium ${
          alert.severity === "High"
            ? "text-red-500 dark:text-red-400"
            : alert.severity === "Medium"
            ? "text-amber-500 dark:text-amber-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        {alert.severity}
      </span>

    </p>

    <div className="mt-4">

      {isStopped ? (
        <div className="text-sm font-medium text-muted-foreground">
          🔕 Notifications stopped
        </div>
      ) : (
        <button
          onClick={() => onStop(alert.eventId)}
          className="rounded-lg bg-slate-800 dark:bg-slate-700 px-4 py-2 text-white hover:bg-slate-900 dark:hover:bg-slate-600 transition"
        >
          Stop Notifications
        </button>
      )}

    </div>

  </div>
);

}