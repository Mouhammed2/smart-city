import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { eventService } from "../../services/EventHandler/eventService";
import {
  EventsState,
  Event,
  EventSearchParams,
  EventMapData,
  PaginatedResponse,
} from "../../types";

const initialState: EventsState = {
  events: [],
  selectedEvent: null,
  mapEvents: [],
  searchResults: null,
  loading: false,
  error: null,
};

// Async thunks
export const searchEvents = createAsyncThunk(
  "events/searchEvents",
  async (params: EventSearchParams | undefined, { rejectWithValue }) => {
    try {
      return await eventService.searchEvents(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to search events",
      );
    }
  },
);

export const getEventById = createAsyncThunk(
  "events/getEventById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await eventService.getEventById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch event",
      );
    }
  },
);

export const getEventsForMap = createAsyncThunk(
  "events/getEventsForMap",
  async (
    params: {
      bounds?: { north: number; south: number; east: number; west: number };
      filters?: { category?: string; startDate?: string; endDate?: string };
    },
    { rejectWithValue },
  ) => {
    try {
      return await eventService.getEventsForMap(params.bounds, params.filters);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch map events",
      );
    }
  },
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<Event | null>) => {
      state.selectedEvent = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search events
      .addCase(searchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchEvents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Event>>) => {
          state.loading = false;
          state.searchResults = action.payload;
          state.events = action.payload.items;
        },
      )
      .addCase(searchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to search events";
      })
      // Get event by ID
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventById.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          state.selectedEvent = action.payload;
        },
      )
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch event";
      })
      // Get events for map
      .addCase(getEventsForMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getEventsForMap.fulfilled,
        (state, action: PayloadAction<EventMapData[]>) => {
          state.loading = false;
          state.mapEvents = action.payload;
        },
      )
      .addCase(getEventsForMap.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch map events";
      });
  },
});

export const { setSelectedEvent, clearError } = eventsSlice.actions;

// Selectors
export const selectEvents = (state: { events: EventsState }) =>
  state.events.events;
export const selectSelectedEvent = (state: { events: EventsState }) =>
  state.events.selectedEvent;
export const selectMapEvents = (state: { events: EventsState }) =>
  state.events.mapEvents;
export const selectSearchResults = (state: { events: EventsState }) =>
  state.events.searchResults;
export const selectEventsLoading = (state: { events: EventsState }) =>
  state.events.loading;
export const selectEventsError = (state: { events: EventsState }) =>
  state.events.error;

export default eventsSlice.reducer;
