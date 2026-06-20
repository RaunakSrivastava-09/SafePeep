

import { getDistanceKm } from "@/lib/distance";


export function buildFireLayers({
  fireAlerts = [],
  userLat,
  userLon,
}) {
  return fireAlerts
    .map((fire) => {
      const distance = getDistanceKm(
        userLat,
        userLon,
        fire.lat,
        fire.lon
      );

      
      if (distance > 50) return null;

      let severity = "Low";
      let radius = 3000;
      let color = "green";

      if (distance <= 5) {
        severity = "High";
        radius = 8000;
        color = "red";
      } else if (distance <= 15) {
        severity = "Medium";
        radius = 5000;
        color = "orange";
      }

      return {
        id: fire.id || `${fire.lat}-${fire.lon}`,
        type: "FIRE",
        lat: fire.lat,
        lon: fire.lon,
        distance,
        severity,
        radius,
        color,
        location:
          fire.locationName || "Fire Zone",
        message:
          `🔥 Fire at ${fire.locationName || "nearby area"} (${distance.toFixed(1)} km from you)`,
      };
    })
    .filter(Boolean);
}


export function buildEarthquakeLayers({
  earthquakeAlerts = [],
  userLat,
  userLon,
}) {
  return earthquakeAlerts
    .map((eq) => {
      if (eq.magnitude < 3.5) return null;

      const distance = getDistanceKm(
        userLat,
        userLon,
        eq.latitude,
        eq.longitude
      );

      if (distance > 800) return null;

      let severity = "Low";
      let radius = eq.magnitude * 25000;
      let color = "purple";

      if (distance <= 100) {
        severity = "High";
        color = "red";
      } else if (distance <= 300) {
        severity = "Medium";
        color = "orange";
      }

      const direction = getDirection(
        userLat,
        userLon,
        eq.latitude,
        eq.longitude
      );

      return {
        id:
          eq.id ||
          `${eq.latitude}-${eq.longitude}`,
        type: "EARTHQUAKE",
        lat: eq.latitude,
        lon: eq.longitude,
        distance,
        magnitude: eq.magnitude,
        severity,
        radius,
        color,
        direction,
        location:
          eq.locationName || "Epicenter",
        message:
          `🌍 Earthquake near ${
            eq.locationName || "region"
          } (${distance.toFixed(
            1
          )} km ${direction})`,
      };
    })
    .filter(Boolean);
}


export function getDirection(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;

  if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1)
    return "nearby";

  if (dx > 0 && dy > 0) return "North-East";
  if (dx > 0 && dy < 0) return "South-East";
  if (dx < 0 && dy > 0) return "North-West";
  return "South-West";
}


export function buildWeatherLayers({
  weatherAlerts = [],
}) {
  return weatherAlerts.map((w) => {
    let color = "blue";

    if (w.type === "STORM") color = "red";
    if (w.type === "RAIN") color = "blue";
    if (w.type === "HEATWAVE") color = "orange";

    return {
      id: w.id || w.type,
      type: "WEATHER",
      message: w.message,
      severity: w.severity || "Medium",
      color,
    };
  });
}


export function buildFloodLayers({
  floodAlerts = [],
}) {
  return floodAlerts.map((flood) => ({
    id: flood.id,
    type: "FLOOD",
    lat: flood.lat,
    lon: flood.lon,
    radius: flood.radius || 8000,
    color: "blue",
    severity: flood.severity || "High",
    message:
      flood.message || "Flood Warning",
  }));
}

export function buildTsunamiLayers({
  tsunamiAlerts = [],
}) {
  return tsunamiAlerts.map((tsunami) => ({
    id: tsunami.id,
    type: "TSUNAMI",
    lat: tsunami.lat,
    lon: tsunami.lon,
    radius: tsunami.radius || 20000,
    color: "cyan",
    severity: tsunami.severity || "High",
    message:
      tsunami.message || "Tsunami Warning",
  }));
}



export function buildMapLayers({
  fireAlerts = [],
  earthquakeAlerts = [],
  weatherAlerts = [],
  floodAlerts = [],
  tsunamiAlerts = [],
  safeRoute = [],      
  userLat,
  userLon,
}) {
  return {
    fireLayers: buildFireLayers({
      fireAlerts,
      userLat,
      userLon,
    }),

    earthquakeLayers: buildEarthquakeLayers({
      earthquakeAlerts,
      userLat,
      userLon,
    }),

    weatherLayers: buildWeatherLayers({
      weatherAlerts,
    }),

    floodLayers: buildFloodLayers({
      floodAlerts,
    }),

    tsunamiLayers: buildTsunamiLayers({
      tsunamiAlerts,
    }),
    safeRoute,
  };
}