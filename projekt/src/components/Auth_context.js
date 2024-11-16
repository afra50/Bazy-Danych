// src/components/Auth_context.js
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("role") !== null
  );
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [userData, setUserData] = useState(
    JSON.parse(sessionStorage.getItem("userData")) || {}
  );

  const login = (userRole, data) => {
    setIsLoggedIn(true);
    setRole(userRole);
    sessionStorage.setItem("role", userRole);
    sessionStorage.setItem("userData", JSON.stringify(data));
    setUserData(data);

    // Przechowuj specyficzne identyfikatory
    if (userRole === "client") {
      sessionStorage.setItem("clientId", data.id_klienta);
      console.log("clientId ustawiony w sessionStorage:", data.id_klienta);
    } else if (userRole === "owner") {
      sessionStorage.setItem("ownerId", data.id_wlasciciela);
      console.log("ownerId ustawiony w sessionStorage:", data.id_wlasciciela);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUserData({});
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
