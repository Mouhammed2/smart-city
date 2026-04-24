import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../auth/components/protected-route';
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
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="new-report"
        element={
          <ProtectedRoute>
            <NewReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="tracking"
        element={
          <ProtectedRoute>
            <TrackingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="issue/:id"
        element={
          <ProtectedRoute>
            <IssueDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default FixMyCityRoutes;
