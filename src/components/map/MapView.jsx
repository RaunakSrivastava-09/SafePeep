"use client";
import React from "react";
import "@/lib/fixLeafletIcon";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";



const isValidCoord = (lat, lon) =>
  typeof lat === "number" &&
  typeof lon === "number" &&
  !isNaN(lat) &&
  !isNaN(lon);

export default function MapView({
 
  latitude = 26.4499,
  longitude = 80.3319,
  riskScore = 8,
  temperature = 0,
aqi = 0,
destinationRisk = 0,
destination,
  address,

  layers = {
    fireLayers: [],
    earthquakeLayers: [],
    weatherLayers: [],
    floodLayers: [],
    tsunamiLayers: [],
    safeRoute: [],
  },
   
}) {

  let riskColor = "green";

  if (riskScore >= 7) riskColor = "red";
  else if (riskScore >= 5) riskColor = "orange";
  else riskColor = "green";

  const safeRouteCoords =
    layers.safeRoute
      ?.filter((p) => isValidCoord(p.lat, p.lon))
      .map((p) => [p.lat, p.lon]) || [];



console.log("Map safeRoute:", layers.safeRoute);

return (
  <div className="relative h-[650px] w-full overflow-hidden rounded-xl shadow-lg transition-colors dark:bg-gray-900">

    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Circle
        center={[latitude, longitude]}
        radius={700}
        pathOptions={{
          color: riskColor,
          fillColor: riskColor,
          fillOpacity: 0.25,
        }}
      />

      {layers.fireLayers?.filter((f) => isValidCoord(f.lat, f.lon)).map((fire) => (
        <React.Fragment key={`fire-${fire.id}`}>
          <Circle
            center={[fire.lat, fire.lon]}
            radius={fire.radius || 1000}
            pathOptions={{
              color: fire.color || "red",
              fillColor: fire.color || "red",
              fillOpacity: 0.3,
            }}
          />

          <Marker position={[fire.lat, fire.lon]}>
            <Popup className="dark:bg-gray-800 dark:text-white">
              <strong>🔥 Fire Detected</strong>
              <br />
              {fire.location}
              <br />
              Distance: {fire.distance?.toFixed(1) || "N/A"} km
              <br />
              Severity: {fire.severity}
            </Popup>
          </Marker>
        </React.Fragment>
      ))}

      {destination && (
        <>
          <Circle
            center={[destination.lat, destination.lon]}
            radius={700}
            pathOptions={{
              color:
                destinationRisk >= 7
                  ? "red"
                  : destinationRisk >= 5
                  ? "orange"
                  : "green",
              fillColor:
                destinationRisk >= 7
                  ? "red"
                  : destinationRisk >= 5
                  ? "orange"
                  : "green",
              fillOpacity: 0.25,
            }}
          />

          <Marker position={[destination.lat, destination.lon]}>
            <Popup className="dark:bg-gray-800 dark:text-white">
              <strong>📍 Destination</strong>
              <br />
              {destination.name}
              <br />
              Risk Score: {destinationRisk}/10
            </Popup>
          </Marker>
        </>
      )}

      <Marker position={[latitude, longitude]}>
        <Popup className="dark:bg-gray-800 dark:text-white">
          <strong>📍 Your Location</strong>
          <br />
          {address
            ? `${address.area},${address.city}, ${address.state}, ${address.country}`
            : "Fetching location..."}
          <br />
          Risk Score: {riskScore}/10
          <br />
          Temperature: {temperature}°C
          <br />
          AQI: {aqi}
          <br />
          Latitude: {latitude.toFixed(4)}
          <br />
          Longitude: {longitude.toFixed(4)}
        </Popup>
      </Marker>

      {safeRouteCoords.length > 1 && (
  <Polyline
    positions={safeRouteCoords}
    pathOptions={{
      color: "green",
      weight: 6,
      opacity: 0.9,
    }}
  />
)}
    </MapContainer>

    <div
      className="
        absolute z-[1000]

        bottom-0 left-0 right-0
        sm:bottom-auto sm:left-auto sm:right-4 sm:top-4

        w-full sm:w-60
        max-h-[45vh] sm:max-h-[60vh]
        overflow-y-auto

        rounded-t-2xl sm:rounded-xl
        bg-white/95 dark:bg-gray-900/90

        p-3 sm:p-4
        shadow-2xl sm:shadow-xl
        border dark:border-gray-700
        backdrop-blur-sm

        text-gray-800 dark:text-white
        text-xs sm:text-sm

        leading-snug
      "
    >
      <h2 className="text-sm sm:text-base font-bold mb-2 sm:mb-3">
        🗺️ Risk Legend
      </h2>

      <div className="mb-2 sm:mb-3">
        <h3 className="font-semibold mb-1 sm:mb-2">Overall Risk</h3>

        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Low Risk
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            Medium Risk
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            High Risk
          </div>
        </div>
      </div>

      <hr className="my-2 sm:my-3 border-gray-300 dark:border-gray-700" />

      <div className="mb-2 sm:mb-3">
        <h3 className="font-semibold mb-1 sm:mb-2">Hazards</h3>
        <div className="space-y-1">
          <div>🔥 Fire</div>
          <div>🌍 Earthquake</div>
          <div>🌦 Weather</div>
          <div>🌊 Flood</div>
          <div>🌊 Tsunami</div>
        </div>
      </div>

      <hr className="my-2 sm:my-3 border-gray-300 dark:border-gray-700" />

      <div>
        <h3 className="font-semibold mb-1 sm:mb-2">Navigation</h3>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          Safe Route
        </div>
      </div>
    </div>

  </div>
);}