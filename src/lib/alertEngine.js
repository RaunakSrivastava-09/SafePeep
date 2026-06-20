export function generateAlerts(weather, aqi) {
  const alerts = [];

  const temperature = weather?.temperature_2m || 0;
  const windSpeed = weather?.wind_speed_10m || 0;
  const airQuality = aqi?.us_aqi || 0;


  if (temperature >= 40) {
    alerts.push({
      id: 1,
      title: "Heatwave Alert",
      severity: "High",
    });
  }

  
  if (temperature >= 45) {
    alerts.push({
      id: 2,
      title: "Extreme Heat Warning",
      severity: "High",
    });
  }

  
  if (temperature <= 5) {
    alerts.push({
      id: 3,
      title: "Cold Wave Alert",
      severity: "High",
    });
  }

 
  if (airQuality >= 100) {
    alerts.push({
      id: 4,
      title: "Poor Air Quality",
      severity: "Medium",
    });
  }

  if (airQuality >= 200) {
    alerts.push({
      id: 5,
      title: "Severe Air Pollution",
      severity: "High",
    });
  }

 
  if (windSpeed >= 30) {
    alerts.push({
      id: 6,
      title: "Strong Wind Warning",
      severity: "Medium",
    });
  }

 
  if (temperature >= 38 && airQuality >= 120) {
    alerts.push({
      id: 7,
      title: "Elevated Fire Risk",
      severity: "High",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 999,
      title: "No Active Alerts",
      severity: "Low",
    });
  }

  return alerts;
}