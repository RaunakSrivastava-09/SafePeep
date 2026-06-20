export function calculateRisk({
  temperature = 0,
  aqi = 0,
  fireAlerts = [],
  earthquakeAlerts = [],
  floodAlerts = [],
  tsunamiAlerts = [],
  weatherAlerts = [],
  alerts = [],
}) {
  let score = 0;

  
  if (temperature >= 45) score += 3;
  else if (temperature >= 40) score += 2;
  else if (temperature >= 35) score += 1;


  if (aqi >= 300) score += 3;
  else if (aqi >= 200) score += 2;
  else if (aqi >= 150) score += 1;

  
  score += fireAlerts.filter(f => f.severity === "High").length * 2;
  score += fireAlerts.filter(f => f.severity === "Medium").length * 1;


  score += earthquakeAlerts.filter(e => e.magnitude >= 6).length * 2;
  score += earthquakeAlerts.filter(e => e.magnitude >= 4).length * 1;

 
  score += floodAlerts.length * 1.5;

  score += tsunamiAlerts.length * 3;

 
  score += weatherAlerts.filter(w => w.severity === "High").length * 2;
  score += weatherAlerts.filter(w => w.severity === "Medium").length * 1;

 
  alerts.forEach(a => {
    if (a.severity === "High") score += 1;
    else if (a.severity === "Medium") score += 0.5;
  });

  return Math.min(Math.round(score), 10);
}