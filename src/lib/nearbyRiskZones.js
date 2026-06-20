export function generateNearbyRiskZones({
  userLat,
  userLon,
  weather = {},
  aqi = 0,
}) {
  const zones = [];

  const offsets = [
    { dLat: 0.02, dLon: 0.02 },
    { dLat: -0.02, dLon: 0.015 },
    { dLat: 0.03, dLon: -0.02 },
  ];

  offsets.forEach((o, i) => {
    const lat = userLat + o.dLat;
    const lon = userLon + o.dLon;

   
    let risk = 3;

    if (aqi > 150) risk += 2;
    if (weather?.temperature_2m > 38) risk += 2;

    const level =
      risk >= 7 ? "red" :
      risk >= 5 ? "orange" :
      "green";

    zones.push({
      id: `nearby-${i}`,
      lat,
      lon,
      risk,
      level,
      label: `Nearby Zone ${i + 1}`,
    });
  });

  return zones;
}