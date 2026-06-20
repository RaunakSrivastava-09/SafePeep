
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocation from "@/hooks/useLocation";
import { getLocationName } from "@/lib/reverseGeocode";

export default function Navbar({ setSidebarOpen }) {
  const router = useRouter();
  const { latitude, longitude } = useLocation();

  const [locationName, setLocationName] = useState({
    city: "",
    area: "",
  });

  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  useEffect(() => {
    async function fetchLocation() {
      if (!latitude || !longitude) return;

      try {
        setLoading(true);

        const data = await getLocationName(latitude, longitude);

        setLocationName({
          city: data.city,
          area: data.area,
        });
      } catch (err) {
        console.error(err);

        setLocationName({
          city: "Unknown",
          area: "",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [latitude, longitude]);


return (
  <header className="
    sticky top-0 z-50
    flex flex-col sm:flex-row
    items-start sm:items-center
    justify-between
    gap-2 sm:gap-0
    border-b border-border
    bg-gradient-to-r from-card to-card/80
    px-4 sm:px-6 py-3
    shadow-sm transition-colors
  ">
      <button
    className="md:hidden text-2xl mr-2"
    onClick={() => setSidebarOpen(true)}
  >
    ☰
  </button>

    <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
      SafePeep • Local Risk Intelligence
    </h2>

    <p className="
      hidden md:block
      rounded-full bg-muted
      px-3 py-1 text-sm text-muted-foreground
    ">
      📍{" "}
      {loading
        ? "Detecting location..."
        : `${locationName.city}${
            locationName.area ? `, ${locationName.area}` : ""
          }`}
    </p>

    <div className="flex w-full sm:w-auto items-center justify-end gap-3">

      <button
        onClick={handleLogout}
        className="
          w-full sm:w-auto
          rounded-lg bg-red-500
          px-4 py-2 text-sm font-semibold text-white
          shadow-sm transition
          hover:bg-red-600 hover:shadow-md active:scale-95
        "
      >
        Logout
      </button>

    </div>

  </header>
);
}