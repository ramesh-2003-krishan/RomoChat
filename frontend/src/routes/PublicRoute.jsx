import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
