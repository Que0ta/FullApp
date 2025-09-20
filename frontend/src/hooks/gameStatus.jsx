import { useEffect, useState, useCallback } from "react";

export function getStatusGame() {
  const [gameStatus, setGameStatus] = useState(null);

  const getResult = useCallback(async () => {
    try {
      const response = await fetch("/api/get-results", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      setGameStatus(result);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getResult(); // fetched data
  }, [getResult]);

  return {getResult, gameStatus}
}
