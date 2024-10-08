// CompanyRegister.jsx
import React, { useState } from "react";
import AuthService from "../AuthService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

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

export const CompanyRegister = () => {
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user,updateCompanyById, updateRole} = useUser();


  const handleRegister = async () => {
    try {
      AuthService.logout();
      console.log(user.id)
      await AuthService.companyRegister(company);
      updateCompanyById(user.id,company,user.token)
      setCompany("");
      updateRole(user.id,'CEO',user.token)
      navigate("/Company");
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
        <CardTitle className="text-xl">Create Company</CardTitle>
        <CardDescription>
          We just need a little bit of data about your company to get you
          started{" "}
          <span role="img" aria-label="rocket">
            🚀
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Company</Label>
              <Input
                id="company"
                placeholder="company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" onClick={handleRegister} className="w-full">
            Create a Company
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

export default CompanyRegister;
