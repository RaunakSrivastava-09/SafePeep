"use client";

import { useEffect, useState } from "react";

export default function useRiskHistory() {
  const [history, setHistory] =
    useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response =
          await fetch(
            "/api/risk/history"
          );

        const data =
          await response.json();

        setHistory(data.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchHistory();
  }, []);

  return history;
}