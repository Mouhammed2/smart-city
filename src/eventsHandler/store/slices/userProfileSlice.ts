import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "../../services/EventHandler/clientService";
import {
  UserProfileState,
  UserProfile,
  CompleteProfileRequest,
} from "../../types";

const initialState: UserProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunks
export const getUserProfile = createAsyncThunk(
  "userProfile/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.getProfile();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile",
      );
    }
  },
);

export const checkProfileExists = createAsyncThunk(
  "userProfile/checkProfileExists",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.checkProfileExists();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to check profile",
      );
    }
  },
);

export const completeProfile = createAsyncThunk(
  "userProfile/completeProfile",
  async (data: CompleteProfileRequest, { rejectWithValue }) => {
    try {
      return await clientService.completeProfile(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to complete profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (data: Partial<CompleteProfileRequest>, { rejectWithValue }) => {
    try {
      return await clientService.updateProfile(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    }
  },
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch profile";
      })
      // Complete profile
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        completeProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to complete profile";
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update profile";
      });
  },
});

export const { clearProfileError, resetProfile } = userProfileSlice.actions;

// Selectors
export const selectUserProfile = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profile;
export const selectUserProfileLoading = (state: { userProfile: UserProfileState }) =>
  state.userProfile.loading;
export const selectUserProfileError = (state: { userProfile: UserProfileState }) =>
  state.userProfile.error;

export default userProfileSlice.reducer;
