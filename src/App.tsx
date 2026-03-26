import React, { useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import ErrorBoundary from './components/Common/ErrorBoundary';
import FixMyCityRoutes from './fixMyCity/FixMyCityRoutes';
import BusWayRoutes from './busWay/BusWayRoutes';
import { LoginPage } from './auth/pages/login-page';
import { RegisterPage } from './auth/pages/register-page';
import Notification from './components/Common/Notification';

import { checkAuthStatus } from './auth/store/authSlice';
import { useAuth } from './auth/store/useAuth';

const GuestOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/civic" replace />;
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
          <Route path="/civic/*" element={<FixMyCityRoutes />} />
          <Route path="/*" element={<BusWayRoutes />} />
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
