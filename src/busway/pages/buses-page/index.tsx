import React from "react";
import { Box } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import MapContainer from "../../components/Map/MapContainer";
import NearestBuses from "../../components/Dashboard/NearestBuses";

const BusesPage: React.FC = () => {
  const { nearestBuses } = useAppSelector((state) => state.buses);

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Sidebar - Buses List */}
      <Box sx={{ width: 360, minWidth: 360, height: "100%", overflow: "auto" }}>
        <NearestBuses />
      </Box>

      {/* Main Content - Map */}
      <Box
        sx={{ flexGrow: 1, height: "100%", minHeight: 0, overflow: "hidden" }}
      >
        <MapContainer
          showUserLocation={true}
          showNearestBuses={true}
          showSearchRadius={true}
          interactive={true}
        />
      </Box>
    </Box>
  );
};

export default BusesPage;
