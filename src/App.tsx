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
import ProtectedRoute from 'busway/auth/components/protected-route';
import HomePage from './home/home-page';

import { checkAuthStatus } from 'busway/auth/store/authSlice';
import { useAuth } from 'busway/auth/store/useAuth';

const resolveRedirect = (candidate: string | null | undefined, fallback: string) =>
  candidate && candidate.startsWith('/') ? candidate : fallback;

const GuestOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const queryRedirect = new URLSearchParams(location.search).get('redirect');
  const fromState = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  const stateRedirect = fromState?.pathname
    ? `${fromState.pathname}${fromState.search ?? ''}${fromState.hash ?? ''}`
    : undefined;
  const redirectTo = resolveRedirect(queryRedirect ?? stateRedirect, '/fixmycity');

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
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/fixmycity/*"
            element={
              <ProtectedRoute>
                <FixMyCityRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/busway/*"
            element={
              <ProtectedRoute>
                <BusWayRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/civic/*"
            element={
              <ProtectedRoute>
                <Navigate to="/fixmycity" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
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
