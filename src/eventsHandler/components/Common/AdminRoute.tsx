import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../auth/store/useAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/events/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
