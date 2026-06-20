function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function processEarthquakes(
  earthquakes,
  userLat,
  userLon
) {
  return earthquakes
    .map((eq) => {
      const distance = haversineDistance(
        userLat,
        userLon,
        eq.latitude,
        eq.longitude
      );

      let severity = "LOW";

      if (eq.magnitude >= 7) severity = "HIGH";
      else if (eq.magnitude >= 5) severity = "MEDIUM";

      return {
        ...eq,
        distance: Math.round(distance),
        severity,
        isDanger:
          eq.magnitude >= 5 &&
          distance <= 500,
      };
    })
    .filter((eq) => eq.isDanger);
}