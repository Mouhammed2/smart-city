import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import userProfileReducer from "./slices/userProfileSlice";
import userPreferencesReducer from "./slices/userPreferencesSlice";
import favoritesReducer from "./slices/favoritesSlice";
import commentsReducer from "./slices/commentsSlice";
import notificationsReducer from "./slices/notificationsSlice";
import companyReducer from "./slices/companySlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    userProfile: userProfileReducer,
    userPreferences: userPreferencesReducer,
    favorites: favoritesReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    company: companyReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["ui/setNotification"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
