import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Chip,
  Pagination,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchEvents,
  selectEvents,
  selectSearchResults,
  selectEventsLoading,
  selectEventsError,
} from "../../store/slices/eventsSlice";
import { EventCategory, EventStatus } from "../../types";

const eventCategories: { value: EventCategory | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "Music", label: "Music" },
  { value: "Sports", label: "Sports" },
  { value: "Conference", label: "Conference" },
  { value: "Exhibition", label: "Exhibition" },
  { value: "Festival", label: "Festival" },
  { value: "Workshop", label: "Workshop" },
  { value: "Theater", label: "Theater" },
  { value: "Comedy", label: "Comedy" },
  { value: "Food", label: "Food" },
  { value: "Technology", label: "Technology" },
  { value: "Art", label: "Art" },
  { value: "Other", label: "Other" },
];

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const searchResults = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    query: searchParams.get("search") || "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      searchEvents({
        query: filters.query || undefined,
        category: (filters.category as EventCategory) || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: page - 1,
        size: 12,
      }),
    );
  }, [dispatch, filters, page]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Events
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              {eventCategories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() =>
                setFilters({
                  query: "",
                  category: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {searchResults
            ? `Showing ${events.length} of ${searchResults.totalCount} events`
            : "Loading..."}
        </Typography>
      </Box>

      {/* Events Grid */}
      {loading ? (
        <Typography>Loading events...</Typography>
      ) : error ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load events
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => dispatch(searchEvents({ size: 12 }))}
          >
            Retry
          </Button>
        </Box>
      ) : events.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                <Paper
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => navigate(`/events/events/${event.id}`)}
                >
                  {/* Event Image */}
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: "grey.200",
                      backgroundImage: event.imageUrl
                        ? `url(${event.imageUrl})`
                        : "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    <Chip
                      label={event.status}
                      color={
                        getStatusColor(event.status) as
                          | "success"
                          | "warning"
                          | "error"
                          | "default"
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Event Info */}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" noWrap fontWeight={600}>
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <LocationIcon fontSize="small" />
                      {event.location}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <CalendarIcon fontSize="small" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Chip
                        label={event.category}
                        size="small"
                        variant="outlined"
                      />
                      {event.price !== undefined && event.price > 0 && (
                        <Chip
                          label={`${event.price} MAD`}
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {searchResults && searchResults.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={searchResults.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EventsPage;
