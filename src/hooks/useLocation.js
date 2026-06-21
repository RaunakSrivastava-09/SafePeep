"use client";

import { useEffect, useState } from "react";

export default function useLocation() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
   
      (position) => {
  const { latitude, longitude, accuracy } = position.coords;

  if (accuracy && accuracy > 1500) {
    console.log("Ignoring bad GPS fix:", accuracy);
    return; 
  }

  setLatitude(latitude);
  setLongitude(longitude);
  setLoading(false);
},
      (err) => {
        console.error(err);

        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location permission denied");
            break;

          case err.POSITION_UNAVAILABLE:
            setError("Location unavailable");
            break;

          case err.TIMEOUT:
            setError("Location request timed out");
            break;

          default:
            setError("Failed to get location");
        }

        setLoading(false);
      },
 {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 60000,
}
    );
  }, []);

  return {
    latitude,
    longitude,
    loading,
    error,
  };
}