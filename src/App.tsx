import React, { Suspense, useMemo, useEffect, type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Theme
import { lightTheme, darkTheme } from './theme';

// Layout components (eager loaded)
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import Notification from './components/Common/Notification';
import ErrorBoundary from './components/Common/ErrorBoundary';
import PageSkeleton from './components/Common/PageSkeleton';
import ProtectedRoute from './components/ProtectedRoute';
import LoginDialog from './components/Auth/LoginDialog';
import CivicRoutes from './civic/CivicRoutes';
import { LoginPage } from './civic/pages/login-page';
import { RegisterPage } from './civic/pages/register-page';

// Hooks
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectSidebarOpen, selectSidebarCollapsed, selectTheme as selectThemeMode } from './store/slices/uiSlice';
import { checkAuthStatus, selectIsAuthenticated } from './store/slices/authSlice';

// Lazy loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const RoutesPage = React.lazy(() => import('./pages/RoutesPage'));
const StopsPage = React.lazy(() => import('./pages/StopsPage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

const GuestOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/civic" replace />;
  }

  return <>{children}</>;
};

const LegacyLayout: React.FC = () => {
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  const drawerWidth = sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            sm: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)`
          },
          ml: {
            sm: `${sidebarOpen ? drawerWidth : 0}px`
          },
          mt: '72px',
          minHeight: 'calc(100vh - 72px)',
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
        <LoginDialog />
      </Box>
      <Notification />
    </Box>
  );
};

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
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
          <Route path="/civic/*" element={<CivicRoutes />} />
          <Route element={<LegacyLayout />}>
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
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
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
