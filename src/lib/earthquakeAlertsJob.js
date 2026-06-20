import { processEarthquakes } from "@/lib/earthquakeProcessor";
 import { generateAlertsServer } from "@/lib/alertEngineServer";

export async function generateEarthquakeAlerts({
  userId,
  latitude,
  longitude,
}) {
  try {
    const res = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    const earthquakes = data.features.map((q) => ({
      id: q.id,
      magnitude: q.properties.mag,
      place: q.properties.place,
      time: q.properties.time,
      latitude: q.geometry.coordinates[1],
      longitude: q.geometry.coordinates[0],
    }));

    const alerts = processEarthquakes(
      earthquakes,
      latitude,
      longitude
    );

    if (!alerts.length) {
      return [];
    }

    return await generateAlertsServer({
      userId,
      riskId: null,
      earthquakeAlerts: alerts,
    });
  } catch (err) {
    console.error("Earthquake job error:", err);
    return [];
  }
}