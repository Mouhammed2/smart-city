import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "../../services/EventHandler/clientService";
import {
  UserPreferencesState,
  UserPreferences,
  UpdateUserPreferencesRequest,
} from "../../types";

const initialState: UserPreferencesState = {
  preferences: null,
  loading: false,
  error: null,
};

// Async thunks
export const getUserPreferences = createAsyncThunk(
  "userPreferences/getUserPreferences",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.getPreferences();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch preferences",
      );
    }
  },
);

export const checkPreferencesExists = createAsyncThunk(
  "userPreferences/checkPreferencesExists",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.checkPreferencesExists();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check preferences",
      );
    }
  },
);

export const initUserPreferences = createAsyncThunk(
  "userPreferences/initUserPreferences",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.initPreferences();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to initialize preferences",
      );
    }
  },
);

export const updateUserPreferences = createAsyncThunk(
  "userPreferences/updateUserPreferences",
  async (data: UpdateUserPreferencesRequest, { rejectWithValue }) => {
    try {
      return await clientService.updatePreferences(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update preferences",
      );
    }
  },
);

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    clearPreferencesError: (state) => {
      state.error = null;
    },
    resetPreferences: (state) => {
      state.preferences = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user preferences
      .addCase(getUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserPreferences.fulfilled,
        (state, action: PayloadAction<UserPreferences>) => {
          state.loading = false;
          state.preferences = action.payload;
        },
      )
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch preferences";
      })
      // Check preferences exists
      .addCase(checkPreferencesExists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkPreferencesExists.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.loading = false;
        },
      )
      .addCase(checkPreferencesExists.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to check preferences";
      })
      // Initialize preferences
      .addCase(initUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        initUserPreferences.fulfilled,
        (state, action: PayloadAction<UserPreferences>) => {
          state.loading = false;
          state.preferences = action.payload;
        },
      )
      .addCase(initUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to initialize preferences";
      })
      // Update preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserPreferences.fulfilled,
        (state, action: PayloadAction<UserPreferences>) => {
          state.loading = false;
          state.preferences = action.payload;
        },
      )
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update preferences";
      });
  },
});

export const { clearPreferencesError, resetPreferences } = userPreferencesSlice.actions;

// Selectors
export const selectUserPreferences = (state: { userPreferences: UserPreferencesState }) =>
  state.userPreferences.preferences;
export const selectUserPreferencesLoading = (state: { userPreferences: UserPreferencesState }) =>
  state.userPreferences.loading;
export const selectUserPreferencesError = (state: { userPreferences: UserPreferencesState }) =>
  state.userPreferences.error;

export default userPreferencesSlice.reducer;
