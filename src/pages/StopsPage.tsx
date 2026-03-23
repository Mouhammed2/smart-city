import React, { useEffect } from 'react';
import { Box, Grid, Paper, useTheme } from '@mui/material';
import { useAppDispatch } from '../store/hooks';
import { fetchAllStops } from '../store/slices/stopSlice';

// Lazy load components
const MapContainer = React.lazy(() => import('../components/Map/MapContainer'));
const StopList = React.lazy(() => import('../components/Dashboard/StopList'));

const StopsPage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllStops());
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
        <Grid item xs={12} lg={4} sx={{ height: { xs: 'auto', lg: '100%' }, overflow: 'auto' }}>
          <React.Suspense fallback={null}>
            <StopList />
          </React.Suspense>
        </Grid>
        
        <Grid item xs={12} lg={8} sx={{ height: { xs: '60vh', lg: '100%' } }}>
          <Paper 
            elevation={2}
            sx={{ 
              height: '100%', 
              overflow: 'hidden',
              borderRadius: 3
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
              <MapContainer />
            </React.Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StopsPage;
