import React, { useEffect, useRef, useState } from "react";
import { Box, Paper, Typography, Chip, Button, Drawer } from "@mui/material";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getEventsForMap,
  selectMapEvents,
  selectEventsLoading,
  setSelectedEvent,
} from "../../store/slices/eventsSlice";
import { EventMapData, EventCategory } from "../../types";

// Replace with your Mapbox token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "";

const getEventCategoryColor = (category: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    Music: "#8B5CF6", // Purple
    Sports: "#10B981", // Green
    Conference: "#3B82F6", // Blue
    Exhibition: "#F59E0B", // Yellow
    Festival: "#EC4899", // Pink
    Workshop: "#06B6D4", // Cyan
    Theater: "#7C3AED", // Violet
    Comedy: "#F97316", // Orange
    Food: "#E11D48", // Rose
    Technology: "#0EA5E9", // Sky
    Art: "#D946EF", // Fuchsia
    Other: "#6B7280", // Gray
  };
  return colors[category] || colors.Other;
};

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mapEvents = useAppSelector(selectMapEvents);
  const loading = useAppSelector(selectEventsLoading);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [selectedEvent, setSelectedEventState] = useState<EventMapData | null>(
    null,
  );
  const [filterCategory, setFilterCategory] = useState<EventCategory | "">("");

  useEffect(() => {
    dispatch(getEventsForMap({}));
  }, [dispatch]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-6.8498, 33.9716], // Default to Mohammedia, Morocco
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right",
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter events if type is selected
    const filteredEvents = filterCategory
      ? mapEvents.filter((e) => e.category === filterCategory)
      : mapEvents;

    // Add markers for events
    filteredEvents.forEach((event) => {
      const el = document.createElement("div");
      el.className = "event-marker";
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${getEventCategoryColor(event.category)};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.2s;
      `;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([event.longitude, event.latitude])
        .addTo(map.current!);

      marker.getElement().addEventListener("click", () => {
        setSelectedEventState(event);
        dispatch(
          setSelectedEvent(event as unknown as import("../../types").Event),
        );
      });

      markersRef.current.push(marker);
    });
  }, [mapEvents, filterCategory, dispatch]);

  const eventCategories: { value: EventCategory | ""; label: string }[] = [
    { value: "", label: "All" },
    { value: "Music", label: "Music" },
    { value: "Sports", label: "Sports" },
    { value: "Conference", label: "Conferences" },
    { value: "Exhibition", label: "Exhibitions" },
    { value: "Festival", label: "Festivals" },
    { value: "Workshop", label: "Workshops" },
    { value: "Theater", label: "Theater" },
    { value: "Comedy", label: "Comedy" },
    { value: "Food", label: "Food" },
    { value: "Technology", label: "Technology" },
    { value: "Art", label: "Art" },
    { value: "Other", label: "Other" },
  ];

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Filter Bar */}
      <Paper
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          p: 2,
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mr: 1 }}>
          Filter by Category:
        </Typography>
        {eventCategories.map((cat) => (
          <Chip
            key={cat.value}
            label={cat.label}
            onClick={() => setFilterCategory(cat.value)}
            color={filterCategory === cat.value ? "primary" : "default"}
            variant={filterCategory === cat.value ? "filled" : "outlined"}
            sx={{
              bgcolor:
                cat.value && filterCategory === cat.value
                  ? getEventCategoryColor(cat.value as EventCategory)
                  : undefined,
            }}
          />
        ))}
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {mapEvents.length} events on map
        </Typography>
      </Paper>

      {/* Map Container */}
      <Box
        ref={mapContainer}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      />

      {/* Event Details Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedEvent}
        onClose={() => setSelectedEventState(null)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 }, p: 3 },
        }}
      >
        {selectedEvent && (
          <Box>
            <Box
              sx={{
                height: 200,
                bgcolor: "grey.200",
                borderRadius: 2,
                mb: 2,
                background: `linear-gradient(135deg, ${getEventCategoryColor(selectedEvent.category)} 0%, ${getEventCategoryColor(selectedEvent.category)}aa 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" color="white" fontWeight={700}>
                {selectedEvent.category}
              </Typography>
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {selectedEvent.title}
            </Typography>
            <Chip
              label={selectedEvent.category}
              size="small"
              sx={{
                mb: 2,
                bgcolor: getEventCategoryColor(selectedEvent.category),
                color: "white",
              }}
            />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Date:</strong>{" "}
              {new Date(selectedEvent.eventDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Status:</strong> {selectedEvent.status}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Status:</strong> {selectedEvent.status}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(`/events/events/${selectedEvent.id}`);
              }}
            >
              View Details
            </Button>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default MapPage;
