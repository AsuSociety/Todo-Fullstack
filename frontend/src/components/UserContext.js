import React, { createContext, useContext, useState } from "react";

// Step 1: Create a context
const UserContext = createContext();

// Step 2: Create a provider component
export const UserProvider = ({ children }) => {
  // Step 3: Define state and functions related to user data
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Implement login logic (e.g., authentication with a backend)
    setUser(userData);
  };

  const logout = () => {
    // Implement logout logic
    setUser(null);
  };

  // Step 4: Provide the context value to the wrapped components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Step 5: Create a hook to access the context value
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
