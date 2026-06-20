export async function getAQIData(lat, lon) {
  const response = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
  );

  const data = await response.json();

  return data.current;
}