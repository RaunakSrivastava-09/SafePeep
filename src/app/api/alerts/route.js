import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get("authorization");


    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

   
const alerts = await Alert.find({
  userId: decoded.id,
  isActive: true,

}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: alerts,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}