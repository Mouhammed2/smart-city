import React, { useEffect, useCallback } from 'react';
import { Box, Grid, Paper, useTheme } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { fetchAllRoutes } from '../store/slices/routeSlice';
import { fetchAllStops } from '../store/slices/stopSlice';
import { fetchAllBuses } from '../store/slices/busSlice';
import { setUserLocation } from '../store/slices/uiSlice';

// Lazy load heavy components
const MapContainer = React.lazy(() => import('../components/Map/MapContainer'));
const NearestBuses = React.lazy(() => import('../components/Dashboard/NearestBuses'));
const StopDetails = React.lazy(() => import('../components/Dashboard/StopDetails'));

const HomePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('HomePage - Loading routes, stops, buses...');
    dispatch(fetchAllRoutes())
      .unwrap()
      .then((routes) => console.log('HomePage - Routes loaded:', routes.length))
      .catch((err) => console.error('HomePage - Routes error:', err));
    dispatch(fetchAllStops())
      .unwrap()
      .then((stops) => console.log('HomePage - Stops loaded:', stops.length))
      .catch((err) => console.error('HomePage - Stops error:', err));
    dispatch(fetchAllBuses())
      .unwrap()
      .then((buses) => console.log('HomePage - Buses loaded:', buses.length))
      .catch((err) => console.error('HomePage - Buses error:', err));
  }, [dispatch]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [dispatch]);

  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12} lg={8} sx={{ height: { xs: '60vh', lg: '100%' } }}>
          <Paper 
            elevation={2}
            sx={{ 
              height: '100%', 
              overflow: 'hidden',
              borderRadius: 3,
              position: 'relative'
            }}
          >
            <React.Suspense fallback={
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: theme.palette.grey[100]
              }}>
                Loading map...
              </Box>
            }>
              <MapContainer 
                showUserLocation 
                showNearestBuses 
                showSearchRadius
              />
            </React.Suspense>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4} sx={{ height: { xs: 'auto', lg: '100%' }, overflow: 'auto' }}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <React.Suspense fallback={null}>
                <NearestBuses />
              </React.Suspense>
            </Grid>
            <Grid item xs={12}>
              <React.Suspense fallback={null}>
                <StopDetails />
              </React.Suspense>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
