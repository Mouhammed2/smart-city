import React from 'react';
import { Box, Typography } from '@mui/material';

const SchedulesPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Schedules
      </Typography>
      <Typography color="text.secondary">
        Bus timetables and schedules will appear here.
      </Typography>
    </Box>
  );
};

export default SchedulesPage;

