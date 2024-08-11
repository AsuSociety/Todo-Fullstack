// Login.js
import React, { useState } from "react";
import { useUser } from "../UserContext";
import AuthService from "../AuthService";
import { useNavigate } from "react-router-dom";

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

      localStorage.setItem("token", userData.token);
      localStorage.setItem("username", userData.username);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("first_name", userData.first_name);
      localStorage.setItem("last_name", userData.last_name);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("id", userData.id);
      localStorage.setItem("icon", userData.icon);
      localStorage.setItem("company_name", userData.company_name);

      navigate("/todos");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  function handleRegister() {
    navigate("/register");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
              Sign up
            </Button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
