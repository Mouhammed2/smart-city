import React, { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from 'busway/store/store';

import ErrorBoundary from 'busway/components/Common/ErrorBoundary';
import FixMyCityRoutes from './fixMyCity/FixMyCityRoutes';
import BusWayRoutes from 'busway/BusWayRoutes';
import { LoginPage } from 'busway/auth/pages/login-page';
import { RegisterPage } from 'busway/auth/pages/register-page';
import Notification from 'busway/components/Common/Notification';

import { checkAuthStatus } from 'busway/auth/store/authSlice';
import { useAuth } from 'busway/auth/store/useAuth';

const GuestOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectTo =
    ((location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/fixmycity');

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  useEffect(() => {
    void checkAuthStatus();
  }, []);

  return (
    <ErrorBoundary>
      <>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly>
                <RegisterPage />
              </GuestOnly>
            }
          />
          <Route path="/fixmycity/*" element={<FixMyCityRoutes />} />
          <Route path="/busway/*" element={<BusWayRoutes />} />
          <Route path="/civic/*" element={<Navigate to="/fixmycity" replace />} />
          <Route path="/" element={<Navigate to="/busway" replace />} />
          <Route path="*" element={<Navigate to="/busway" replace />} />
        </Routes>
        <Notification />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
