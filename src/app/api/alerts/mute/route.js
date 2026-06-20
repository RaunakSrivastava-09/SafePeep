
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Alert from "@/models/Alert";
import jwt from "jsonwebtoken";

export async function PATCH(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { eventId } = await req.json();

  await Alert.updateOne(
  {
    userId: decoded.id,
    eventId: eventId,   
  },
  {
    $set: {
      isMuted: true,
    },
  }
);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}