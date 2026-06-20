"use client";



import { useEffect, useState,useRef } from "react";
import { useRouter } from "next/navigation";

import { calculateRisk } from "@/lib/riskEngine";
import { getRecommendations } from "@/lib/recommendationEngine";
import { generateAlerts } from "@/lib/alertEngine";
import { authFetch } from "@/lib/api";


import {
  registerServiceWorker,
  requestNotificationPermission,
  sendTestNotification,
  sendNotification,
} from "@/lib/notification";

import useForecast from "@/hooks/useForecast";
import useReverseGeocode from "@/hooks/useReverseGeocode";
import useLocation from "@/hooks/useLocation";
import useWeather from "@/hooks/useWeather";
import useAQI from "@/hooks/useAQI";

import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import WeatherCard from "@/components/dashboard/WeatherCard";
import AQICard from "@/components/dashboard/AQICard";
import AlertCard from "@/components/dashboard/AlertCard";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import LocationCard from "@/components/dashboard/LocationCard";
import RiskTimeline from "@/components/dashboard/RiskTimeline";
import RiskHistoryChart from "@/components/dashboard/RiskHistoryChart";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { calculateDestinationRisk } from "@/lib/destinationRisk";

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [dbAlerts, setDbAlerts] = useState([]);
const [mutedEvents, setMutedEvents] = useState(new Set());
 const [notificationsEnabled, setNotificationsEnabled] =
  useState(true);
 
  const { latitude, longitude, loading, error } = useLocation();
  const address = useReverseGeocode(
  latitude,
  longitude
);
  const weather = useWeather(latitude, longitude);
  const aqi = useAQI(latitude, longitude);
  const forecast = useForecast(latitude, longitude);
 const [activeAlerts, setActiveAlerts] = useState([]);
 const [destination, setDestination] = useState(null);
const dismissedAlerts = useRef(new Set());
const previousAlertIds = useRef(new Set());
 

const firstLoad = useRef(true);
const stopAlert = async (alert) => {
  try {
    await fetch("/api/alerts/mute", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        eventId: alert.eventId,
      }),
    });

    dismissedAlerts.current.add(alert.eventId);

    setMutedEvents((prev) => {
      const updated = new Set(prev);
      updated.add(alert.eventId);
      return updated;
    });

    console.log("🔕 Notifications stopped:", alert.eventId);

  } catch (err) {
    console.error("Failed to stop alert:", err);
  }
};

 

const alerts = generateAlerts(weather, aqi);

const fire = dbAlerts.filter(a => a.type === "FIRE");
const earthquakeAlerts = dbAlerts.filter(a => a.type === "EARTHQUAKE");
const floodAlerts = dbAlerts.filter(a => a.type === "FLOOD");
const tsunamiAlerts = dbAlerts.filter(a => a.type === "TSUNAMI");
const weatherAlerts = dbAlerts.filter(a => a.type === "WEATHER");

const riskScore = calculateRisk({
  temperature: weather?.temperature_2m || 0,
  aqi: aqi?.us_aqi || 0,

  fireAlerts: fire,
  earthquakeAlerts,
  floodAlerts,
  tsunamiAlerts,
  weatherAlerts,
  alerts,
});

  const recommendations = getRecommendations({
  temp: weather?.temperature_2m || 0,
  aqi: aqi?.us_aqi || 0,

  fireAlerts: fire,
  earthquakeAlerts,
  floodAlerts,
  tsunamiAlerts,
  weatherAlerts,
});

const destinationRisk = calculateDestinationRisk({
  destination,
  fireAlerts: fire,
  earthquakeAlerts,
  floodAlerts,
  tsunamiAlerts,
  weatherAlerts,
  aqi: aqi?.us_aqi || 0,
});


 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [router]);

 useEffect(() => {
  async function loadAlerts() {
    const token = localStorage.getItem("token");

   const res = await authFetch("/api/alerts");

    const data = await res.json();

    if (data.success) {
      setDbAlerts(data.data);
    }
  }

  loadAlerts();
}, []);

useEffect(() => {
  const saved = localStorage.getItem("destination");

  console.log("RAW LOCALSTORAGE:", saved);

  if (saved) {
    const parsed = JSON.parse(saved);
    console.log("PARSED DESTINATION:", parsed);
    setDestination(parsed);
  }
}, []);

useEffect(() => {
  async function loadMuted() {
    const token = localStorage.getItem("token");

   const res = await authFetch("/api/alerts");

    const data = await res.json();

    if (!data.success) return;

    const muted = data.data
      .filter((a) => a.isMuted)
      .map((a) => a.eventId);

    setMutedEvents(new Set(muted));
  }

  loadMuted();
}, []);
 
useEffect(() => {
  async function loadSettings() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/settings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setNotificationsEnabled(
        data.data.notificationEnabled
      );
    }
  }

  loadSettings();
}, []);

useEffect(() => {
  if (!notificationsEnabled) return;

  
  if (firstLoad.current) {
    previousAlertIds.current = activeAlerts.map(
      (a) => a.eventId
    );
    firstLoad.current = false;
    return;
  }

  const currentEventIds = activeAlerts.map(
    (a) => a.eventId
  );

 
  activeAlerts.forEach((alert) => {
     if (alert.isMuted) return;
    // User muted this specific event
    if (mutedEvents.has(alert.eventId)) return;

    const isNew =
      !previousAlertIds.current.includes(alert.eventId);

    if (isNew) {
      sendNotification(
        "🚨 SafePeep Alert",
        alert.message,
        {
          tag: alert.eventId,
        }
      );
    }
  });

 
  previousAlertIds.current =
    previousAlertIds.current.filter((id) =>
      currentEventIds.includes(id)
    );

  
  currentEventIds.forEach((id) => {
    if (!previousAlertIds.current.includes(id)) {
      previousAlertIds.current.push(id);
    }
  });

}, [
  activeAlerts,
  notificationsEnabled,
  mutedEvents,
]);



useEffect(() => {
  async function fetchInitialAlerts() {
    const token = localStorage.getItem("token");

   const res = await authFetch("/api/alerts");

    const data = await res.json();

    if (!data.success) return;

    const uniqueAlerts = [
      ...new Map(data.data.map(a => [a._id, a])).values()
    ];

   const filtered = uniqueAlerts.filter(
  (a) => !dismissedAlerts.current.has(a.eventId)
);

    setActiveAlerts(filtered);
  }

  fetchInitialAlerts();
}, []);
useEffect(() => {
  const interval = setInterval(async () => {
    const token = localStorage.getItem("token");

 const res = await authFetch("/api/alerts");

    const data = await res.json();

    if (!data.success) return;

    const uniqueAlerts = [
      ...new Map(data.data.map(a => [a._id, a])).values()
    ];

    setActiveAlerts(uniqueAlerts);
  }, 15000); 

  return () => clearInterval(interval);
}, []);


useEffect(() => {
  setMutedEvents((prev) => {
    const updated = new Set(prev);

    const activeIds = new Set(
      activeAlerts.map((a) => a.eventId)
    );

    updated.forEach((id) => {
      if (!activeIds.has(id)) {
        updated.delete(id);
      }
    });

    return updated;
  });
}, [activeAlerts]);

useEffect(() => {
  if (!weather || !aqi) return;

  async function saveRisk() {
    try {
      const token =
        localStorage.getItem("token");

      await fetch("/api/risk/save", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
     body: JSON.stringify({
  riskScore,
  temperature: weather?.temperature_2m || 0,
  aqi: aqi?.us_aqi || 0,

  latitude,
  longitude,
}),
      });
    
    } catch (err) {
      console.error(err);
    }
  }

  saveRisk();
},  [
  weather,
  aqi,
  latitude,
  longitude,
  riskScore,
]);


  useEffect(() => {
    registerServiceWorker();
  }, []);

 
  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }


return (
  <div className="flex min-h-screen bg-background text-foreground transition-colors">

   
    <div className="sticky top-0 h-screen">
      <Sidebar />
    </div>

  
    <div className="flex-1">

    
      <div className="sticky top-0 z-50 bg-card shadow border-b border-border">
        <Navbar />
      </div>

      <main className="p-8">

      
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-4xl font-bold text-foreground">
              SafePeep Dashboard
            </h1>

            <p className="mt-2 text-muted-foreground">
              📍 SafePeep Risk Intelligence
            </p>
          </div>

          <button
            onClick={async () => {
              const allowed = await requestNotificationPermission();

              if (allowed) {
                sendTestNotification();
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-95"
          >
            Enable Alerts 🔔
          </button>

        </div>

        
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <RiskScoreCard score={riskScore} />
          <WeatherCard weather={weather} />
          <AQICard aqi={aqi} />
        </div>

   
        <div className="mt-8">
          {loading ? (
            <div className="rounded-xl bg-card border border-border p-4 text-muted-foreground shadow">
              Getting location...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-4 text-red-600 dark:text-red-200">
              {error}
            </div>
          ) : (
            <LocationCard
              latitude={latitude}
              longitude={longitude}
            />
          )}
        </div>

       
        <section className="mt-10">
          <RiskTimeline forecast={forecast} />
        </section>

        
        <section className="mt-10">
          <RiskHistoryChart />
        </section>

       
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Active Alerts
          </h2>

          <div>
            {activeAlerts.length === 0 ? (
              <div className="rounded-xl border border-border bg-green-50 dark:bg-green-900/20 p-8 text-center">
                <div className="text-5xl mb-3">🛡️</div>

                <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
                  All Clear
                </h2>

                <p className="mt-2 text-muted-foreground">
                  No active alerts in your area.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  We'll notify you if any environmental risks are detected.
                </p>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  alert={alert}
                  onStop={() => stopAlert(alert)}
                  isStopped={mutedEvents.has(alert.eventId)}
                />
              ))
            )}
          </div>
        </section>

       
        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Recommendations
          </h2>

          <div className="space-y-4">
            {recommendations.map((item, index) => (
              <RecommendationCard
                key={index}
                recommendation={item}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  </div>
);
}