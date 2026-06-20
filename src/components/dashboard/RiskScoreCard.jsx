
import { ShieldAlert } from "lucide-react";

export default function RiskScoreCard({ score }) {

return (
  <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow transition-colors">

    <div className="flex items-center gap-2">

      <ShieldAlert
        size={20}
        className="text-red-500 dark:text-red-400 sm:w-6 sm:h-6"
      />

      <h2 className="text-lg sm:text-xl font-bold text-foreground">
        Risk Score
      </h2>

    </div>

    <p className="mt-4 text-3xl sm:text-5xl font-bold text-red-500 dark:text-red-400">
      {score}/10
    </p>

  </div>
);}