import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { UserContext } from "../../../app/contexts.js";
import { useVerifyUser } from "../../auth/hooks/useVerifyUser.js";
import LogoutButton from "../../auth/components/LogoutButton.jsx";

function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
 
  useEffect(() => {
    const useCurrentUser = async () => {
      try {
        const res = await fetch("/api/users", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
          setUser(data.username); // update context if needed
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    useCurrentUser();
  }, [setUser]);

  useEffect(() => {
    fetch("/api/dashboard", {
      method: "GET",
      credentials: "include", // sends cookie
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/"); // unauthorized
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        navigate("/");
      });
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      {/* Top bar */}
      <div className="top-bar">
        <div className="top-right">
          <span className="balance">${balance}</span>
          <LogoutButton />
        </div>
      </div>
      <h2 className="welcome">👤{user}</h2>

      {/* Main buttons */}
      <div className="button-group">
        <a className="game" href="/game-settings"><button className="btn single">Одиночна гра</button></a>
        <a className="game" href="/online-settings"><button className="btn multi">Групова гра</button></a>
      </div>

    </div>
  );
}

export default Dashboard;
