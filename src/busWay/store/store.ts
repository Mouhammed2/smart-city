import { configureStore } from '@reduxjs/toolkit';
import busReducer from './slices/busSlice';
import routeReducer from './slices/routeSlice';
import stopReducer from './slices/stopSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    buses: busReducer,
    routes: routeReducer,
    stops: stopReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
