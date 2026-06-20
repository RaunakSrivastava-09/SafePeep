export async function getWeatherData(lat, lon) {
  try {
    console.log("Weather API:", lat, lon);

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    console.log("Weather Data:", data);

    return data.current;
  } catch (error) {
    console.error("Weather Fetch Error:", error);
    return null;
  }
}