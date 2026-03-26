import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import {DashboardPage} from "./pages/dashboard-page";
import {NewReportPage} from "./pages/new-report-page";
import {IssueDetailPage} from "./pages/issue-detail-page";
import {TrackingPage} from "./pages/tracking-page";

const FixMyCityRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute fallback={<Navigate to="/login" replace />}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="new-report"
        element={
          <ProtectedRoute fallback={<Navigate to="/login" replace />}>
            <NewReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="tracking"
        element={
          <ProtectedRoute fallback={<Navigate to="/login" replace />}>
            <TrackingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="issue/:id"
        element={
          <ProtectedRoute fallback={<Navigate to="/login" replace />}>
            <IssueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default FixMyCityRoutes;
