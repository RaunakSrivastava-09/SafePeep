import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();

    const authHeader =
      request.headers.get("authorization");

    const token =
      authHeader?.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user =
      await User.findById(decoded.id).select(
"notificationEnabled darkMode temperatureUnit defaultZoom"
)
    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const authHeader =
      request.headers.get("authorization");

    const token =
      authHeader?.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const body = await request.json();

    const user =
      await User.findByIdAndUpdate(
        decoded.id,
        {
        
        
  notificationEnabled: body.notificationEnabled,
  darkMode: body.darkMode,
  temperatureUnit: body.temperatureUnit,
  defaultZoom: body.defaultZoom,

        },
        {
          new: true,
        }
      );

    return NextResponse.json({
      success: true,
      data: user,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}