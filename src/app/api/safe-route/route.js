

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const startLat = searchParams.get("startLat");
    const startLon = searchParams.get("startLon");
    const endLat = searchParams.get("endLat");
    const endLon = searchParams.get("endLon");

    if (!startLat || !startLon || !endLat || !endLon) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing coordinates",
        },
        { status: 400 }
      );
    }

    if (!process.env.ORS_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "ORS_API_KEY not found in .env.local",
        },
        { status: 500 }
      );
    }

    const orsURL =
      `https://api.openrouteservice.org/v2/directions/driving-car` +
      `?api_key=${process.env.ORS_API_KEY}` +
      `&start=${startLon},${startLat}` +
      `&end=${endLon},${endLat}`;

    const response = await fetch(orsURL);

    const data = await response.json();

    console.log("ORS Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.error || "OpenRouteService Error",
          details: data,
        },
        { status: response.status }
      );
    }

    if (
      !data.features ||
      !data.features.length
    ) {
      return NextResponse.json({
        success: false,
        message: "No route found.",
        details: data,
      });
    }

    const route =
      data.features[0].geometry.coordinates.map(
        ([lon, lat]) => ({
          lat,
          lon,
        })
      );

    return NextResponse.json({
      success: true,
      route,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}