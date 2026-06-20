
"use client";

import { useState } from "react";

export default function DestinationSearch({
  onDestinationSelect,
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchLocation() {
    if (!query.trim()) {
      alert("Please enter a destination.");
      return;
    }

    setLoading(true);

    try {
      console.log("Searching:", query);

      const res = await fetch(
        `/api/search-place?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      console.log("Search Result:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("Destination not found.");
        return;
      }

      const destination = {
        name: data[0].display_name
          .replace(", Banaras Ghats", "")
          .replace("Banaras Ghats, ", ""),
        lat: Number(data[0].lat),
        lon: Number(data[0].lon),
      };

      console.log("Destination Selected:", destination);

     
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "destination",
          JSON.stringify(destination)
        );

      
        window.dispatchEvent(
          new Event("destinationChanged")
        );
      }

    
      if (onDestinationSelect) {
        onDestinationSelect(destination);
      }

     
      setQuery(destination.name);

    } catch (err) {
      console.error("Destination Search Error:", err);
      alert("Failed to search destination.");
    } finally {
      setLoading(false);
    }
  }


return (
  <div className="mb-5 flex gap-3 transition-colors">

    <input
      type="text"
      value={query}
      placeholder="Search destination..."
      className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-foreground outline-none transition focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          searchLocation();
        }
      }}
    />

    <button
      onClick={searchLocation}
      disabled={loading}
      className="rounded-lg bg-green-600 px-5 py-2 text-white transition hover:bg-green-700 disabled:opacity-60 dark:bg-green-500 dark:hover:bg-green-600"
    >
      {loading ? "Searching..." : "Find Route"}
    </button>

  </div>
);}