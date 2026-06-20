export default function LocationCard({
  latitude,
  longitude,
}) {

return (
  <div className="rounded-2xl border border-border bg-card p-6 shadow transition-colors">

    <h2 className="mb-4 text-xl font-bold text-foreground">
      Current Location
    </h2>

    <p className="text-foreground/80">
      Latitude: {String(latitude)}
    </p>

    <p className="text-foreground/80">
      Longitude: {String(longitude)}
    </p>

  </div>
);}