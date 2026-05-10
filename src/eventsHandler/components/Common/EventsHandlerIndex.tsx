import React from "react";
import { Box, Typography, Button, Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Event as EventIcon,
  Map as MapIcon,
  Favorite as FavoriteIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

const EventsHandlerIndex: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Browse Events",
      description: "Discover exciting events happening around you",
      icon: <EventIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/events/events",
      color: "#EA580C",
    },
    {
      title: "Event Map",
      description: "View events on an interactive map",
      icon: <MapIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/events/map",
      color: "#DC2626",
    },
    {
      title: "My Favorites",
      description: "Keep track of events you love",
      icon: <FavoriteIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/events/favorites",
      color: "#EA580C",
    },
    {
      title: "For Companies",
      description: "Manage your company and publish events",
      icon: <BusinessIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      path: "/events/company",
      color: "#DC2626",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6, height: "100%", overflow: "auto" }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight={700}
          color="primary.main"
        >
          Events Handler
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover, explore, and manage amazing events in your city
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/events/events")}
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Explore Events
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderTop: 4,
                borderColor: feature.color,
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <Box mb={2}>{feature.icon}</Box>
              <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventsHandlerIndex;
