import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import EventsHandlerLayout from "./layout/EventsHandlerLayout";
import EventsHandlerIndex from "./components/Common/EventsHandlerIndex";
import AdminRoute from "./components/Common/AdminRoute";

const HomePage = React.lazy(() => import("./pages/home-page"));
const EventsPage = React.lazy(() => import("./pages/events-page"));
const MapPage = React.lazy(() => import("./pages/map-page"));
const AdminPage = React.lazy(() => import("./pages/admin-page"));
const CompanyPage = React.lazy(() => import("./pages/company-page"));
const ProfilePage = React.lazy(() => import("./pages/profile-page"));
const FavoritesPage = React.lazy(() => import("./pages/favorites-page"));
const NotificationsPage = React.lazy(
  () => import("./pages/notifications-page"),
);

const EventsHandlerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<EventsHandlerLayout />}>
        <Route index element={<EventsHandlerIndex />} />
        <Route path="dashboard" element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="company" element={<CompanyPage />} />
        <Route path="company/events" element={<CompanyPage />} />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Route>
    </Routes>
  );
};

export default EventsHandlerRoutes;
