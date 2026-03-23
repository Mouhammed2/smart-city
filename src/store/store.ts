import { configureStore } from '@reduxjs/toolkit';
import busReducer from './slices/busSlice';
import routeReducer from './slices/routeSlice';
import stopReducer from './slices/stopSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    buses: busReducer,
    routes: routeReducer,
    stops: stopReducer,
    ui: uiReducer,
    auth: authReducer,
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
