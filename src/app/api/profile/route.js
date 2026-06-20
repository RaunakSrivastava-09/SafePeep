import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request) {
try {
await connectDB();


const authHeader =
  request.headers.get("authorization");

if (!authHeader) {
  return NextResponse.json({
    success: false,
    message: "No token provided",
  });
}

const token =
  authHeader.split(" ")[1];

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

const user =
  await User.findById(
    decoded.id
  ).select(
    "-password"
  );

if (!user) {
  return NextResponse.json({
    success: false,
    message: "User not found",
  });
}

return NextResponse.json({
  success: true,
  user,
});


} catch (error) {
return NextResponse.json({
success: false,
error: error.message,
});
}
}
