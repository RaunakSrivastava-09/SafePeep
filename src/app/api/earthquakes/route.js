import { NextResponse } from "next/server";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getDirection(lat1, lon1, lat2, lon2) {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  if (Math.abs(dLat) < 0.05 && Math.abs(dLon) < 0.05)
    return "Nearby";

  if (dLat > 0 && dLon > 0) return "North-East";
  if (dLat > 0 && dLon < 0) return "North-West";
  if (dLat < 0 && dLon > 0) return "South-East";

  return "South-West";
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const userLat = Number(searchParams.get("lat"));
    const userLon = Number(searchParams.get("lon"));

    if (Number.isNaN(userLat) || Number.isNaN(userLon)) {
      return NextResponse.json(
        {
          success: false,
          message: "Latitude and longitude required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      { cache: "no-store" }
    );

   const usgs = await response.json().catch(() => ({ features: [] }));

    const earthquakes = (usgs?.features || [])
      .map((quake) => {
        if (!quake?.geometry?.coordinates) return null;

        const lat = Number(quake.geometry.coordinates?.[1]);
        const lon = Number(quake.geometry.coordinates?.[0]);
        const depth = quake.geometry.coordinates?.[2];

        if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

        const distance = getDistance(
          userLat,
          userLon,
          lat,
          lon
        );
        if (distance > 500) return null;

        // ✅ FIX 1: block NaN distance
        if (Number.isNaN(distance)) return null;

       const mag = Number(quake.properties?.mag ?? 0);

        let severity = "Low";
        let radius = 30000;
        let color = "green";

        if (mag >= 7) {
          severity = "Extreme";
          radius = 150000;
          color = "#8B0000";
        } else if (mag >= 6) {
          severity = "High";
          radius = 100000;
          color = "red";
        } else if (mag >= 5) {
          severity = "Medium";
          radius = 60000;
          color = "orange";
        }

        
        const place =
          quake.properties?.place || "Unknown location";

        const locationText =
          place.includes("of")
            ? place
            : `${distance.toFixed(1)} km away near ${place}`;

        return {
          id: quake.id,
          lat,
          lon,
          magnitude: mag,
          depth,

          location: locationText,

          url: quake.properties?.url,
          time: new Date(quake.properties?.time).toLocaleString(),

          distance: Number(distance.toFixed(1)), 

          direction: getDirection(
            userLat,
            userLon,
            lat,
            lon
          ),

          severity,
          radius,
          color,
        };
      })
      .filter(Boolean)
      .filter((eq) => eq.magnitude >= 4.5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      count: earthquakes.length,
      data: earthquakes,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}