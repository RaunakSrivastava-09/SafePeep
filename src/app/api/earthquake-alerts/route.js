import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { generateEarthquakeAlerts } from "@/lib/earthquakeAlertsJob";

export async function POST(request) {
  try {
    await connectDB();

    const auth = request.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ success: false, message: "No token" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await request.json();

    const { latitude, longitude, earthquakes } = body;

    const alerts = await generateEarthquakeAlerts({
      userId: decoded.id,
      latitude,
      longitude,
      earthquakes,
    });

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}