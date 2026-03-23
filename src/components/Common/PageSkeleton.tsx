import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

const PageSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3, height: '100%' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12} md={8} sx={{ height: { xs: '50vh', md: '100%' } }}>
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              height: '100%', 
              borderRadius: 3,
              bgcolor: 'rgba(0,0,0,0.05)'
            }} 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)' }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, bgcolor: 'rgba(0,0,0,0.05)' }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageSkeleton;
