import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../auth/components/protected-route';
import {DashboardPage} from "./pages/dashboard-page";
import {NewReportPage} from "./pages/new-report-page";
import {IssueDetailPage} from "./pages/issue-detail-page";
import {TrackingPage} from "./pages/tracking-page";
import { AdminPage } from './pages/admin-page';

const FixMyCityRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="new-report" element={<NewReportPage />} />
      <Route path="tracking" element={<TrackingPage />} />
      <Route path="issue/:id" element={<IssueDetailPage />} />
      <Route
        path="admin"
        element={
          <ProtectedRoute requireAdmin fallback={<Navigate to="/fixmycity" replace />}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default FixMyCityRoutes;
