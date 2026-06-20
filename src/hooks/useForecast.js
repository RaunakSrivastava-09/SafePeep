"use client";

import { useEffect, useState } from "react";

export default function useForecast(
  latitude,
  longitude
) {
  const [forecast, setForecast] =
    useState(null);

  useEffect(() => {
    console.log("Forecast Hook");
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    if (!latitude || !longitude) return;

    async function fetchForecast() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        const data = await response.json();

        console.log("Forecast Data:", data);

        setForecast(data.daily);
      } catch (error) {
        console.error(
          "Forecast Error:",
          error
        );
      }
    }

    fetchForecast();
  }, [latitude, longitude]);

  return forecast;
}