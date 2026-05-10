import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clientService } from "../../services/EventHandler/clientService";
import { FavoritesState, Favorite, FavoriteStatusResponse } from "../../types";

const initialState: FavoritesState = {
  favorites: [],
  statusMap: {},
  loading: false,
  error: null,
};

// Async thunks
export const getUserFavorites = createAsyncThunk(
  "favorites/getUserFavorites",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await clientService.getUserFavorites(userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch favorites",
      );
    }
  },
);

export const getFavoritesStatus = createAsyncThunk(
  "favorites/getFavoritesStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await clientService.getFavoritesStatus();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch favorites status",
      );
    }
  },
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (
    { eventId, userId }: { eventId: number; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await clientService.toggleFavorite(eventId, userId);
      return { eventId, isFavorited: result.isFavorited };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to toggle favorite",
      );
    }
  },
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavoritesError: (state) => {
      state.error = null;
    },
    resetFavorites: (state) => {
      state.favorites = [];
      state.statusMap = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user favorites
      .addCase(getUserFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserFavorites.fulfilled,
        (state, action: PayloadAction<Favorite[]>) => {
          state.loading = false;
          state.favorites = action.payload;
        },
      )
      .addCase(getUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch favorites";
      })
      // Get favorites status
      .addCase(getFavoritesStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFavoritesStatus.fulfilled,
        (
          state,
          action: PayloadAction<
            FavoriteStatusResponse | FavoriteStatusResponse[]
          >,
        ) => {
          state.loading = false;
          const statusMap: Record<number, boolean> = {};
          const items = Array.isArray(action.payload)
            ? action.payload
            : [action.payload];
          items.forEach((item) => {
            statusMap[item.eventId] = item.isFavorited;
          });
          state.statusMap = statusMap;
        },
      )
      .addCase(getFavoritesStatus.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch favorites status";
      })
      // Toggle favorite
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        toggleFavorite.fulfilled,
        (
          state,
          action: PayloadAction<{ eventId: number; isFavorited: boolean }>,
        ) => {
          state.loading = false;
          state.statusMap[action.payload.eventId] = action.payload.isFavorited;

          // Update favorites list
          if (action.payload.isFavorited) {
            // If favorited and not in list, we would need to fetch the event details
            // For now, we'll keep the existing favorites list
          } else {
            // If unfavorited, remove from favorites list
            state.favorites = state.favorites.filter(
              (f) => f.eventId !== action.payload.eventId,
            );
          }
        },
      )
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to toggle favorite";
      });
  },
});

export const { clearFavoritesError, resetFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: { favorites: FavoritesState }) =>
  state.favorites.favorites;
export const selectFavoritesStatusMap = (state: {
  favorites: FavoritesState;
}) => state.favorites.statusMap;
export const selectIsEventFavorited =
  (eventId: number) => (state: { favorites: FavoritesState }) =>
    state.favorites.statusMap[eventId] || false;
export const selectFavoritesLoading = (state: { favorites: FavoritesState }) =>
  state.favorites.loading;
export const selectFavoritesError = (state: { favorites: FavoritesState }) =>
  state.favorites.error;

export default favoritesSlice.reducer;
