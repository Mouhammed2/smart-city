import React from "react";
import { Box } from "@mui/material";
import MapContainer from "../../components/Map/MapContainer";
import RouteList from "../../components/Dashboard/RouteList";

const RoutesPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Sidebar - Routes List */}
      <Box sx={{ width: 360, minWidth: 360, height: "100%", overflow: "auto" }}>
        <RouteList />
      </Box>

      {/* Main Content - Map */}
      <Box
        sx={{ flexGrow: 1, height: "100%", minHeight: 0, overflow: "hidden" }}
      >
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

export default RoutesPage;
