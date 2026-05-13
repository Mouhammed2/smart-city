import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Button,
  Slider,
  Skeleton,
  Alert,
  Chip,
  Fade,
  Grow,
} from "@mui/material";
import {
  DirectionsBus as BusIcon,
  MyLocation as LocationIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
// Note: react-window virtualization temporarily disabled
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchNearestBuses,
  selectNearestBuses,
  selectSearchRadius,
  setSearchRadius,
} from "../../store/slices/busSlice";
import {
  setMapCenter,
  setMapZoom,
  selectUserLocation,
} from "../../store/slices/uiSlice";
import { setSelectedBus } from "../../store/slices/busSlice";
import { Bus } from "../../types";
import { calculateDistance, formatDistance } from "../../../utils/geoUtils";

interface BusWithDistance extends Bus {
  distance: number;
}

const BusListItem = React.memo(
  ({
    bus,
    style,
    onClick,
  }: {
    bus: BusWithDistance;
    style: React.CSSProperties;
    onClick: () => void;
  }) => (
    <div style={style}>
      <Grow in timeout={300}>
        <ListItemButton
          onClick={onClick}
          sx={{
            borderRadius: 2,
            mx: 1,
            mb: 0.5,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "action.hover",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <BusIcon />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Bus {bus.busNumber}
                </Typography>
                <Chip
                  label={formatDistance(bus.distance)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            }
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {bus.routeName || "Unknown Route"}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 0.5,
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon
                      sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {bus.currentPassengers}/{bus.capacity}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TimeIcon
                      sx={{ fontSize: 14, mr: 0.5, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {bus.lastUpdated
                        ? new Date(bus.lastUpdated).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
          />
        </ListItemButton>
      </Grow>
    </div>
  ),
);

BusListItem.displayName = "BusListItem";

const NearestBuses: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLocation = useAppSelector(selectUserLocation);
  const nearestBuses = useAppSelector(selectNearestBuses);
  const searchRadius = useAppSelector(selectSearchRadius);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findNearestBuses = useCallback(async () => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch(
        fetchNearestBuses({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: searchRadius,
        }),
      ).unwrap();
    } catch (err) {
      setError("Failed to fetch nearest buses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, userLocation, searchRadius]);

  useEffect(() => {
    if (userLocation) {
      findNearestBuses();
    }
  }, [userLocation, searchRadius, findNearestBuses]);

  const busesWithDistance = useMemo((): BusWithDistance[] => {
    if (!userLocation) return [];

    return nearestBuses
      .map((bus) => ({
        ...bus,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          bus.latitude,
          bus.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [nearestBuses, userLocation]);

  const handleBusClick = useCallback(
    (bus: Bus) => {
      dispatch(setSelectedBus(bus));
      dispatch(setMapCenter([bus.longitude, bus.latitude]));
      dispatch(setMapZoom(17));
    },
    [dispatch],
  );

  const handleRadiusChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      dispatch(setSearchRadius(newValue as number));
    },
    [dispatch],
  );

  if (!userLocation) {
    return (
      <Fade in>
        <Alert
          severity="warning"
          sx={{
            m: 2,
            borderRadius: 3,
            "& .MuiAlert-icon": { alignItems: "center" },
          }}
        >
          Please enable location access to find nearby buses
        </Alert>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Card
        elevation={2}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                mr: 2,
              }}
            >
              <LocationIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Nearest Buses
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {busesWithDistance.length} buses within{" "}
                {formatDistance(searchRadius)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3, px: 1 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Search Radius
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDistance(searchRadius)}
              </Typography>
            </Box>
            <Slider
              value={searchRadius}
              onChange={handleRadiusChange}
              min={100}
              max={5000}
              step={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value: number) => formatDistance(value)}
              sx={{
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                },
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ flexGrow: 1 }}>
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={80}
                  sx={{ mb: 1, borderRadius: 2 }}
                />
              ))}
            </Box>
          ) : busesWithDistance.length === 0 ? (
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                py: 4,
              }}
            >
              <BusIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary" align="center">
                No buses found within {formatDistance(searchRadius)}
              </Typography>
            </Box>
          ) : (
            <List sx={{ flexGrow: 1, overflow: "auto" }}>
              {busesWithDistance.map((bus, index) => (
                <React.Fragment key={bus.id}>
                  {index > 0 && <Divider sx={{ my: 1 }} />}
                  <BusListItem
                    bus={bus}
                    style={{}}
                    onClick={() => handleBusClick(bus)}
                  />
                </React.Fragment>
              ))}
            </List>
          )}

          <Button
            fullWidth
            variant="outlined"
            onClick={findNearestBuses}
            disabled={loading}
            startIcon={<RefreshIcon />}
            sx={{
              mt: 2,
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Refresh
          </Button>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default NearestBuses;
