import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState, UserLocation, UIState } from '../../types';

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  mapCenter: [-73.9857, 40.7484],
  mapZoom: 13,
  userLocation: null,
  loading: false,
  notification: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setMapCenter: (state, action: PayloadAction<[number, number]>) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<UserLocation | null>) => {
      state.userLocation = action.payload;
    },
    showNotification: (state, action: PayloadAction<{
      message: string;
      severity: 'success' | 'error' | 'info' | 'warning';
    }>) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setMapCenter,
  setMapZoom,
  setUserLocation,
  showNotification,
  hideNotification,
  setLoading,
} = uiSlice.actions;
export default uiSlice.reducer;

// Memoized selectors
export const selectUIState = (state: RootState) => state.ui;

export const selectSidebarOpen = createSelector(
  [selectUIState],
  (uiState) => uiState.sidebarOpen
);

export const selectSidebarCollapsed = createSelector(
  [selectUIState],
  (uiState) => uiState.sidebarCollapsed
);

export const selectTheme = createSelector(
  [selectUIState],
  (uiState) => uiState.theme
);

export const selectMapCenter = createSelector(
  [selectUIState],
  (uiState) => uiState.mapCenter
);

export const selectMapZoom = createSelector(
  [selectUIState],
  (uiState) => uiState.mapZoom
);

export const selectUserLocation = createSelector(
  [selectUIState],
  (uiState) => uiState.userLocation
);

export const selectNotification = createSelector(
  [selectUIState],
  (uiState) => uiState.notification
);

export const selectUILoading = createSelector(
  [selectUIState],
  (uiState) => uiState.loading
);
