import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Avatar,
  Tooltip,
  Fade,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Route as RouteIcon,
  Search as SearchIcon,
  Place as StopIcon,
  NavigateNext as NavigateNextIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  fetchAllRoutes,
  selectSelectedRoute,
} from "../../store/slices/routeSlice";
import { setSelectedRoute } from "../../store/slices/routeSlice";
import { setMapCenter, setMapZoom } from "../../store/slices/uiSlice";

const RouteList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { routes, loading } = useAppSelector((state) => state.routes);
  const selectedRoute = useAppSelector(selectSelectedRoute);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllRoutes());
  }, [dispatch]);

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleRouteClick = (route: any) => {
    const isSameRoute = selectedRoute?.id === route.id;
    dispatch(setSelectedRoute(isSameRoute ? null : route));

    if (route.geometry.coordinates.length > 0) {
      const [lng, lat] = route.geometry.coordinates[0];
      dispatch(setMapCenter([lat, lng]));
      dispatch(setMapZoom(14));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const totalStops = routes.reduce(
    (acc, route) => acc + (route.geometry.coordinates.length || 0),
    0,
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        borderRadius: 0,
      }}
    >
      <CardContent sx={{ p: 2, pb: 0 }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="primary.main"
            gutterBottom
          >
            Bus Routes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {routes.length} routes • {totalStops} stops total
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 1.5,
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {routes.length}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Routes
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 1.5,
              backgroundColor: "secondary.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {totalStops}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Stops
            </Typography>
          </Paper>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search routes by name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "background.paper",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>

      {/* Route List */}
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 1, pb: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {filteredRoutes.map((route, index) => {
              const isSelected = selectedRoute?.id === route.id;
              const stopCount = route.geometry?.coordinates?.length || 0;

              return (
                <Fade
                  in
                  key={route.id}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <Box>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleRouteClick(route)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        py: 1.5,
                        transition: "all 0.2s ease",
                        border: "2px solid transparent",
                        borderColor: isSelected
                          ? `${route.color || "#3366CC"}40`
                          : "transparent",
                        backgroundColor: isSelected
                          ? `${route.color || "#3366CC"}10`
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? `${route.color || "#3366CC"}15`
                            : "action.hover",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 50 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: route.color || "#3366CC",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                        >
                          {route.routeNumber.slice(0, 3)}
                        </Avatar>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight={600}>
                              {route.routeNumber}
                            </Typography>
                            <Chip
                              size="small"
                              label={route.name}
                              sx={{
                                backgroundColor: `${route.color || "#3366CC"}20`,
                                color: route.color || "#3366CC",
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                height: 22,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Number of stops">
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <StopIcon
                                  sx={{ fontSize: 14, color: "text.secondary" }}
                                />
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {stopCount} stops
                                </Typography>
                              </Box>
                            </Tooltip>
                            {isSelected && (
                              <NavigateNextIcon
                                sx={{
                                  fontSize: 16,
                                  color: route.color || "#3366CC",
                                  ml: "auto",
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </Box>
                </Fade>
              );
            })}
          </List>
        )}

        {/* Empty State */}
        {!loading && filteredRoutes.length === 0 && (
          <Box
            sx={{
              py: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "action.hover",
                color: "text.secondary",
                mb: 2,
              }}
            >
              <RouteIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No routes found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default RouteList;
