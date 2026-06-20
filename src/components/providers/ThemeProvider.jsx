"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    async function loadTheme() {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await fetch("/api/settings", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const data = await res.json();

        if (data.success) {
          document.documentElement.classList.toggle(
            "dark",
            data.data.darkMode
          );
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadTheme();
  }, []);

  return children;
}