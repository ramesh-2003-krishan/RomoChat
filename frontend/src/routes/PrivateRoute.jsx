import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

const PrivateRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
