import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function Private_client_route({ children }) {
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (role !== "client") {
    return <Navigate to="/SignIn" replace state={{ from: location }} />;
  }

  return children;
}

export default Private_client_route;
