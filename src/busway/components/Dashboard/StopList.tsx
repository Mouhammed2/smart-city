import React, { useState } from "react";
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
  Badge,
} from "@mui/material";
import {
  Place as PlaceIcon,
  Search as SearchIcon,
  Accessible as AccessibleIcon,
  Roofing as RoofingIcon,
  Weekend as BenchIcon,
  Clear as ClearIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setSelectedStop,
  selectSelectedStop,
} from "../../store/slices/stopSlice";
import { setMapCenter, setMapZoom } from "../../store/slices/uiSlice";

const StopList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stops, loading } = useAppSelector((state) => state.stops);
  const selectedStop = useAppSelector(selectSelectedStop);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStopClick = (stop: any) => {
    const isSameStop = selectedStop?.id === stop.id;
    dispatch(setSelectedStop(isSameStop ? null : stop));
    dispatch(setMapCenter([stop.longitude, stop.latitude]));
    dispatch(setMapZoom(16));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Calculate stats
  const shelteredCount = stops.filter((s) => s.hasShelter).length;
  const accessibleCount = stops.filter((s) => s.wheelchairAccessible).length;
  const benchCount = stops.filter((s) => s.bench).length;

  const getStopIconColor = (stop: any) => {
    if (stop.hasShelter && stop.wheelchairAccessible) return "success";
    if (stop.hasShelter) return "primary";
    return "action";
  };

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
            Bus Stops
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stops.length} stops across the network
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
              {stops.length}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Total
            </Typography>
          </Paper>
          <Tooltip title="Sheltered stops">
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 1.5,
                backgroundColor: "info.main",
                color: "white",
                borderRadius: 2,
                cursor: "help",
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {shelteredCount}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Sheltered
              </Typography>
            </Paper>
          </Tooltip>
          <Tooltip title="Wheelchair accessible">
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 1.5,
                backgroundColor: "success.main",
                color: "white",
                borderRadius: 2,
                cursor: "help",
              }}
            >
              <Typography variant="h4" fontWeight={700}>
                {accessibleCount}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Accessible
              </Typography>
            </Paper>
          </Tooltip>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search stops by name, code, or address..."
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

      {/* Stop List */}
      <Box sx={{ flexGrow: 1, overflow: "auto", px: 1, pb: 1 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {filteredStops.map((stop, index) => {
              const isSelected = selectedStop?.id === stop.id;

              return (
                <Fade
                  in
                  key={stop.id}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <Box>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleStopClick(stop)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        py: 1.5,
                        transition: "all 0.2s ease",
                        border: "2px solid transparent",
                        borderColor: isSelected
                          ? "primary.main"
                          : "transparent",
                        backgroundColor: isSelected
                          ? "primary.main"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "primary.main"
                            : "action.hover",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          badgeContent={
                            stop.wheelchairAccessible ? (
                              <AccessibleIcon
                                sx={{ fontSize: 12, color: "success.main" }}
                              />
                            ) : null
                          }
                        >
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              backgroundColor: isSelected
                                ? "rgba(255,255,255,0.2)"
                                : "primary.main",
                              color: isSelected ? "white" : "white",
                            }}
                          >
                            <PlaceIcon fontSize="small" />
                          </Avatar>
                        </Badge>
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
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{
                                color: isSelected ? "white" : "text.primary",
                              }}
                            >
                              {stop.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={stop.code}
                              sx={{
                                backgroundColor: isSelected
                                  ? "rgba(255,255,255,0.2)"
                                  : "background.paper",
                                color: isSelected ? "white" : "text.secondary",
                                fontWeight: 500,
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: isSelected
                                  ? "rgba(255,255,255,0.8)"
                                  : "text.secondary",
                                mb: 0.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationIcon sx={{ fontSize: 14 }} />
                              {stop.address}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {stop.hasShelter && (
                                <Tooltip title="Has shelter">
                                  <Chip
                                    icon={<RoofingIcon sx={{ fontSize: 14 }} />}
                                    label="Shelter"
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.65rem",
                                      backgroundColor: isSelected
                                        ? "rgba(255,255,255,0.15)"
                                        : "info.main",
                                      color: isSelected ? "white" : "white",
                                      "& .MuiChip-icon": {
                                        color: isSelected ? "white" : "white",
                                      },
                                    }}
                                  />
                                </Tooltip>
                              )}
                              {stop.wheelchairAccessible && (
                                <Tooltip title="Wheelchair accessible">
                                  <Chip
                                    icon={
                                      <AccessibleIcon sx={{ fontSize: 14 }} />
                                    }
                                    label="Accessible"
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.65rem",
                                      backgroundColor: isSelected
                                        ? "rgba(255,255,255,0.15)"
                                        : "success.main",
                                      color: isSelected ? "white" : "white",
                                      "& .MuiChip-icon": {
                                        color: isSelected ? "white" : "white",
                                      },
                                    }}
                                  />
                                </Tooltip>
                              )}
                              {stop.bench && (
                                <Tooltip title="Has bench">
                                  <Chip
                                    icon={<BenchIcon sx={{ fontSize: 14 }} />}
                                    label="Bench"
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.65rem",
                                      backgroundColor: isSelected
                                        ? "rgba(255,255,255,0.15)"
                                        : "secondary.main",
                                      color: isSelected ? "white" : "white",
                                      "& .MuiChip-icon": {
                                        color: isSelected ? "white" : "white",
                                      },
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
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
        {!loading && filteredStops.length === 0 && (
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
              <PlaceIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No stops found
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

export default StopList;
