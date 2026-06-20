
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/settings", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (data.success) {
          setSettings({
            notificationEnabled:
              data.data.notificationEnabled ?? true,

            darkMode:
              data.data.darkMode ?? false,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);


  useEffect(() => {
    if (!settings) return;

    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );
  }, [settings]);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (data.success) {
        alert("Settings saved successfully.");
      } else {
        alert(data.error || "Failed to save.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-gray-500">
        Loading Settings...
      </div>
    );
  }

return (
  <main className="min-h-screen bg-background text-foreground p-4 sm:p-8 transition-colors">

    <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold">
      ⚙ Settings
    </h1>

    <div className="mx-auto max-w-2xl rounded-2xl bg-card border border-border shadow-lg p-5 sm:p-8 space-y-6 sm:space-y-8">

      {/* Notifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-base sm:text-lg font-semibold">
            🔔 Enable Notifications
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground">
            Receive disaster and safety alerts.
          </p>

        </div>

        <input
          type="checkbox"
          checked={settings.notificationEnabled}
          onChange={() => handleToggle("notificationEnabled")}
          className="h-5 w-5 accent-blue-600 self-start sm:self-auto"
        />

      </div>

      <hr className="border-border" />

      {/* Dark Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <h2 className="text-base sm:text-lg font-semibold">
            🌙 Dark Mode
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground">
            Switch between Light and Dark theme.
          </p>

        </div>

        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={() => handleToggle("darkMode")}
          className="h-5 w-5 accent-gray-800 self-start sm:self-auto"
        />

      </div>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="w-full rounded-xl bg-blue-600 py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-blue-700"
      >
        {saving ? "Saving..." : "💾 Save Settings"}
      </button>

    </div>

  </main>
);
}