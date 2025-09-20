import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function LogoutButton() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // send cookie to delete
      });

      const data = await res.json();
      // Clear user state and redirect
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return <button className="logout" onClick={handleLogout}>Вихід</button>;
}

export default LogoutButton;
