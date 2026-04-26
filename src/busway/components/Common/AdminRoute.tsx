import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/store/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/busway" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
