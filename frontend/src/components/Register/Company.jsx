import React, { useState } from "react";
import AuthService from "../AuthService";
import { useUser } from "../UserContext";

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

export const Company = () => {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user,updateCompanyByMail} = useUser();

  const handleRegister = async () => {
    try {
        console.log(userEmail)
        console.log("@@@@@@@@@@@@@@@@@",user.company_name)
        updateCompanyByMail(userEmail,user.company_name,user.token)
        setUserEmail("");

    } catch (error) {
      setError("Registration failed: " + error.message);
    }
  };
  
  function backToTasks() {
    navigate("/todos");
  }
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up Workers</CardTitle>
        <CardDescription>
        Here you can sign Up your workers by their emails{" "}
          <span role="img" aria-label="rocket">
          📧
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">User Email</Label>
              <Input
                id="user_email"
                placeholder="user@email.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" onClick={handleRegister} className="w-full">
            Sign Up Worker
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Button type="submit" onClick={backToTasks} className="w-full">
            Back To Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Company;
