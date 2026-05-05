import React, { useState } from "react";
import API from "./api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const res = await API.post("/register", {
        email: email.trim().toLowerCase(),
        password
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const login = async () => {
    try {
      const res = await API.post("/login", {
        email: email.trim().toLowerCase(),
        password
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2>Login System</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button onClick={login}>Login</button>
        <button onClick={register} style={{ marginLeft: "10px" }}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;