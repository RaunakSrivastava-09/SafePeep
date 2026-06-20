"use client";

import { useEffect, useState } from "react";
import AlertCard from "@/components/dashboard/AlertCard";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/alerts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data.success) return;

      
        setAlerts(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);


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

    
      setAlerts((prev) =>
        prev.map((a) =>
          a.eventId === alert.eventId
            ? { ...a, isMuted: true }
            : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Emergency Alerts 🚨
        </h1>
        <p>Loading alerts...</p>
      </div>
    );
  }

 
return (
  <main className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      Emergency Alerts 🚨
    </h1>

  {alerts.length === 0 ? (
  <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-lg transition-colors">
    <div className="mb-3 text-5xl">🛡️</div>

    <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
      All Clear
    </h2>

    <p className="mt-2 text-muted-foreground">
      No active alerts in your area right now.
    </p>

    <p className="mt-1 text-sm text-muted-foreground">
      We'll notify you immediately when any risk is detected.
    </p>
  </div>
) : (
      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert._id}
            alert={alert}
            onStop={() => stopAlert(alert)}
            isStopped={alert.isMuted}
          />
        ))}
      </div>
    )}

  </main>
);
}