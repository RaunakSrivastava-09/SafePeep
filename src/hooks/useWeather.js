"use client";

import { useEffect, useState } from "react";
import { getWeatherData } from "@/services/weatherService";

export default function useWeather(lat, lon) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getWeatherData(lat, lon);
      setWeather(data);
    }

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  return weather;
}