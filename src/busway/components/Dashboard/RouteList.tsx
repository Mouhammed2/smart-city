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
} from "@mui/material";
import {
  Route as RouteIcon,
  Search as SearchIcon,
  Place as StopIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchAllRoutes } from "../../store/slices/routeSlice";
import { setSelectedRoute } from "../../store/slices/routeSlice";
import { setMapCenter, setMapZoom } from "../../store/slices/uiSlice";

const RouteList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { routes, loading } = useAppSelector((state) => state.routes);
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
    dispatch(setSelectedRoute(route));

    if (route.geometry.coordinates.length > 0) {
      const [lng, lat] = route.geometry.coordinates[0];
      dispatch(setMapCenter([lat, lng]));
      dispatch(setMapZoom(14));
    }
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Bus Routes
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search routes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {filteredRoutes.map((route, index) => (
              <React.Fragment key={route.id}>
                {index > 0 && <Divider />}
                <ListItemButton
                  onClick={() => handleRouteClick(route)}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <RouteIcon sx={{ color: route.color || "#3366CC" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        component="span"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography component="span" variant="subtitle2">
                          {route.routeNumber}
                        </Typography>
                        <Chip
                          size="small"
                          label={route.name}
                          sx={{
                            backgroundColor: route.color || "#3366CC",
                            color: "white",
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box
                        component="span"
                        sx={{ display: "flex", gap: 2, mt: 0.5 }}
                      >
                        <Box
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <StopIcon sx={{ fontSize: 14, mr: 0.5 }} />
                          <Typography component="span" variant="caption">
                            {route.geometry.coordinates.length} stops
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </React.Fragment>
            ))}
          </List>
        )}

        {filteredRoutes.length === 0 && !loading && (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            No routes found
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteList;
