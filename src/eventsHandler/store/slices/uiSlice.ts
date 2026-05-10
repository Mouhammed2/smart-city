import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventsUIState, Coordinates } from "../../types";

const initialState: EventsUIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: "light",
  mapCenter: [-6.8498, 33.9716], // Default to Mohammedia, Morocco
  mapZoom: 13,
  userLocation: null,
  loading: false,
  notification: {
    open: false,
    message: "",
    severity: "info",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setMapCenter: (state, action: PayloadAction<[number, number]>) => {
      state.mapCenter = action.payload;
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<Coordinates | null>) => {
      state.userLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNotification: (
      state,
      action: PayloadAction<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
      }>,
    ) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = {
        open: false,
        message: "",
        severity: "info",
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSidebarCollapsed,
  setTheme,
  setMapCenter,
  setMapZoom,
  setUserLocation,
  setLoading,
  setNotification,
  clearNotification,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state: { ui: EventsUIState }) =>
  state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state: { ui: EventsUIState }) =>
  state.ui.sidebarCollapsed;
export const selectTheme = (state: { ui: EventsUIState }) => state.ui.theme;
export const selectMapCenter = (state: { ui: EventsUIState }) =>
  state.ui.mapCenter;
export const selectMapZoom = (state: { ui: EventsUIState }) => state.ui.mapZoom;
export const selectUserLocation = (state: { ui: EventsUIState }) =>
  state.ui.userLocation;
export const selectLoading = (state: { ui: EventsUIState }) =>
  state.ui.loading;
export const selectNotification = (state: { ui: EventsUIState }) =>
  state.ui.notification;

export default uiSlice.reducer;
