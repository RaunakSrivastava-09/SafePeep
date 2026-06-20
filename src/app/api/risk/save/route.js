import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import RiskHistory from "@/models/RiskHistory";
import { generateAlertsServer } from "@/lib/alertEngineServer";

export async function POST(request) {
  try {
    await connectDB();

 const authHeader = request.headers.get("authorization");

if (!authHeader) {
  return NextResponse.json({ success: false, message: "No token" }, { status: 401 });
}

const token = authHeader.split(" ")[1];

let decoded;
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  return NextResponse.json({ success: false, message: "Token expired" }, { status: 401 });
}
;

    const body = await request.json();
    console.log("User Location:", body.latitude, body.longitude);
    console.log("Temperature:", body.temperature);
console.log("AQI:", body.aqi);
console.log("Risk Score:", body.riskScore);

   
    const riskData = await RiskHistory.create({
      userId: decoded.id,
      riskScore: body.riskScore,
      temperature: body.temperature,
      aqi: body.aqi,
    });

   
console.log("Fetching weather alerts...");

let weatherAlerts = [];

try {
  const weatherRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/weather-alerts?lat=${body.latitude}&lon=${body.longitude}`
  );

  const weatherJson = await weatherRes.json();

  if (weatherJson.success && Array.isArray(weatherJson.data)) {
    weatherAlerts = weatherJson.data;
  }

  console.log("Weather alerts fetched:", weatherAlerts.length);
} catch (err) {
  console.log("Weather fetch failed:", err.message);
}

console.log("Fetching earthquake alerts...");

let earthquakeAlerts = [];

try {
  const eqRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/earthquakes`
  );

  const eqJson = await eqRes.json();

  if (eqJson.success && Array.isArray(eqJson.data)) {
    earthquakeAlerts = eqJson.data;
  }

  console.log("Earthquake alerts fetched:", earthquakeAlerts.length);
} catch (err) {
  console.log("Earthquake fetch failed:", err.message);
}

console.log("Fetching fire alerts...");

let fireAlerts = [];

try {
  const fireRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/fire-alerts`
  );

  const fireJson = await fireRes.json();

  if (fireJson.success && Array.isArray(fireJson.data)) {
    fireAlerts = fireJson.data;
  }

  console.log("Fire alerts fetched:", fireAlerts.length);
} catch (err) {
  console.log("Fire fetch failed:", err.message);
}



console.log("Calling generateAlertsServer...");
   
   await generateAlertsServer({
  userId: decoded.id,
  riskId: riskData._id,

  temperature: body.temperature,
  aqi: body.aqi,
  riskScore: body.riskScore,


  latitude: body.latitude,
  longitude: body.longitude,

  weatherAlerts:
    weatherAlerts?.data || weatherAlerts || [],

  earthquakeAlerts:
    earthquakeAlerts?.data ||
    earthquakeAlerts ||
    [],

  fireAlerts:
    fireAlerts?.data || fireAlerts || [],
});

console.log("generateAlertsServer finished");

    return NextResponse.json({
      success: true,
      data: riskData,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}