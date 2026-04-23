import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Stop, RootState, StopState } from '../../types';
import { stopService } from '../../services/BusWay/stopService';

const initialState: StopState = {
  stops: [],
  nearestStops: [],
  selectedStop: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllStops = createAsyncThunk(
  'stops/fetchAll',
  async () => {
    return await stopService.getAll();
  }
);

export const fetchNearestStops = createAsyncThunk(
  'stops/fetchNearest',
  async ({ lat, lng, radius }: { lat: number; lng: number; radius?: number }) => {
    return await stopService.getNearest(lat, lng, radius);
  }
);

export const fetchStopById = createAsyncThunk(
  'stops/fetchById',
  async (id: number) => {
    return await stopService.getById(id);
  }
);

const stopSlice = createSlice({
  name: 'stops',
  initialState,
  reducers: {
    setSelectedStop: (state, action: PayloadAction<Stop | null>) => {
      state.selectedStop = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all stops
      .addCase(fetchAllStops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStops.fulfilled, (state, action: PayloadAction<Stop[]>) => {
        state.loading = false;
        state.stops = action.payload;
      })
      .addCase(fetchAllStops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stops';
      })
      // Fetch nearest stops
      .addCase(fetchNearestStops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearestStops.fulfilled, (state, action: PayloadAction<Stop[]>) => {
        state.loading = false;
        state.nearestStops = action.payload;
      })
      .addCase(fetchNearestStops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch nearest stops';
      })
      // Fetch stop by ID
      .addCase(fetchStopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStopById.fulfilled, (state, action: PayloadAction<Stop>) => {
        state.loading = false;
        state.selectedStop = action.payload;
      })
      .addCase(fetchStopById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stop';
      });
  },
});

export const { setSelectedStop, clearError } = stopSlice.actions;
export default stopSlice.reducer;

// Memoized selectors
export const selectStopState = (state: RootState) => state.stops;

export const selectAllStops = createSelector(
  [selectStopState],
  (stopState) => stopState.stops
);

export const selectNearestStops = createSelector(
  [selectStopState],
  (stopState) => stopState.nearestStops
);

export const selectSelectedStop = createSelector(
  [selectStopState],
  (stopState) => stopState.selectedStop
);

export const selectStopLoading = createSelector(
  [selectStopState],
  (stopState) => stopState.loading
);

export const selectStopError = createSelector(
  [selectStopState],
  (stopState) => stopState.error
);

// Complex selectors
export const selectAccessibleStops = createSelector(
  [selectAllStops],
  (stops) => stops.filter(stop => stop.wheelchairAccessible)
);

export const selectStopsWithShelter = createSelector(
  [selectAllStops],
  (stops) => stops.filter(stop => stop.hasShelter)
);

export const selectStopsByCity = createSelector(
  [selectAllStops],
  (stops) => {
    const cityMap = new Map<string, Stop[]>();
    stops.forEach(stop => {
      const city = stop.city || 'Unknown';
      const existing = cityMap.get(city) || [];
      existing.push(stop);
      cityMap.set(city, existing);
    });
    return cityMap;
  }
);
