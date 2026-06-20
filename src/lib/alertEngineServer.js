import Alert from "@/models/Alert";
import { getDistanceKm } from "@/lib/distance";

const COOLDOWN = 15 * 60 * 1000;


const recentTriggers = new Map();


function canTrigger(userId, type, zone = "global") {
  const key = `${userId}-${type}-${zone}`;
  const now = Date.now();

  if (!recentTriggers.has(key)) {
    recentTriggers.set(key, now);
    return true;
  }

  const last = recentTriggers.get(key);

  if (now - last > COOLDOWN) {
    recentTriggers.set(key, now);
    return true;
  }

  return false;
}

export async function generateAlertsServer({
  userId,
  riskId,
  temperature,
  aqi,
  latitude,
  longitude,
  weatherAlerts = [],
  earthquakeAlerts = [],
  fireAlerts = [],
  mutedAlertIds = [],
}) {

  if (!latitude || !longitude) {
    console.log("❌ Missing lat/lon - skipping alert engine");
    return [];
  }

  const newAlerts = [];

  const pushAlert = async (type, message, severity, eventId = null) => {
    const finalEventId = eventId || `${type}:${message}`;

    if (mutedAlertIds.includes(finalEventId)) return;

    if (!canTrigger(userId, finalEventId)) return;

    const exists = await Alert.findOne({
      userId,
      type,
      eventId: finalEventId,
      createdAt: {
        $gte: new Date(Date.now() - COOLDOWN),
      },
    });

    if (exists) {
      console.log("Alert already exists:", finalEventId);
      return;
    }

console.log(
  "Creating Alert:",
  type,
  message
);

newAlerts.push({
  userId,
  riskId,
  type,
  message,
  severity,
  eventId: finalEventId,
  isActive: true,
});
  };


if (temperature >= 45) {

  await Alert.updateMany(
    {
      userId,
      type: "HEATWAVE",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  await pushAlert(
    "EXTREME_HEAT",
    "Extreme heat detected. Stay indoors.",
    "High",
    "EXTREME_HEAT:GLOBAL"
  );

}
else if (temperature >= 40) {

  await Alert.updateMany(
    {
      userId,
      type: "EXTREME_HEAT",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  await pushAlert(
    "HEATWAVE",
    "Heatwave conditions detected. Avoid direct sunlight.",
    "Medium",
    "HEATWAVE:GLOBAL"
  );

}
else {

  await Alert.updateMany(
    {
      userId,
      type: { $in: ["HEATWAVE", "EXTREME_HEAT"] },
      isActive: true,
    },
    {
      isActive: false,
    }
  );

}


console.log("generateAlertsServer AQI:", aqi);

if (aqi >= 200) {

  
  await Alert.updateMany(
    {
      userId,
      type: "AQI",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  await pushAlert(
    "AQI_SEVERE",
    "Severe air pollution detected. Avoid outdoor activities.",
    "High",
    "AQI_SEVERE:GLOBAL"
  );

}
else if (aqi >= 150) {

 
  await Alert.updateMany(
    {
      userId,
      type: "AQI_SEVERE",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  await pushAlert(
    "AQI",
    "Poor air quality detected. Wear mask.",
    "Medium",
    "AQI:GLOBAL"
  );

}
else {

  await Alert.updateMany(
    {
      userId,
      type: { $in: ["AQI", "AQI_SEVERE"] },
      isActive: true,
    },
    {
      isActive: false,
    }
  );

}


if (Array.isArray(weatherAlerts) && weatherAlerts.length > 0) {

  for (const w of weatherAlerts) {
    await pushAlert(
      w.type,
      w.message,
      w.severity || "Medium",
      w.id || `${w.type}:${w.message}`
    );
  }

} else {

  await Alert.updateMany(
    {
      userId,
      type: { $in: ["RAIN", "STORM"] }, 
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  console.log("No active weather alerts");
}




if (Array.isArray(earthquakeAlerts) && earthquakeAlerts.length > 0) {

  for (const eq of earthquakeAlerts) {

    if (eq.magnitude < 4.5) continue;

    const distance = getDistanceKm(
      latitude,
      longitude,
      eq.latitude,
      eq.longitude
    );

   
    if (distance > 500) continue;

    let severity = "Low";

    if (distance <= 100)
      severity = "High";
    else if (distance <= 250)
      severity = "Medium";

    const eventId =
      eq.id ||
      `EQ:${eq.latitude}-${eq.longitude}-${eq.magnitude}`;

   const locationText =
  eq.locationName || eq.place || "nearby area";

const direction = eq.direction || ""; 

const message =
  `🌍 Earthquake detected near ${locationText} ${direction} (${distance.toFixed(1)} km from you)`;

    await pushAlert(
      "EARTHQUAKE",
      message,
      severity,
      eventId
    );
  }

} else {

  await Alert.updateMany(
    {
      userId,
      type: "EARTHQUAKE",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  console.log("No earthquake alerts");
}


if (Array.isArray(fireAlerts) && fireAlerts.length > 0) {

  for (const fire of fireAlerts) {

    const distance = getDistanceKm(
      latitude,
      longitude,
      fire.lat,
      fire.lon
    );

  
    if (distance > 30) continue;

    let severity = "Low";

    if (distance <= 5)
      severity = "High";
    else if (distance <= 15)
      severity = "Medium";

    const eventId =
      fire.id ||
      `FIRE:${fire.lat}-${fire.lon}`;

 const locationText = fire.locationName || "nearby area";

const message =
  `🔥 Fire detected at ${locationText} (${distance.toFixed(1)} km from you)`;

    await pushAlert(
      "FIRE",
      message,
      severity,
      eventId
    );
  }

} else {

  await Alert.updateMany(
    {
      userId,
      type: "FIRE",
      isActive: true,
    },
    {
      isActive: false,
    }
  );

  console.log("No fire alerts");
}
 // 💾 SAVE + EMIT
console.log("newAlerts before save:", newAlerts.length);

// EXIT early if nothing to save
if (newAlerts.length === 0) {
  return [];
}

try {
  const saved = await Alert.insertMany(newAlerts);
  console.log("Saved alerts:", saved.length);

  // emit realtime alerts
  if (global.io) {
    saved.forEach((alert) => {
      global.io.to(userId.toString()).emit("new-alert", alert);
    });
  }

  return saved;
} catch (err) {
  console.error("INSERT ERROR:", err);
  return [];
}
}