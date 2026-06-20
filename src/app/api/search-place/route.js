import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`,
      {
        headers: {
          "User-Agent": "SafePeep/1.0",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}