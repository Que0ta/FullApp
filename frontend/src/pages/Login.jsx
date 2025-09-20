import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyUser } from "../hooks/verifyUser";
import { UserContext } from "../App";
import "./Login.css";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  // ✅ Check if user is already logged in
  useVerifyUser("/dashboard");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();
      setStatus(data.status);

      if (data.status === "logged") {
        setUser(data.user); // update context
        navigate("/dashboard"); // redirect after login
      }
    } catch (err) {
      setStatus("network error");
    }
  };


  return (
    <div className="login-container">
      <h2>Log into account</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <a className="register" href="/register">
        Register
      </a>

      {status ? (
        <div className="status-message">
          {status === "not" && (
            <span className="not-found">Логіну не знайдено!</span>
          )}
          {status === "network error" && (
            <span className="not-found">Помилка мережі!</span>
          )}
          {status === "pass" && (
            <span className="not-found">Неправильний пароль!</span>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Login;
