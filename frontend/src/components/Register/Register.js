// Register.js
import React, { useState } from "react";
import { useUser } from "../UserContext";

export const Register = ({ onBackToLogin }) => {
  console.log("Register  !!!!!"); // Add this line

  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // Implement registration logic (e.g., make a request to your backend)
    const userData = { username, password };
    // Assume a successful registration returns user data
    login(userData);
    // Go back to login
    onBackToLogin();
  };

  return (
    <div>
      <h2>Register Page</h2>
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
      <button onClick={handleRegister} className="btn">
        Register
      </button>
      <button onClick={onBackToLogin} className="btn">
        Back to Login
      </button>
    </div>
  );
};

export default Register;
