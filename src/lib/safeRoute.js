import { getDistanceKm } from "@/lib/distance";


export function buildSafeRoute({
  startLat,
  startLon,
  endLat,
  endLon,

  fireLayers = [],
  earthquakeLayers = [],
  floodLayers = [],
  tsunamiLayers = [],
  weatherLayers = [],

  aqi = 0,
}) {

  const dangerZones = [
    ...fireLayers,
    ...earthquakeLayers,
    ...floodLayers,
    ...tsunamiLayers,
    ...weatherLayers,
  ];

  const route = [];

  const steps = 20;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const lat = startLat + (endLat - startLat) * t;
    const lon = startLon + (endLon - startLon) * t;

    let riskPenalty = 0;

    for (const zone of dangerZones) {

      const dist = getDistanceKm(
        lat,
        lon,
        zone.lat,
        zone.lon
      );

     
      if (zone.type === "FIRE") {
        if (dist < 10) riskPenalty += 4;
        else if (dist < 25) riskPenalty += 2;
        else if (dist < 50) riskPenalty += 1;
      }

      else if (zone.type === "EARTHQUAKE") {
        if (dist < 20) riskPenalty += 4;
        else if (dist < 50) riskPenalty += 2;
        else if (dist < 100) riskPenalty += 1;
      }

      
      else if (zone.type === "FLOOD") {
        if (dist < 15) riskPenalty += 4;
        else if (dist < 40) riskPenalty += 2;
        else if (dist < 80) riskPenalty += 1;
      }

      
      else if (zone.type === "TSUNAMI") {
        if (dist < 50) riskPenalty += 5;
        else if (dist < 100) riskPenalty += 3;
        else if (dist < 200) riskPenalty += 1;
      }

  
      else {
        if (dist < 10) riskPenalty += 2;
        else if (dist < 30) riskPenalty += 1;
      }
    }

 
    if (aqi > 200) riskPenalty += 4;
    else if (aqi > 150) riskPenalty += 3;
    else if (aqi > 100) riskPenalty += 2;
    else if (aqi > 50) riskPenalty += 1;

   
    const isSafe = riskPenalty <= 3;

    route.push({
      id: `route-${i}`,
      lat,
      lon,
      isSafe,
      riskPenalty,
    });
  }

  return route;
}