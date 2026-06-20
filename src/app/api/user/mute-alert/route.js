import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function PUT(req) {
  await connectDB();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { type, minutes } = await req.json();

    const user = await User.findById(decoded.id);

    user.mutedAlerts = user.mutedAlerts || [];

  
    user.mutedAlerts.push({
      type,
      expiresAt: new Date(Date.now() + minutes * 60 * 1000),
    });

    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}