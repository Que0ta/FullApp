import { useState, useCallback, useEffect } from "react";

export function fetchUserData() {
  const [currentUser, setCurrentUser] = useState("");

  const getUser = useCallback(async () => {
    try {
      const res = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.username); // update context if needed
      } else {
        console.log("Failed to fetch user data");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }, []);

  useEffect(() => {
    getUser(); // fetched data
  }, [getUser]);

  return { currentUser, getUser };
}
