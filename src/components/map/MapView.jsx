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

     
      {layers.fireLayers
        ?.filter((f) => isValidCoord(f.lat, f.lon))
        .map((fire) => (
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

  
      {layers.earthquakeLayers
        ?.filter((eq) => isValidCoord(eq.lat, eq.lon))
        .map((eq) => (
          <React.Fragment key={`earthquake-${eq.id}`}>
            <Circle
              center={[eq.lat, eq.lon]}
              radius={eq.radius || 30000}
              pathOptions={{
                color: eq.color || "purple",
                fillColor: eq.color || "purple",
                fillOpacity: 0.2,
              }}
            />

            <Marker position={[eq.lat, eq.lon]}>
              <Popup className="dark:bg-gray-800 dark:text-white">
                <strong>🌍 Earthquake</strong>
                <br />
                {eq.location}
                <br />
                Magnitude: {eq.magnitude}
                <br />
                Distance: {eq.distance?.toFixed(1) || "N/A"} km
                <br />
                Direction: {eq.direction}
                <br />
                Severity: {eq.severity}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

     
      {layers.weatherLayers
        ?.filter((z) => isValidCoord(z.lat, z.lon))
        .map((zone) => (
          <React.Fragment key={`weather-${zone.id}`}>
            <Circle
              center={[zone.lat, zone.lon]}
              radius={zone.radius || 5000}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.18,
              }}
            />

            <Marker position={[zone.lat, zone.lon]}>
              <Popup className="dark:bg-gray-800 dark:text-white">
                <strong>🌦 Weather Hazard</strong>
                <br />
                {zone.message}
                <br />
                Severity: {zone.severity}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

   
      {layers.floodLayers
        ?.filter((f) => isValidCoord(f.lat, f.lon))
        .map((flood) => (
          <React.Fragment key={`flood-${flood.id}`}>
            <Circle
              center={[flood.lat, flood.lon]}
              radius={flood.radius || 8000}
              pathOptions={{
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.22,
              }}
            />

            <Marker position={[flood.lat, flood.lon]}>
              <Popup className="dark:bg-gray-800 dark:text-white">
                <strong>🌊 Flood Warning</strong>
                <br />
                {flood.message}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

    
      {layers.tsunamiLayers
        ?.filter((t) => isValidCoord(t.lat, t.lon))
        .map((tsunami) => (
          <React.Fragment key={`tsunami-${tsunami.id}`}>
            <Circle
              center={[tsunami.lat, tsunami.lon]}
              radius={tsunami.radius || 20000}
              pathOptions={{
                color: "#00BCD4",
                fillColor: "#00BCD4",
                fillOpacity: 0.2,
              }}
            />

            <Marker position={[tsunami.lat, tsunami.lon]}>
              <Popup className="dark:bg-gray-800 dark:text-white">
                <strong>🌊 Tsunami Warning</strong>
                <br />
                {tsunami.message}
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

      {/* ================= SAFE ROUTE ================= */}
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
    </MapContainer>

   
    <div   className="
    absolute z-[1000]
    top-2 right-2 sm:top-4 sm:right-4
    bottom-2 sm:bottom-auto
    w-40 sm:w-60
    max-h-[60vh] overflow-y-auto
    rounded-xl bg-white/95 dark:bg-gray-900/90
    p-3 sm:p-4 shadow-xl border dark:border-gray-700
    backdrop-blur-sm text-gray-800 dark:text-white
    text-xs sm:text-sm
  ">

      <h2 className="text-base font-bold mb-3">
        🗺️ Risk Legend
      </h2>

      <div className="mb-3">
        <h3 className="font-semibold mb-2">
          Overall Risk
        </h3>

        <div className="space-y-2">
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

      <hr className="my-3 border-gray-300 dark:border-gray-700" />

      <div className="mb-3">
        <h3 className="font-semibold mb-2">
          Hazards
        </h3>

        <div className="space-y-1">
          <div>🔥 Fire</div>
          <div>🌍 Earthquake</div>
          <div>🌦 Weather</div>
          <div>🌊 Flood</div>
          <div>🌊 Tsunami</div>
        </div>
      </div>

      <hr className="my-3 border-gray-300 dark:border-gray-700" />

      <div>
        <h3 className="font-semibold mb-2">
          Navigation
        </h3>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600"></span>
          Safe Route
        </div>
      </div>

    </div>

  </div>
);}