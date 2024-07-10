// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./AuthService";

const UserContext = createContext();

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

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
