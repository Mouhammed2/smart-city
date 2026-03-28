import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallback = <Navigate to="/busway" replace />,
}) => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

