import { useState } from "react";

export function deleteLobby() {
  const [error, setError] = useState(null);

  const lobbyReset = async () => {
    try {
      const res = await fetch("/api/reset-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      return await res.json();
    } catch (err) {
      setError(err);
      console.error(err);
      throw err; 
    }
  };

  return { lobbyReset, error };
}
