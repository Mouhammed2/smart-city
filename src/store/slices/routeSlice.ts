import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Route, RootState, RouteState } from '../../types';
import { routeService } from '../../services/BusWay/routeService';

const initialState: RouteState = {
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllRoutes = createAsyncThunk(
  'routes/fetchAll',
  async () => {
    const routes = await routeService.getAll();
    console.log('fetchAllRoutes - Received routes:', routes.length, routes);
    return routes;
  }
);

export const fetchRouteById = createAsyncThunk(
  'routes/fetchById',
  async (id: number) => {
    return await routeService.getById(id);
  }
);

const routeSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setSelectedRoute: (state, action: PayloadAction<Route | null>) => {
      state.selectedRoute = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all routes
      .addCase(fetchAllRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoutes.fulfilled, (state, action: PayloadAction<Route[]>) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchAllRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch routes';
      })
      // Fetch route by ID
      .addCase(fetchRouteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouteById.fulfilled, (state, action: PayloadAction<Route>) => {
        state.loading = false;
        state.selectedRoute = action.payload;
      })
      .addCase(fetchRouteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch route';
      });
  },
});

export const { setSelectedRoute, clearError } = routeSlice.actions;
export default routeSlice.reducer;

// Memoized selectors
export const selectRouteState = (state: RootState) => state.routes;

export const selectAllRoutes = createSelector(
  [selectRouteState],
  (routeState) => routeState.routes
);

export const selectSelectedRoute = createSelector(
  [selectRouteState],
  (routeState) => routeState.selectedRoute
);

export const selectRouteLoading = createSelector(
  [selectRouteState],
  (routeState) => routeState.loading
);

export const selectRouteError = createSelector(
  [selectRouteState],
  (routeState) => routeState.error
);

// Complex selectors
export const selectRoutesByColor = createSelector(
  [selectAllRoutes],
  (routes) => {
    const colorMap = new Map<string, Route[]>();
    routes.forEach(route => {
      const existing = colorMap.get(route.color) || [];
      existing.push(route);
      colorMap.set(route.color, existing);
    });
    return colorMap;
  }
);

export const selectRouteById = createSelector(
  [selectAllRoutes, (state: RootState, routeId: number) => routeId],
  (routes, routeId) => routes.find(route => route.id === routeId)
);
