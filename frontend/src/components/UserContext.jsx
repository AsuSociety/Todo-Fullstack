import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./AuthService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      // Fetch initial user data here if needed
      setUser({ token });
    }
  }, []);

  const login = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData
    }));
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateUserProfile = (profileData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...profileData
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
