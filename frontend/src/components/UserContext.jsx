// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./AuthService";

const UserContext = createContext();
export const API_URL = "http://localhost:8000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
    // console.log('Fetched%%%%%%%%%%% user:', userData); // Log userData
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
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
        throw new Error(
          `Failed to update company name: ${response.status} - ${response.statusText}`,
        );
      }

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
      const response = await fetch(`${API_URL}/auth/mail/${userMail}/company`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ company_name: company_name }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update company name: ${response.status} - ${response.statusText}`,
        );
      }

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


  return (
    <UserContext.Provider value={{ user, login, logout, updateIcon, updateCompanyById, updateCompanyByMail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
