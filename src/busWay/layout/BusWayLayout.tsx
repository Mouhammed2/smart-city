import React, { Suspense, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import Navbar from '../components/Common/Navbar';
import Sidebar from '../components/Common/Sidebar';
import PageSkeleton from '../components/Common/PageSkeleton';
import { lightTheme, darkTheme } from '../theme';
import { useAppSelector } from '../store/hooks';
import { selectSidebarOpen, selectSidebarCollapsed, selectTheme as selectThemeMode } from '../store/slices/uiSlice';

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 72;

const BusWayLayout: React.FC = () => {
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const themeMode = useAppSelector(selectThemeMode);

  const drawerWidth = sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const theme = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default BusWayLayout;
