import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("role") !== null
  );
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  const login = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    sessionStorage.setItem("role", userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
