import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { companyService } from "../../services/EventHandler/companyService";
import {
  CompanyState,
  CompanyProfile,
  CompleteCompanyProfileRequest,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  PaginatedResponse,
} from "../../types";

const initialState: CompanyState = {
  profile: null,
  companyEvents: [],
  loading: false,
  error: null,
};

// Async thunks
export const getCompanyProfile = createAsyncThunk(
  "company/getCompanyProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await companyService.getProfile();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch company profile",
      );
    }
  },
);

export const checkCompanyProfileExists = createAsyncThunk(
  "company/checkCompanyProfileExists",
  async (_, { rejectWithValue }) => {
    try {
      return await companyService.checkProfileExists();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to check company profile",
      );
    }
  },
);

export const completeCompanyProfile = createAsyncThunk(
  "company/completeCompanyProfile",
  async (data: CompleteCompanyProfileRequest, { rejectWithValue }) => {
    try {
      return await companyService.completeProfile(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to complete company profile",
      );
    }
  },
);

export const updateCompanyProfile = createAsyncThunk(
  "company/updateCompanyProfile",
  async (data: Partial<CompleteCompanyProfileRequest>, { rejectWithValue }) => {
    try {
      return await companyService.updateProfile(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update company profile",
      );
    }
  },
);

export const getCompanyEvents = createAsyncThunk(
  "company/getCompanyEvents",
  async (
    params: { page?: number; size?: number; status?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      return await companyService.getCompanyEvents(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch company events",
      );
    }
  },
);

export const createCompanyEvent = createAsyncThunk(
  "company/createCompanyEvent",
  async (data: CreateEventRequest, { rejectWithValue }) => {
    try {
      return await companyService.createEvent(data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create event",
      );
    }
  },
);

export const updateCompanyEvent = createAsyncThunk(
  "company/updateCompanyEvent",
  async (
    { eventId, data }: { eventId: number; data: UpdateEventRequest },
    { rejectWithValue },
  ) => {
    try {
      return await companyService.updateEvent(eventId, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update event",
      );
    }
  },
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompanyError: (state) => {
      state.error = null;
    },
    resetCompany: (state) => {
      state.profile = null;
      state.companyEvents = [];
      state.loading = false;
      state.error = null;
    },
    removeCompanyEvent: (state, action: PayloadAction<number>) => {
      state.companyEvents = state.companyEvents.filter(
        (e) => e.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Check company profile exists
      .addCase(checkCompanyProfileExists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkCompanyProfileExists.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkCompanyProfileExists.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to check company profile";
      })
      // Get company profile
      .addCase(getCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCompanyProfile.fulfilled,
        (state, action: PayloadAction<CompanyProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(getCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch company profile";
      })
      // Complete company profile
      .addCase(completeCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        completeCompanyProfile.fulfilled,
        (state, action: PayloadAction<CompanyProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(completeCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to complete company profile";
      })
      // Update company profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompanyProfile.fulfilled,
        (state, action: PayloadAction<CompanyProfile>) => {
          state.loading = false;
          state.profile = action.payload;
        },
      )
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to update company profile";
      })
      // Get company events
      .addCase(getCompanyEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCompanyEvents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Event>>) => {
          state.loading = false;
          state.companyEvents = action.payload.items;
        },
      )
      .addCase(getCompanyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch company events";
      })
      // Create company event
      .addCase(createCompanyEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCompanyEvent.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          state.companyEvents.push(action.payload);
        },
      )
      .addCase(createCompanyEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create event";
      })
      // Update company event
      .addCase(updateCompanyEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCompanyEvent.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          const index = state.companyEvents.findIndex(
            (e) => e.id === action.payload.id,
          );
          if (index !== -1) {
            state.companyEvents[index] = action.payload;
          }
        },
      )
      .addCase(updateCompanyEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update event";
      });
  },
});

export const { clearCompanyError, resetCompany, removeCompanyEvent } =
  companySlice.actions;

// Selectors
export const selectCompanyProfile = (state: { company: CompanyState }) =>
  state.company.profile;
export const selectCompanyEvents = (state: { company: CompanyState }) =>
  state.company.companyEvents;
export const selectCompanyLoading = (state: { company: CompanyState }) =>
  state.company.loading;
export const selectCompanyError = (state: { company: CompanyState }) =>
  state.company.error;

export default companySlice.reducer;
