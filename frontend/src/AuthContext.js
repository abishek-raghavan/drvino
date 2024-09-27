// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state is false

  const login = () => {
    // Logic to handle login
    setIsLoggedIn(true);
    // You can also add logic to save authentication tokens or user data in localStorage or cookies
  };

  const logout = () => {
    // Logic to handle logout
    setIsLoggedIn(false);
    // Clear any saved authentication tokens or user data from localStorage or cookies
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
