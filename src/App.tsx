import React, { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './busWay/store/store';

import ErrorBoundary from './busWay/components/Common/ErrorBoundary';
import FixMyCityRoutes from './fixMyCity/FixMyCityRoutes';
import BusWayRoutes from './busWay/BusWayRoutes';
import { LoginPage } from './auth/pages/login-page';
import { RegisterPage } from './auth/pages/register-page';
import Notification from './busWay/components/Common/Notification';

import { checkAuthStatus } from './auth/store/authSlice';
import { useAuth } from './auth/store/useAuth';

const GuestOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/fixmycity" replace />;
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
