import React from 'react';
import { Box, Typography } from '@mui/material';

const BusesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Live Buses
      </Typography>
      <Typography color="text.secondary">
        Real-time bus locations will appear here.
      </Typography>
    </Box>
  );
};

export default BusesPage;

