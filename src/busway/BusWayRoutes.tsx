import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import BusWayLayout from "./layout/BusWayLayout";
import BusWayIndex from "./components/Common/BusWayIndex";
import AdminRoute from "./components/Common/AdminRoute";

const HomePage = React.lazy(() => import("./pages/home-page"));
const RoutesPage = React.lazy(() => import("./pages/routes-page"));
const StopsPage = React.lazy(() => import("./pages/stops-page"));
const BusesPage = React.lazy(() => import("./pages/buses-page/index"));
const SchedulesPage = React.lazy(() => import("./pages/schedules-page/index"));
const AdminPage = React.lazy(() => import("./pages/admin-page"));

const BusWayRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BusWayLayout />}>
        <Route index element={<BusWayIndex />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="stops" element={<StopsPage />} />
        <Route path="buses" element={<BusesPage />} />
        <Route path="schedules" element={<SchedulesPage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/busway" replace />} />
      </Route>
    </Routes>
  );
};

export default BusWayRoutes;
