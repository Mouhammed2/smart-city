import React from 'react';
import { Box } from '@mui/material';
import RouteList from '../../components/Dashboard/RouteList';
import MapContainer from '../../components/Map/MapContainer';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Sidebar - Route List */}
      <Box sx={{ width: 360, minWidth: 360, height: '100%', overflow: 'auto' }}>
        <RouteList />
      </Box>

      {/* Main Content - Map */}
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        <MapContainer 
          showUserLocation={true} 
          showNearestBuses={false}
          showSearchRadius={false}
          interactive={true}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
