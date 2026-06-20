import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { calculateDestinationRisk } from "@/lib/destinationRisk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


function summarizeAlerts(alerts = []) {
  if (!Array.isArray(alerts) || alerts.length === 0) return "None";

  return alerts
    .slice(0, 3)
    .map(
      (a) =>
        `${a.type || "ALERT"} - ${a.message || a.severity || "No details"}`
    )
    .join(" | ");
}


function formatDestination(dest) {
  if (!dest || typeof dest !== "object") return null;

  return {
    name: dest.name || "Unknown",
    lat: Number(dest.lat),
    lon: Number(dest.lon),
  };
}


export async function POST(req) {
  try {
    const body = await req.json();

    const {
      question,
      riskScore,
      temperature,
      aqi,
      location,
      destination,
      destinationRisk,

      fireAlerts = [],
      earthquakeAlerts = [],
      floodAlerts = [],
      tsunamiAlerts = [],
      weatherAlerts = [],
    } = body;

    console.log("DESTINATION RISK RECEIVED:", destinationRisk);

    const dest = formatDestination(destination);

const destRisk =
  typeof destinationRisk === "object"
    ? destinationRisk.score
    : destinationRisk ?? 0;



const prompt = `
You are SafePeep AI, an intelligent environmental safety assistant.

Your job is to help users using ONLY the information below.

----------------------------------------------------
CURRENT CONDITIONS
----------------------------------------------------
Current Location:
${location || "Unknown"}

Current Risk Score:
${riskScore}/10

Temperature:
${temperature}°C

AQI:
${aqi}

----------------------------------------------------
DESTINATION
----------------------------------------------------
Destination:
${dest?.name || "Not selected"}

Latitude:
${dest?.lat || "N/A"}

Longitude:
${dest?.lon || "N/A"}

Destination Risk Score:
${destRisk}/10

----------------------------------------------------
ACTIVE HAZARDS
----------------------------------------------------

Fire:
${summarizeAlerts(fireAlerts)}

Earthquake:
${summarizeAlerts(earthquakeAlerts)}

Flood:
${summarizeAlerts(floodAlerts)}

Tsunami:
${summarizeAlerts(tsunamiAlerts)}

Weather:
${summarizeAlerts(weatherAlerts)}

----------------------------------------------------
USER QUESTION
----------------------------------------------------

${question}

----------------------------------------------------
IMPORTANT RULES
----------------------------------------------------

1. Use ONLY the supplied information.

2. Never invent hazards.

3. Never say:
- "I don't know"
- "Data is missing"
- "Unable to determine"

4. Destination Risk Score is already calculated.
NEVER calculate it again.

5. Current Risk Score applies only to the user's current location.

6. Destination Risk applies only to the destination.

7. Consider every active hazard together before answering.

----------------------------------------------------
UNDERSTAND THE USER'S QUESTION FIRST
----------------------------------------------------

If the user asks about:

• travelling
• destination safety
• "Can I go?"
• "Should I visit?"
• "Is it safe?"

Then provide:

Travel Verdict
Reason
Journey Advice
Destination Advice
Safety Tips

----------------------------------------

If the user asks about:

AQI

Explain AQI and how it affects them today.

----------------------------------------

If the user asks about:

temperature
heatwave

Explain heat risk and precautions.

----------------------------------------

If the user asks about:

fire

Explain only fire-related safety.

----------------------------------------

If the user asks about:

flood

Explain flood safety.

----------------------------------------

If the user asks about:

earthquake

Explain earthquake precautions.

----------------------------------------

If the user asks about:

tsunami

Explain tsunami precautions.

----------------------------------------

If the user asks:

"What precautions should I take today?"

Summarize today's risks using ALL hazards.

----------------------------------------

If the user asks any general safety question,

answer naturally using today's conditions.

----------------------------------------------------
TRAVEL CLASSIFICATION
----------------------------------------------------

Destination Risk

0-2
SAFE

3-5
MODERATE

6-8
UNSAFE

9-10
EXTREMELY UNSAFE

Use ONLY Destination Risk for this classification.

----------------------------------------------------
STYLE
----------------------------------------------------

• Friendly and natural
• Sound like a real safety expert
• Avoid repeating numbers unless useful
• Mention hazards only if they exist
• Keep responses under 180 words
• Use bullet points when helpful
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are SafePeep AI. You are a strict decision engine. Never hallucinate. Follow rules exactly.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message.content,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}