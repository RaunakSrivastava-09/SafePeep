import { getDistanceKm } from "./distance";

export function calculateDestinationRisk({
  destination,
  fireAlerts = [],
  earthquakeAlerts = [],
  weatherAlerts = [],
  aqi = 0,
  temperature = 0,
}) {
  if (!destination?.lat || !destination?.lon) {
    return {
      score: 0,
      color: "green",
      severity: "Safe",
    };
  }

  let score = 0;

  
  const hazards = [
    ...fireAlerts,
    ...earthquakeAlerts,
    ...weatherAlerts,
  ];

  for (const h of hazards) {
    if (!h?.lat || !h?.lon) continue;

    const d = getDistanceKm(
      destination.lat,
      destination.lon,
      h.lat,
      h.lon
    );

    if (d < 5) score += 4;
    else if (d < 15) score += 3;
    else if (d < 30) score += 2;
    else if (d < 50) score += 1;
  }

  // AQI contribution
  if (aqi > 200) score += 3;
  else if (aqi > 150) score += 2;
  else if (aqi > 100) score += 1;

  
  if (temperature >= 45) score += 3;
  else if (temperature >= 40) score += 2;
  else if (temperature >= 35) score += 1;

  score = Math.min(score, 10);

  console.log({
  destination,
  temperature,
  aqi,
  fireAlerts: fireAlerts.length,
  earthquakeAlerts: earthquakeAlerts.length,
  weatherAlerts: weatherAlerts.length,
  score,
})

  if (score >= 7)
    return {
      score,
      color: "red",
      severity: "High",
    };

  if (score >= 4)
    return {
      score,
      color: "orange",
      severity: "Medium",
    };

  return {
    score,
    color: "green",
    severity: "Low",
  };
}