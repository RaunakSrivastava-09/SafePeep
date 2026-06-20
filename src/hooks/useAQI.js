"use client";

import { useEffect, useState } from "react";
import { getAQIData } from "@/services/aqiService";

export default function useAQI(lat, lon) {
  const [aqi, setAQI] = useState(null);

  useEffect(() => {
    async function fetchAQI() {
      const data = await getAQIData(lat, lon);
      setAQI(data);
    }

    if (lat && lon) {
      fetchAQI();
    }
  }, [lat, lon]);

  return aqi;
}