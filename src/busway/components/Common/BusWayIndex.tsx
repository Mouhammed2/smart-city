import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../auth/store/useAuth';

const BusWayIndex: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #ccc',
          borderTopColor: '#1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/busway/admin" replace />;
  }

  return <Navigate to="/busway/dashboard" replace />;
};

export default BusWayIndex;
