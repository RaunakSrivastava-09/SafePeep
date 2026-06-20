import { useEffect, useState } from "react";

export default function useReverseGeocode(
  latitude,
  longitude
) {
  const [locationName, setLocationName] =
    useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchLocation() {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await res.json();

        setLocationName({
              area:
            data.address.suburb ||
            data.address.neighbourhood ||
            data.address.quarter ||
            data.address.hamlet ||
            data.address.residential ||
            data.address.village ||
            "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state:
            data.address.state || "",
          country:
            data.address.country || "",
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchLocation();
  }, [latitude, longitude]);

  return locationName;
}