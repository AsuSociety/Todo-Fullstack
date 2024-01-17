// Login.js
import React, { useState } from "react";
import { useUser } from "../UserContext";
import AuthService from "../AuthService";

export const Login = ({ onLogin, onRegister }) => {
  console.log("Login  !!!!!");

  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userData = await AuthService.login(username, password);
      login(userData);
      onLogin(); // Call the onLogin callback
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="btn">
          Login
        </button>
      </div>
      <p className="register-message">
        Not registered?{" "}
        <button onClick={onRegister} className="btn">
          Register
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
