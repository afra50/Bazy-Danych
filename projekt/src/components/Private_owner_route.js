// Private_owner_route.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function Private_owner_route({ children }) {
  const role = sessionStorage.getItem("role");
  const location = useLocation();

  if (role !== "owner") {
    return <Navigate to="/SignInAsOwner" replace state={{ from: location }} />;
  }

  return children;
}

export default Private_owner_route;
