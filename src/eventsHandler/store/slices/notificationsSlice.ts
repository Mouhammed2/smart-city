import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "../../services/EventHandler/clientService";
import { NotificationsState, Notification } from "../../types";

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const getUserNotifications = createAsyncThunk(
  "notifications/getUserNotifications",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await clientService.getUserNotifications(userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch notifications",
      );
    }
  },
);

export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await clientService.getUnreadCount(userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch unread count",
      );
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId: number, { rejectWithValue }) => {
    try {
      return await clientService.markNotificationAsRead(notificationId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read",
      );
    }
  },
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (userId: string, { rejectWithValue }) => {
    try {
      const count = await clientService.markAllNotificationsAsRead(userId);
      return { userId, count };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read",
      );
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationsError: (state) => {
      state.error = null;
    },
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (action.payload.status === "UNREAD") {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.loading = false;
          state.notifications = action.payload;
        },
      )
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch notifications";
      })
      // Get unread count
      .addCase(getUnreadCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUnreadCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.unreadCount = action.payload;
        },
      )
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch unread count";
      })
      // Mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        markNotificationAsRead.fulfilled,
        (state, action: PayloadAction<Notification>) => {
          state.loading = false;
          const index = state.notifications.findIndex(
            (n) => n.id === action.payload.id,
          );
          if (index !== -1) {
            const wasUnread = state.notifications[index].status === "UNREAD";
            state.notifications[index] = action.payload;
            if (wasUnread && state.unreadCount > 0) {
              state.unreadCount -= 1;
            }
          }
        },
      )
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to mark notification as read";
      })
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        markAllNotificationsAsRead.fulfilled,
        (state, action: PayloadAction<{ userId: string; count: number }>) => {
          state.loading = false;
          state.notifications = state.notifications.map((n) => ({
            ...n,
            status: "READ" as const,
          }));
          state.unreadCount = 0;
        },
      )
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to mark all notifications as read";
      });
  },
});

export const { clearNotificationsError, resetNotifications, addNotification } =
  notificationsSlice.actions;

// Selectors
export const selectNotifications = (state: {
  notifications: NotificationsState;
}) => state.notifications.notifications;
export const selectUnreadCount = (state: {
  notifications: NotificationsState;
}) => state.notifications.unreadCount;
export const selectUnreadNotifications = (state: {
  notifications: NotificationsState;
}) => state.notifications.notifications.filter((n) => n.status === "UNREAD");
export const selectNotificationsLoading = (state: {
  notifications: NotificationsState;
}) => state.notifications.loading;
export const selectNotificationsError = (state: {
  notifications: NotificationsState;
}) => state.notifications.error;

export default notificationsSlice.reducer;
