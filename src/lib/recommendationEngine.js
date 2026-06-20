export function getRecommendations({
  temp = 0,
  aqi = 0,
  fireAlerts = [],
  earthquakeAlerts = [],
  floodAlerts = [],
  tsunamiAlerts = [],
  weatherAlerts = [],
}) {
  const recommendations = [];

 
  if (temp >= 45) {
    recommendations.push(
      "🔥 Extreme heat detected. Stay indoors as much as possible."
    );
    recommendations.push("Avoid stepping out between 12 PM - 4 PM.");
  } else if (temp >= 35) {
    recommendations.push("🌡 High temperature. Stay hydrated frequently.");
    recommendations.push("Wear light cotton clothes and avoid sun exposure.");
  }


  if (aqi >= 200) {
    recommendations.push("😷 Very poor air quality. Wear an N95 mask.");
    recommendations.push("Avoid outdoor activities completely if possible.");
  } else if (aqi >= 140) {
    recommendations.push("⚠️ Moderate air pollution. Limit outdoor exercise.");
  }

 
  if (fireAlerts.length > 0) {
    recommendations.push(
      "🔥 Fire risk nearby. Avoid affected routes and forest areas."
    );
    recommendations.push("Stay updated with local emergency alerts.");
  }

 
  if (earthquakeAlerts.length > 0) {
    recommendations.push(
      "🌍 Earthquake activity detected. Avoid unstable buildings."
    );
    recommendations.push("Stay in open areas and be ready for aftershocks.");
  }

 
  if (floodAlerts.length > 0) {
    recommendations.push(
      "🌊 Flood warning active. Avoid low-lying and waterlogged areas."
    );
    recommendations.push("Do not cross flowing water or submerged roads.");
  }

 
  if (tsunamiAlerts.length > 0) {
    recommendations.push(
      "🌊 Tsunami alert. Move immediately to higher ground."
    );
    recommendations.push("Stay away from coastal areas until cleared.");
  }

  if (weatherAlerts.length > 0) {
    recommendations.push(
      "🌦 Severe weather detected. Carry rain protection if going out."
    );
  }


  if (temp >= 35 && aqi >= 100) {
    recommendations.push(
      "⚠️ Combined heat + pollution risk. Reduce outdoor exposure significantly."
    );
  }

  if (
    fireAlerts.length > 0 &&
    (aqi >= 100 || temp >= 35)
  ) {
    recommendations.push(
      "🚨 Multiple risks detected (Fire + Environment). Stay indoors if possible."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("✅ Conditions are safe. You can go outside normally.");
    recommendations.push("😊 No major environmental risks detected right now.");
  }

  return recommendations;
}