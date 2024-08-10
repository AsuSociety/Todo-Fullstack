import React, { useState, useEffect } from "react";
import AuthService from "../AuthService";
import { useUser } from "../UserContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"

export const AddAssignees = ({ updateAssignees, task, selectedAssignees,setSelectedAssignees }) => {
  const { user } = useUser();
  const [companyUsers, setCompanyUsers] = useState([]);
//   const [selectedAssignees, setSelectedAssignees] = useState([]);

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      try {
        const users = await AuthService.getCompanyUsers(user.token);
        // Filter out the current user
        const filteredUsers = users.filter(
          (companyUser) => companyUser.email !== user.email
        );
        setCompanyUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch company users: ", error);
      }
    };
    fetchCompanyUsers();
  }, [user.token, user.email]);

  const handleAssigneeChange = (userId) => {
    updateAssignees(task.id, userId);
    setSelectedAssignees(userId);

  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Select Assignees</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Assignees</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {companyUsers.map((companyUser) => (
          <DropdownMenuCheckboxItem
            key={companyUser.id}
            checked={(companyUser.id)} 
            onCheckedChange={() => handleAssigneeChange(companyUser.id)}
          >
            {companyUser.firstname} {companyUser.lastname}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
