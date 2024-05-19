// Register.js
import React, { useState } from "react";
import { useUser } from "../UserContext";
import "./Register.css";

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
    <form>
      <h2>Welcome on board!</h2>
      <p>
        We just need a little bit of data from you to get you started{" "}
        <span role="img" aria-label="missle">
          🚀
        </span>
      </p>
      <div className="control-row">
        <div className="control no-margin">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="control no-margin">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <p className="form-actions">
        <button type="button" onClick={handleRegister} className="button">
          Register
        </button>
        <button type="button" onClick={onBackToLogin} className="button">
          Back to Login
        </button>
      </p>
      {/* <p className="form-actions">
        <button type="reset" className="button button-flat">
          Reset
        </button>
      </p> */}
    </form>
  );
};

export default Register;
