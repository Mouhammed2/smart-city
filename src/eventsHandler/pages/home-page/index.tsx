import React, { useEffect } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Event as EventIcon,
  Map as MapIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchEvents,
  selectEvents,
  selectEventsLoading,
  selectEventsError,
} from "../../store/slices/eventsSlice";
import { useAuth } from "../../../auth/store/useAuth";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(searchEvents({ size: 6 }));
  }, [dispatch]);

  const stats = [
    { title: "Total Events", value: "150+", icon: <EventIcon /> },
    { title: "This Month", value: "24", icon: <TrendingIcon /> },
    { title: "Your Favorites", value: "8", icon: <FavoriteIcon /> },
    { title: "Nearby", value: "12", icon: <MapIcon /> },
  ];

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Welcome{user?.username ? `, ${user.username}` : ""}!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Discover amazing events happening around you.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  color: "white",
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Featured Events */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Featured Events
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/events/events")}>
            View All
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading events...</Typography>
        ) : error ? (
          <Typography color="error">Failed to load events: {error}</Typography>
        ) : events.length === 0 ? (
          <Typography color="text.secondary">
            No events available yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {events.slice(0, 3).map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-4px)" },
                  }}
                  onClick={() => navigate(`/events/events/${event.id}`)}
                >
                  <Box
                    sx={{
                      height: 140,
                      bgcolor: "grey.200",
                      borderRadius: 2,
                      mb: 2,
                      backgroundImage: event.imageUrl
                        ? `url(${event.imageUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Typography variant="h6" noWrap>
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.location} •{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<MapIcon />}
              onClick={() => navigate("/events/map")}
            >
              View Map
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FavoriteIcon />}
              onClick={() => navigate("/events/favorites")}
            >
              My Favorites
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default HomePage;
