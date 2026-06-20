export function detectWeatherAlerts(weatherData) {
  const alerts = [];

  const {
    temperature,
    precipitation,
    windspeed,
    weathercode,
  } = weatherData;

 
  if (weathercode >= 95) {
    alerts.push({
      type: "STORM",
      message: "Thunderstorm detected in your area",
      severity: "High",
    });
  }


  if (precipitation > 20) {
    alerts.push({
      type: "FLOOD",
      message: `Heavy rainfall detected (${precipitation} mm). Flood risk possible.`,
      severity: precipitation > 50 ? "High" : "Medium",
    });
  }

 
  if (windspeed > 40) {
    alerts.push({
      type: "CYCLONE",
      message: `Strong winds detected (${windspeed} km/h). Possible storm system.`,
      severity: windspeed > 60 ? "High" : "Medium",
    });
  }



  return alerts;
}