import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import RiskHistory from "@/models/RiskHistory";

export async function GET(request) {
  try {
    await connectDB();

    const authHeader =
      request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: "No token",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const history =
      await RiskHistory.find({
        userId: decoded.id,
      })
        .sort({ createdAt: -1 })
        .limit(20);

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}