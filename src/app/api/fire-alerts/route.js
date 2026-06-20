import { NextResponse } from "next/server";
import { getLocationName } from "@/lib/reverseGeocode";

const apiKey = process.env.NASA_FIRMS_MAP_KEY;

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = Number(searchParams.get("lat"));
    const lon = Number(searchParams.get("lon"));

   if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json(
        {
          success: false,
          message: "Latitude and longitude are required.",
        },
        { status: 400 }
      );
    }

    const minLat = lat - 2;
    const maxLat = lat + 2;
    const minLon = lon - 2;
    const maxLon = lon + 2;

    const days = 1;

   const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/${minLon},${minLat},${maxLon},${maxLat}/${days}`;
console.log("FIRE API URL:", url);
    const response = await fetch(url);

    const csv = await response.text();
    console.log("CSV RESPONSE:", csv);

    const lines = csv.trim().split("\n");

    if (lines.length <= 1) {
      return NextResponse.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const headers = lines[0].split(",");
const fires = (await Promise.all(
  lines.slice(1).map(async (line, index) => {
    const values = line.split(",");

    const fire = {};

    headers.forEach((header, i) => {
      fire[header] = values[i];
    });

    const fireLat = Number(fire.latitude);
    const fireLon = Number(fire.longitude);

    const distance = getDistanceKm(
      lat,
      lon,
      fireLat,
      fireLon
    );

    // 🔥 FIRE RANGE FIX
    if (distance > 100) return null;

    const frp = Number(fire.frp);

    const locationData = await getLocationName(
      fireLat,
      fireLon
    );

    return {
      id: `fire-${index + 1}`,
      lat: fireLat,
      lon: fireLon,
      distance,
      brightness: Number(fire.bright_ti4),
      frp,
      radius: 1000,
      color:
        frp > 20
          ? "red"
          : frp > 10
          ? "orange"
          : "green",
      severity:
        frp > 20
          ? "High"
          : frp > 10
          ? "Medium"
          : "Low",
      location: locationData.area
        ? `Near ${locationData.area}, ${locationData.city}`
        : `Near ${locationData.city}`,
    };
  })
)).filter(Boolean);

    return NextResponse.json({
      success: true,
      count: fires.length,
      data: fires,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}