// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./AuthService";

const UserContext = createContext();
export const API_URL = "http://localhost:8000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      // Retrieve all user information from localStorage
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const firstName = localStorage.getItem("first_name");
      const lastName = localStorage.getItem("last_name");
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("id");
      const icon = localStorage.getItem("icon");
      const company_name = localStorage.getItem("company_name");

      setUser({
        token,
        username,
        email,
        firstName,
        lastName,
        role,
        id,
        icon,
        company_name,
      });
    }
    setLoading(false); // Set loading to false once the check is done
  }, []);

  const login = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
    // Store user information in localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("first_name", userData.first_name);
    localStorage.setItem("last_name", userData.last_name);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("icon", userData.icon);
    localStorage.setItem("company_name", userData.company_name);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    // Clear user information from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("icon");
    localStorage.removeItem("company_name");
  };

  const updateIcon = async (userId, icon, token) => {
    try {
      const response = await fetch(`${API_URL}/auth/${userId}/icon`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ icon: icon }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update icon: ${response.status} - ${response.statusText}`,
        );
      }

      const result = await response.json();
      // console.log( icon);
      setUser((prevUser) => ({
        ...prevUser,
        icon: icon, // Assuming the response contains the new icon
      }));
      return result;
    } catch (error) {
      console.error("Error updating icon:", error);
      return null;
    }
  };

  const updateRole = async (userId, role, token) => {
    try {
      const response = await fetch(`${API_URL}/auth/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: role }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update role: ${response.status} - ${response.statusText}`,
        );
      }

      const result = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        role: role,
      }));
      return result;
    } catch (error) {
      console.error("Error updating role:", error);
      return null;
    }
  };

  // Function to update the user's company name
  const updateCompanyById = async (userId, company_name, token) => {
    try {
      const response = await fetch(`${API_URL}/auth/id/${userId}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ company_name: company_name }),
      });

      if (!response.ok) {
        const errorDetails = await response.text(); // Get response text for more details
        throw new Error(
          `Failed to update company name: ${response.status} - ${response.statusText}. Details: ${errorDetails}`,
        );
      }
      console.log("fooooooooooooooooo");
      const result = await response.json();
      // console.log( icon);
      setUser((prevUser) => ({
        ...prevUser,
        company_name: company_name,
      }));
      return result;
    } catch (error) {
      console.error("Error updating company name:", error);
      return null;
    }
  };

  const updateCompanyByMail = async (userMail, company_name, token) => {
    try {
      const response = await fetch(
        `${API_URL}/admin/mail/${userMail}/company`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ company_name: company_name }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update company name: ${response.status} - ${response.statusText}`,
        );
      }

      const result = await response.json();
      // console.log("Result from API:", result); // Check what you are receiving from the API

      // Assuming result contains user details
      setUser((prevUser) => ({
        ...prevUser,
        company_name: company_name,
      }));
      return result; // Ensure this contains the full user details
    } catch (error) {
      console.error("Error updating company name:", error);
      return null;
    }
  };

  const updateRoleById = async (userId, role, token) => {
    try {
      const response = await fetch(`${API_URL}/admin/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: role }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update role: ${response.status} - ${response.statusText}`,
        );
      }

      const result = await response.json();
      // console.log("Result from API:", result); // Check what you are receiving from the API

      setUser((prevUser) => ({
        ...prevUser,
        role: role,
      }));
      return result; // Ensure this contains the full user details
    } catch (error) {
      console.error("Error updating role:", error);
      return null;
    }
  };

  const deleteCompanyByMail = async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/admin/company/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete user from company: ${response.status} - ${response.statusText}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting user from company:", error);
      return null;
    }
  };

  const getUserById = async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/auth/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user: ${response.status} - ${response.statusText}`,
        );
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateIcon,
        updateRole,
        updateCompanyById,
        updateCompanyByMail,
        deleteCompanyByMail,
        updateRoleById,
        getUserById,
      }}
    >
      {!loading ? children : <div>Loading...</div>}{" "}
      {/* Show loading indicator while loading */}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
