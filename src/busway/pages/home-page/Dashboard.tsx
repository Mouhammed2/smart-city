import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Fade,
} from "@mui/material";
import {
  Route as RouteIcon,
  Place as StopIcon,
  DirectionsBus as BusIcon,
  Schedule as ScheduleIcon,
  Explore as ExploreIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllRoutes } from "../../store/slices/routeSlice";
import { fetchAllStops } from "../../store/slices/stopSlice";
import { fetchAllBuses } from "../../store/slices/busSlice";
import RouteList from "../../components/Dashboard/RouteList";
import MapContainer from "../../components/Map/MapContainer";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { routes } = useAppSelector((state) => state.routes);
  const { stops } = useAppSelector((state) => state.stops);
  const { buses } = useAppSelector((state) => state.buses);

  useEffect(() => {
    dispatch(fetchAllRoutes());
    dispatch(fetchAllStops());
    dispatch(fetchAllBuses());
  }, [dispatch]);

  const activeBuses = buses.filter((b) => b.status === "ACTIVE").length;
  const totalStops = routes.reduce(
    (acc, route) => acc + (route.geometry?.coordinates?.length || 0),
    0,
  );

  const quickActions = [
    {
      title: "View Routes",
      description: "Explore all bus routes",
      icon: <RouteIcon />,
      color: "#1976d2",
      path: "/busway/routes",
    },
    {
      title: "Find Stops",
      description: "Locate bus stops near you",
      icon: <StopIcon />,
      color: "#388e3c",
      path: "/busway/stops",
    },
    {
      title: "Live Tracking",
      description: "Track buses in real-time",
      icon: <BusIcon />,
      color: "#f57c00",
      path: "/busway/buses",
    },
    {
      title: "Schedules",
      description: "View bus schedules",
      icon: <ScheduleIcon />,
      color: "#7b1fa2",
      path: "/busway/schedules",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar - Route List & Stats */}
      <Box
        sx={{
          width: 380,
          minWidth: 380,
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header Section */}
        <Fade in timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "white",
              borderRadius: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mr: 2 }}
              >
                <ExploreIcon />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  BusWay - Oujda
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Smart City Transit System - Oujda, Morocco
                </Typography>
              </Box>
            </Box>

            {/* System Stats */}
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {routes.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Routes
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {stops.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Stops
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {activeBuses}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Active
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Quick Actions */}
        <Fade in timeout={700}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.secondary"
              sx={{ mb: 1.5, px: 1 }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={1}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} key={action.title}>
                  <Fade in style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      elevation={0}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: `${action.color}20`,
                            color: action.color,
                            mb: 1,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {action.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Route List */}
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <RouteList />
        </Box>
      </Box>

      {/* Main Content - Map */}
      <Box
        sx={{ flexGrow: 1, height: "100%", minHeight: 0, position: "relative" }}
      >
        <MapContainer
          showUserLocation={true}
          showNearestBuses={true}
          showSearchRadius={false}
          interactive={true}
        />

        {/* Floating Stats Card */}
        <Fade in timeout={1000}>
          <Paper
            elevation={2}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              p: 2,
              borderRadius: 3,
              minWidth: 200,
              zIndex: 1000,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" fontWeight={600}>
                System Status
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">
                  Active Buses:
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="success.main"
                >
                  {activeBuses} / {buses.length}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">
                  Total Stops:
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {stops.length}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="caption" color="text.secondary">
                  Network Coverage:
                </Typography>
                <Typography variant="caption" fontWeight={600}>
                  {routes.length} routes
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
};

export default Dashboard;
