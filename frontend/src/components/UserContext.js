// UserContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./AuthService";
// import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      setUser({ token });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    // navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
