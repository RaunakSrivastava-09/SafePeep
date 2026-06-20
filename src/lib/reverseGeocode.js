export async function getLocationName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "safepeep-app/1.0",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Reverse geocode failed");
    }

    const data = await res.json();

    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.county;

    const area =
      address.suburb ||
      address.neighbourhood ||
      address.hamlet ||
      address.locality;

    return {
      city: city || "Unknown City",
      area: area || "",
      full: data.display_name || "",
    };
  } catch (err) {
    console.error("Reverse geocode error:", err);

    return {
      city: "Unknown City",
      area: "",
      full: "",
    };
  }
}