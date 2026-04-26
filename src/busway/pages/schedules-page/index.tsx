import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MapContainer from "../../components/Map/MapContainer";

const SchedulesPage: React.FC = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Sidebar - Schedules */}
      <Box sx={{ width: 360, minWidth: 360, height: "100%", overflow: "auto" }}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Schedules
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Select a route or stop to view schedules
            </Typography>
            <List sx={{ mt: 2 }}>
              <ListItem>
                <ListItemText
                  primary="Route 101"
                  secondary="Every 15 min • 6:00 AM - 10:00 PM"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Route 202"
                  secondary="Every 20 min • 5:30 AM - 11:00 PM"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Route 303"
                  secondary="Every 30 min • 7:00 AM - 9:00 PM"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
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

export default SchedulesPage;
