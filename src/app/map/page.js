"use client";

import { useEffect, useState } from "react";
import useReverseGeocode from "@/hooks/useReverseGeocode";
import useLocation from "@/hooks/useLocation";
import useWeather from "@/hooks/useWeather";
import useAQI from "@/hooks/useAQI";
import { calculateDestinationRisk } from "@/lib/destinationRisk";
import { generateNearbyRiskZones } from "@/lib/nearbyRiskZones";


import { calculateRisk } from "@/lib/riskEngine";
import { generateAlerts } from "@/lib/alertEngine";
import { buildMapLayers } from "@/lib/mapLayers";
import dynamic from "next/dynamic";
import DestinationSearch from "@/components/map/DestinationSearch";

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
});

export default function MapPage() {
  const { latitude, longitude, loading, error } = useLocation();

  const weather = useWeather(latitude, longitude);
  const aqi = useAQI(latitude, longitude);

  const alerts = generateAlerts(weather, aqi);

  const [fireAlerts, setFireAlerts] = useState([]);
  const [earthquakeAlerts, setEarthquakeAlerts] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [safeRoute, setSafeRoute] = useState([]);
const [nearbyZones, setNearbyZones] = useState([]);
 const [settings, setSettings] = useState(null);
const address = useReverseGeocode(latitude, longitude);





  
const riskScore = calculateRisk({
  temperature: weather?.temperature_2m || 0,
  aqi: aqi?.us_aqi || 0,

  fireAlerts,
  earthquakeAlerts,
  weatherAlerts,
  alerts,
});
  const [destination, setDestination] = useState(null);

  
useEffect(() => {
  if (!latitude || !longitude || !destination) return;

 async function loadRoute() {
  const res = await fetch(
    `/api/safe-route?startLat=${latitude}&startLon=${longitude}&endLat=${destination.lat}&endLon=${destination.lon}`
  );

  console.log("HTTP Status:", res.status);

  const data = await res.json();

  console.log("Safe Route API:", data);

  if (data.success) {
    console.log("Route received:", data.route);
    setSafeRoute(data.route);
  } else {
    console.log("API Error:", data.message);
  }
}

  loadRoute();

}, [
  latitude,
  longitude,
  destination,
  fireAlerts,
  earthquakeAlerts,
  weatherAlerts,
  aqi,
]);


useEffect(() => {
  async function loadSettings() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/settings", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (data.success) {
      setSettings(data.data);
    }
  }

  loadSettings();
}, []);


useEffect(() => {
  console.log("Saving destination:", destination);

  if (destination) {
    localStorage.setItem(
      "destination",
      JSON.stringify(destination)
    );
  }
}, [destination]);


  useEffect(() => {
  if (!latitude || !longitude) return;

  const zones = generateNearbyRiskZones({
    userLat: latitude,
    userLon: longitude,
    weather,
    aqi: aqi?.us_aqi || 0,
  });

  setNearbyZones(zones);
}, [latitude, longitude, weather, aqi]);

  
  useEffect(() => {
    if (!latitude || !longitude) return;

    async function loadFireAlerts() {
      const res = await fetch(
        `/api/fire-alerts?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();

      if (data.success) setFireAlerts(data.data || []);
    }

    loadFireAlerts();
  }, [latitude, longitude]);

 
  useEffect(() => {
    if (!latitude || !longitude) return;

    async function loadEarthquakes() {
      const res = await fetch(
        `/api/earthquakes?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();

      if (data.success) setEarthquakeAlerts(data.data || []);
    }

    loadEarthquakes();
  }, [latitude, longitude]);

 
  useEffect(() => {
    if (!latitude || !longitude) return;

    async function loadWeatherHazards() {
      const res = await fetch(
        `/api/weather-alerts?lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();

      if (data.success) setWeatherAlerts(data.weatherLayers || []);
    }

    loadWeatherHazards();
  }, [latitude, longitude]);

  const layers = buildMapLayers({
    fireAlerts,
    earthquakeAlerts,
    weatherAlerts,
    userLat: latitude,
    userLon: longitude,
    safeRoute, 
  });

const destinationRiskData = calculateDestinationRisk({
  destination,
  fireAlerts,
  earthquakeAlerts,
  weatherAlerts,
  
  aqi: aqi?.us_aqi || 0,
});

  console.log(destination);
  if (loading) return <div className="p-8">Getting your location...</div>;

  if (error) return <div className="p-8 text-red-500">{error}</div>;


return (
  <main className="min-h-screen bg-background text-foreground p-8 transition-colors">

    <h1 className="mb-2 text-3xl font-bold">
      SafePeep Risk Map 🗺️
    </h1>

    <p className="mb-6 text-muted-foreground">
      View your current location and surrounding risk zones.
    </p>

    <DestinationSearch
      onDestinationSelect={setDestination}
    />

    <MapView
      latitude={latitude}
      longitude={longitude}
      destination={destination}
      destinationRisk={destinationRiskData.score}
      destinationRiskColor={destinationRiskData.color}
      destinationSeverity={destinationRiskData.severity}
      riskScore={riskScore}
      temperature={weather?.temperature_2m || 0}
      aqi={aqi?.us_aqi || 0}
      layers={layers}
      address={address}
    />

  </main>
);
}