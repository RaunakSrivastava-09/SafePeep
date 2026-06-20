"use client";

import { useEffect, useState } from "react";

import AIChatBox from "@/components/ai/AIChatBox";
import DestinationSearch from "@/components/map/DestinationSearch";

import useLocation from "@/hooks/useLocation";
import useReverseGeocode from "@/hooks/useReverseGeocode";
import useWeather from "@/hooks/useWeather";
import useAQI from "@/hooks/useAQI";

import { calculateRisk } from "@/lib/riskEngine";
import { calculateDestinationRisk } from "@/lib/destinationRisk";
import { generateAlerts } from "@/lib/alertEngine";

export default function AIPage() {
  const { latitude, longitude } = useLocation();

  const address = useReverseGeocode(latitude, longitude);
  const weather = useWeather(latitude, longitude);
  const aqi = useAQI(latitude, longitude);

  const [destination, setDestination] = useState(null);

  const [fireAlerts, setFireAlerts] = useState([]);
  const [earthquakeAlerts, setEarthquakeAlerts] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);

  const floodAlerts = [];
  const tsunamiAlerts = [];

  const alerts = generateAlerts(weather, aqi);



  function handleDestinationSelect(dest) {
    localStorage.setItem("destination", JSON.stringify(dest));

    window.dispatchEvent(
      new Event("destinationChanged")
    );

    setDestination(dest);
  }

  useEffect(() => {
    const loadDestination = () => {
      const saved = localStorage.getItem("destination");

      if (!saved) {
        setDestination(null);
        return;
      }

      try {
        setDestination(JSON.parse(saved));
      } catch {
        setDestination(null);
      }
    };

    loadDestination();

    window.addEventListener(
      "destinationChanged",
      loadDestination
    );

    return () =>
      window.removeEventListener(
        "destinationChanged",
        loadDestination
      );
  }, []);

 

  useEffect(() => {
    if (!latitude || !longitude) return;

    async function loadFireAlerts() {
      const res = await fetch(
        `/api/fire-alerts?lat=${latitude}&lon=${longitude}`
      );

      const data = await res.json();

      if (data.success) {
        setFireAlerts(data.data || []);
      }
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

      if (data.success) {
        setEarthquakeAlerts(data.data || []);
      }
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

      if (data.success) {
        setWeatherAlerts(data.weatherLayers || []);
      }
    }

    loadWeatherHazards();
  }, [latitude, longitude]);

 

  const riskScore = calculateRisk({
    temperature: weather?.temperature_2m || 0,
    aqi: aqi?.us_aqi || 0,

    fireAlerts,
    earthquakeAlerts,
    floodAlerts,
    tsunamiAlerts,
    weatherAlerts,

    alerts,
  });

  console.log("Temperature:", weather?.temperature_2m);
console.log("AQI:", aqi?.us_aqi);
console.log("Destination:", destination);

 

const destinationRiskData =
  destination && weather && aqi
    ? calculateDestinationRisk({
        destination,
        fireAlerts,
        earthquakeAlerts,
        weatherAlerts,
        floodAlerts,
        tsunamiAlerts,
        aqi: aqi.us_aqi,
        temperature: weather.temperature_2m,
      })
    : {
        score: 0,
        color: "green",
        severity: "Safe",
      };



console.log("AI DATA", {
  destination,
  temperature: weather?.temperature_2m,
  aqi: aqi?.us_aqi,
  fireAlerts: fireAlerts.length,
  earthquakeAlerts: earthquakeAlerts.length,
  weatherAlerts: weatherAlerts.length,
  destinationRisk: destinationRiskData,
});

if (!weather || !aqi) {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold">🤖 AI Safety Assistant</h1>
      <p className="mt-6 text-gray-500">
        Loading environmental data...
      </p>
    </main>
  );
}




return (
  <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
      🤖 AI Safety Assistant
    </h1>

    <p className="mt-2 mb-8 text-gray-600 dark:text-gray-300">
      Ask anything about disasters,
      weather, air quality or travel
      safety.
    </p>

    <div className="mb-6">
      <DestinationSearch
        onDestinationSelect={handleDestinationSelect}
      />
    </div>

    <AIChatBox
      riskScore={riskScore}
      temperature={weather.temperature_2m}
      aqi={aqi.us_aqi}
      fireAlerts={fireAlerts}
      earthquakeAlerts={earthquakeAlerts}
      floodAlerts={floodAlerts}
      tsunamiAlerts={tsunamiAlerts}
      weatherAlerts={weatherAlerts}
      location={address}
      destination={destination}
      destinationRisk={destinationRiskData}
    />

  </main>
);
}