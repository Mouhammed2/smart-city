import React from "react";
import { Box } from "@mui/material";
import MapContainer from "../../components/Map/MapContainer";
import StopList from "../../components/Dashboard/StopList";

const StopsPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Sidebar - Stops List */}
      <Box sx={{ width: 360, minWidth: 360, height: "100%", overflow: "auto" }}>
        <StopList />
      </Box>

      {/* Main Content - Map */}
      <Box sx={{ flexGrow: 1, height: "100%" }}>
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

export default StopsPage;
