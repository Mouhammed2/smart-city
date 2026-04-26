import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  DirectionsBus as BusIcon,
  Place as StopIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const AdminPage: React.FC = () => {
  const adminItems = [
    {
      title: "Manage Buses",
      icon: <BusIcon fontSize="large" />,
      description: "Add, edit, or remove buses from the fleet",
    },
    {
      title: "Manage Stops",
      icon: <StopIcon fontSize="large" />,
      description: "Configure bus stops and their amenities",
    },
    {
      title: "Manage Routes",
      icon: <RouteIcon fontSize="large" />,
      description: "Create and edit bus routes",
    },
    {
      title: "Manage Schedules",
      icon: <ScheduleIcon fontSize="large" />,
      description: "Set up timetables and schedules",
    },
  ];

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Manage your BusWay system
      </Typography>

      <Grid container spacing={3}>
        {adminItems.map((item) => (
          <Grid item xs={12} md={6} lg={3} key={item.title}>
            <Paper
              elevation={2}
              sx={{ p: 3, textAlign: "center", height: "100%" }}
            >
              <Box sx={{ color: "primary.main", mb: 2 }}>{item.icon}</Box>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                {item.description}
              </Typography>
              <Button variant="outlined" fullWidth>
                Open
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPage;
