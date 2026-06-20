"use client";

import { useEffect, useState } from "react";
import { getLocationName } from "@/lib/reverseGeocode";
import useLocation from "./useLocation";

export default function useLocationDetails() {
  const { latitude, longitude, loading, error } = useLocation();

  const [locationName, setLocationName] = useState({
    city: "",
    area: "",
  });

  useEffect(() => {
    async function fetchLocation() {
      if (!latitude || !longitude) return;

      const data = await getLocationName(latitude, longitude);

      setLocationName({
        city: data.city,
        area: data.area,
      });
    }

    fetchLocation();
  }, [latitude, longitude]);

  return {
    latitude,
    longitude,
    loading,
    error,
    ...locationName,
  };
}