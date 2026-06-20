import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = Number(searchParams.get("lat"));
    const longitude = Number(searchParams.get("lon"));

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json(
        {
          success: false,
          error: "Latitude and longitude required",
        },
        { status: 400 }
      );
    }

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current_weather=true` +
      `&hourly=precipitation,temperature_2m,weathercode` +
      `&timezone=auto`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch weather");
    }

    const data = await response.json();

    const current = data.current_weather;
    const hourly = data.hourly;

    const temperature = current?.temperature ?? 0;
    const windspeed = current?.windspeed ?? 0;
    const weathercode = current?.weathercode ?? 0;
    const precipitation = hourly?.precipitation?.[0] ?? 0;

    const weatherPayload = {
      temperature,
      windspeed,
      weathercode,
      precipitation,
    };

    const weatherLayers = [];

    // 🌡 Heatwave
    if (temperature >= 42) {
      weatherLayers.push({
        id: "heatwave",
        type: "HEATWAVE",
        message: "Extreme Heatwave",
        severity: "High",
        lat: latitude,
        lon: longitude,
        radius: 12000,
        color: "red",
      });
    } else if (temperature >= 38) {
      weatherLayers.push({
        id: "heat",
        type: "HEAT",
        message: "High Temperature",
        severity: "Medium",
        lat: latitude,
        lon: longitude,
        radius: 9000,
        color: "orange",
      });
    }

    // 🌪 Strong Wind
    if (windspeed >= 60) {
      weatherLayers.push({
        id: "wind-high",
        type: "WIND",
        message: "Severe Wind",
        severity: "High",
        lat: latitude,
        lon: longitude,
        radius: 15000,
        color: "#14b8a6",
      });
    } else if (windspeed >= 40) {
      weatherLayers.push({
        id: "wind-medium",
        type: "WIND",
        message: "Strong Wind",
        severity: "Medium",
        lat: latitude,
        lon: longitude,
        radius: 10000,
        color: "#22c55e",
      });
    }

    // 🌧 Rain
    if (precipitation >= 25) {
      weatherLayers.push({
        id: "flood",
        type: "FLOOD",
        message: "Flood Risk",
        severity: "High",
        lat: latitude,
        lon: longitude,
        radius: 18000,
        color: "#2563eb",
      });
    } else if (precipitation >= 10) {
      weatherLayers.push({
        id: "rain",
        type: "RAIN",
        message: "Heavy Rain",
        severity: "Medium",
        lat: latitude,
        lon: longitude,
        radius: 12000,
        color: "#3b82f6",
      });
    }

   
    if ([95, 96, 99].includes(weathercode)) {
      weatherLayers.push({
        id: "storm",
        type: "STORM",
        message: "Thunderstorm",
        severity: "High",
        lat: latitude,
        lon: longitude,
        radius: 15000,
        color: "#7c3aed",
      });
    }

   
    if ([71, 73, 75, 77, 85, 86].includes(weathercode)) {
      weatherLayers.push({
        id: "snow",
        type: "SNOW",
        message: "Heavy Snow",
        severity: "Medium",
        lat: latitude,
        lon: longitude,
        radius: 12000,
        color: "#93c5fd",
      });
    }

    if ([45, 48].includes(weathercode)) {
      weatherLayers.push({
        id: "fog",
        type: "FOG",
        message: "Dense Fog",
        severity: "Low",
        lat: latitude,
        lon: longitude,
        radius: 8000,
        color: "#9ca3af",
      });
    }

    return NextResponse.json({
      success: true,
      data: weatherPayload,
      weatherLayers,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}