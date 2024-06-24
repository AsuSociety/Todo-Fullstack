// Login.js
import React, { useState } from "react";
import { useUser } from "../UserContext";
import AuthService from "../AuthService";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

export const Login = () => {
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = await AuthService.login(username, password);
      login(userData);
      navigate("/todos");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  function handleRegister() {
    navigate("/register");
  }

  return (
    <form>
      <h2>Login</h2>
      <div className="control-row">
        <div className="control no-margin">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="control no-margin">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <p className="form-actions">
        <label>Not registered?</label>
        <button type="button" onClick={handleRegister} className="button">
          Register
        </button>
        <button type="button" onClick={handleLogin} className="button">
          Login
        </button>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Login;
