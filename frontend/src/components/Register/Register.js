import React, { useState } from "react";
import AuthService from "../AuthService";
import "./Register.css";

export const Register = ({ onBackToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      // Clear any existing session data or tokens
      AuthService.logout();

      // Perform registration
      await AuthService.register(
        email,
        username,
        password,
        firstName,
        lastName,
        role
      );

      // Reset input fields after successful registration
      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("");

      // Navigate back to login screen or any other logic
      onBackToLogin();
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <form>
      <h2>Welcome on board!</h2>
      <p>
        We just need a little bit of data from you to get you started{" "}
        <span role="img" aria-label="rocket">
          🚀
        </span>
      </p>

      {error && <p className="error">{error}</p>}

      <div className="control-row">
        <div className="control no-margin">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

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
      <hr />

      <div className="control-row">
        <div className="control no-margin">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="control no-margin">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="control no-margin">
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
    </form>
  );
};

export default Register;
