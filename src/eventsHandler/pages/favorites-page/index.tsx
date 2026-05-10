import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getUserFavorites,
  toggleFavorite,
  selectFavorites,
  selectFavoritesLoading,
} from "../../store/slices/favoritesSlice";
import { useAuth } from "../../../auth/store/useAuth";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const loading = useAppSelector(selectFavoritesLoading);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserFavorites(user.id.toString()));
    }
  }, [dispatch, user?.id]);

  const handleRemoveFavorite = (eventId: number) => {
    if (user?.id) {
      dispatch(toggleFavorite({ eventId, userId: user.id.toString() }));
    }
  };

  const handleViewEvent = (eventId: number) => {
    navigate(`/events/events/${eventId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
        <Typography>Loading favorites...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        My Favorites
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Events you've saved for quick access
      </Typography>

      {favorites.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            No favorites yet
          </Typography>
          <Typography paragraph>
            Browse events and click the heart icon to save them here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/events/events")}
            sx={{ mt: 1 }}
          >
            Browse Events
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} key={favorite.id}>
              <Paper
                sx={{
                  p: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                {/* Event Image Placeholder */}
                <Box
                  sx={{
                    height: 140,
                    bgcolor: "grey.200",
                    borderRadius: 2,
                    mb: 2,
                    backgroundImage: favorite.eventImageUrl
                      ? `url(${favorite.eventImageUrl})`
                      : "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    p: 1,
                  }}
                >
                  <Chip
                    label={new Date(
                      favorite.eventStartDate,
                    ).toLocaleDateString()}
                    size="small"
                    sx={{ bgcolor: "white" }}
                  />
                </Box>

                {/* Event Info */}
                <Typography variant="h6" noWrap fontWeight={600}>
                  {favorite.eventTitle}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{favorite.eventCity}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                    color: "text.secondary",
                  }}
                >
                  <CalendarIcon fontSize="small" />
                  <Typography variant="body2">
                    {new Date(favorite.eventStartDate).toLocaleString()}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    size="small"
                    endIcon={<ArrowIcon />}
                    onClick={() => handleViewEvent(favorite.eventId)}
                  >
                    View Event
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFavorite(favorite.eventId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FavoritesPage;
