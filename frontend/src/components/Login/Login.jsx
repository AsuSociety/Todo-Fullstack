// Login.js
import React, { useState } from "react";
import { useUser } from "../UserContext";
import AuthService from "../AuthService";
import { useNavigate } from "react-router-dom";
// import "./Login.css";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  function handleCompanyRegister() {
    navigate("/companyregister");
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your Username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="Username">Username</Label>
            <Input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button type="submit" onClick={handleRegister} className="w-full">
            Sign up as User
          </Button>
        </div>
        {/* <div className="mt-4 text-center text-sm">
          <Button type="submit" onClick={handleCompanyRegister} className="w-full">
            Sign up as Company
          </Button>
        </div> */}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </CardContent>
    </Card>
  );
};

export default Login;
