import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyUser } from "../hooks/verifyUser";

function Registration() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useVerifyUser("/dashboard");

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ login, password }),
      });
      navigate("/"); // redirect after register
    } catch (err) {
      navigate("/"); // error handling needs to be added!
    }
  };

  return (
    <div className="login-container">
      <h2>Register an account</h2>
      <form className="login-form" onSubmit={handleSubmitRegister}>
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
        <button type="submit">Register</button>
      </form>
      <a className="register" href="/">
        Log in
      </a>
    </div>
  );
}

export default Registration;
