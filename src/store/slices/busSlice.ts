import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Bus, RootState, BusState } from '../../types';
import { busService } from '../../services/BusWay/busService';

const initialState: BusState = {
  buses: [],
  nearestBuses: [],
  selectedBus: null,
  searchRadius: 500,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllBuses = createAsyncThunk(
  'buses/fetchAll',
  async () => {
    return await busService.getAll();
  }
);

export const fetchNearestBuses = createAsyncThunk(
  'buses/fetchNearest',
  async ({ lat, lng, radius }: { lat: number; lng: number; radius?: number }) => {
    return await busService.getNearest(lat, lng, radius);
  }
);

export const fetchBusesByRoute = createAsyncThunk(
  'buses/fetchByRoute',
  async (routeId: number) => {
    return await busService.getByRoute(routeId);
  }
);

const busSlice = createSlice({
  name: 'buses',
  initialState,
  reducers: {
    setSelectedBus: (state, action: PayloadAction<Bus | null>) => {
      state.selectedBus = action.payload;
    },
    setSearchRadius: (state, action: PayloadAction<number>) => {
      state.searchRadius = action.payload;
    },
    updateBusLocation: (state, action: PayloadAction<{ id: number; lat: number; lng: number }>) => {
      const bus = state.buses.find(b => b.id === action.payload.id);
      if (bus) {
        bus.latitude = action.payload.lat;
        bus.longitude = action.payload.lng;
        bus.lastUpdated = new Date().toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all buses
      .addCase(fetchAllBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBuses.fulfilled, (state, action: PayloadAction<Bus[]>) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(fetchAllBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buses';
      })
      // Fetch nearest buses
      .addCase(fetchNearestBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearestBuses.fulfilled, (state, action: PayloadAction<Bus[]>) => {
        state.loading = false;
        state.nearestBuses = action.payload;
      })
      .addCase(fetchNearestBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch nearest buses';
      })
      // Fetch buses by route
      .addCase(fetchBusesByRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusesByRoute.fulfilled, (state, action: PayloadAction<Bus[]>) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(fetchBusesByRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buses by route';
      });
  },
});

export const { setSelectedBus, setSearchRadius, updateBusLocation, clearError } = busSlice.actions;
export default busSlice.reducer;

// Memoized selectors
export const selectBusState = (state: RootState) => state.buses;

export const selectAllBuses = createSelector(
  [selectBusState],
  (busState) => busState.buses
);

export const selectNearestBuses = createSelector(
  [selectBusState],
  (busState) => busState.nearestBuses
);

export const selectSelectedBus = createSelector(
  [selectBusState],
  (busState) => busState.selectedBus
);

export const selectSearchRadius = createSelector(
  [selectBusState],
  (busState) => busState.searchRadius
);

export const selectBusLoading = createSelector(
  [selectBusState],
  (busState) => busState.loading
);

export const selectBusError = createSelector(
  [selectBusState],
  (busState) => busState.error
);

// Complex selectors
export const selectActiveBuses = createSelector(
  [selectAllBuses],
  (buses) => buses.filter(bus => bus.status === 'ACTIVE')
);

export const selectBusesByOccupancy = createSelector(
  [selectAllBuses],
  (buses) => ({
    available: buses.filter(bus => bus.occupancyStatus === 'AVAILABLE'),
    limited: buses.filter(bus => bus.occupancyStatus === 'LIMITED'),
    full: buses.filter(bus => bus.occupancyStatus === 'FULL')
  })
);
