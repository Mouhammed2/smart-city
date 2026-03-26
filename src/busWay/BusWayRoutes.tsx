import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import BusWayLayout from './layout/BusWayLayout';

const HomePage = React.lazy(() => import('./pages/home-page'));
const RoutesPage = React.lazy(() => import('./pages/routes-page'));
const StopsPage = React.lazy(() => import('./pages/stops-page'));
const AdminPage = React.lazy(() => import('./pages/admin-page'));

const BusWayRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BusWayLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/stops" element={<StopsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default BusWayRoutes;

