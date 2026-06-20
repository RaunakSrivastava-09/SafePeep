export default function RecommendationCard({
  recommendation,
}) {

return (
  <div className="mb-3 rounded-xl border border-border bg-card p-4 shadow transition-colors">

    <p className="text-foreground/80">
      {recommendation}
    </p>

  </div>
);}