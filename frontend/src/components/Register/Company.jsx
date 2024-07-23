import React, { useState, useEffect } from "react";
import AuthService from "../AuthService";
import { useUser } from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus, faCircleUser } from "@fortawesome/free-solid-svg-icons";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const Company = () => {
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, updateCompanyByMail, deleteCompanyByMail, updateRoleById } =
    useUser();
  const [companyUsers, setCompanyUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const roles = ["user", "admin"];

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      try {
        const users = await AuthService.getCompanyUsers(user.token);
        // Filter out the current user and CEO
        const filteredUsers = users.filter(
          (companyUser) => companyUser.email !== user.email && companyUser.role !== 'CEO'
        );
        setCompanyUsers(filteredUsers);
      } catch (error) {
        setError("Failed to fetch company users: " + error.message);
      }
    };
    fetchCompanyUsers();
  }, [user.token, user.email]);
  

  const handleRegister = async () => {
    console.log("Registering user:", userEmail, "Company:", user.company_name);
    try {
      const newUser = await updateCompanyByMail(
        userEmail,
        user.company_name,
        user.token,
      );
      if (newUser) {
        setCompanyUsers((prevUsers) => [...prevUsers, newUser]);
        setUserEmail("");
      } else {
        setError("Failed to add new user.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed: " + error.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const result = await deleteCompanyByMail(userId, user.token);
      if (result) {
        // Remove user from the list
        setCompanyUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== userId),
        );
      }
    } catch (error) {
      setError("Failed to delete user: " + error.message);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const result = await updateRoleById(userId, newRole, user.token);
      if (result) {
        setCompanyUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
        setSelectedRoles((prevRoles) => ({
          ...prevRoles,
          [userId]: newRole,
        }));
      }
    } catch (error) {
      setError("Failed to change role: " + error.message);
    }
  };

  const handleRoleSelect = (userId, role) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: role }));
    handleRoleChange(userId, role);
  };

  function backToTasks() {
    console.log(companyUsers);
    navigate("/todos");
  }

  return (
    <div>
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl">
            Welcome to {user.company_name} Company
          </CardTitle>
          <CardDescription>Here you can manage your employees </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companyUsers.map((companyUser) => (
              <div
                key={companyUser.id}
                className="flex items-center justify-between p-2 border-b border-gray-200"
              >
                <div className="flex-1">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label className="mr-2">User Name:</Label>
                      <Label>{companyUser.username}</Label>
                    </div>
                    <div className="flex items-center mt-1">
                      <Label className="mr-2">User Email:</Label>
                      <Label>{companyUser.email}</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center ml-4">
                  <Select
                    value={selectedRoles[companyUser.id] || companyUser.role}
                    onValueChange={(value) =>
                      handleRoleSelect(companyUser.id, value)
                    }
                  >
                    <SelectTrigger className="h-8 w-[100] lg:w-[120px]">
                      <span>
                        {selectedRoles[companyUser.id] ||"Select Role"|| companyUser.role}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center ml-4">
                  <FontAwesomeIcon
                    icon={faUserMinus}
                    className="text-gray-600 hover:text-red-500"
                    onClick={() => handleDelete(companyUser.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-3xl mt-4">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up Workers</CardTitle>
          <CardDescription>
            Here you can sign up your workers by their emails{" "}
            <span role="img" aria-label="rocket">
              📩
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
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
            <Button type="button" onClick={handleRegister} className="w-full">
              Sign Up Worker
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Button type="button" onClick={backToTasks} className="w-full">
              Back To Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Company;
