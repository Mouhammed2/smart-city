import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { adminService } from "../../services/EventHandler/adminService";
import {
  AdminState,
  Event,
  AdminCompany,
  AdminUser,
  DashboardStats,
  MonthlyStats,
  ValidateEventRequest,
  UpdateCompanyStatusRequest,
  UpdateUserRoleRequest,
  PaginatedResponse,
} from "../../types";

const initialState: AdminState = {
  pendingEvents: [],
  allEvents: null,
  companies: null,
  users: null,
  dashboardStats: null,
  monthlyStats: [],
  loading: false,
  error: null,
};

// Async thunks
export const getPendingEvents = createAsyncThunk(
  "admin/getPendingEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getPendingEvents();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch pending events",
      );
    }
  },
);

export const getAllAdminEvents = createAsyncThunk(
  "admin/getAllAdminEvents",
  async (
    params: { page?: number; size?: number; status?: string; type?: string },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.getAllEvents(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch events",
      );
    }
  },
);

export const getAdminEventById = createAsyncThunk(
  "admin/getAdminEventById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await adminService.getEventById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch event",
      );
    }
  },
);

export const validateEvent = createAsyncThunk(
  "admin/validateEvent",
  async (
    { id, data }: { id: number; data: ValidateEventRequest },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.validateEvent(id, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to validate event",
      );
    }
  },
);

export const deleteAdminEvent = createAsyncThunk(
  "admin/deleteAdminEvent",
  async (id: number, { rejectWithValue }) => {
    try {
      await adminService.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete event",
      );
    }
  },
);

export const getAllCompanies = createAsyncThunk(
  "admin/getAllCompanies",
  async (
    params: { page?: number; size?: number; status?: string },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.getAllCompanies(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch companies",
      );
    }
  },
);

export const getCompanyById = createAsyncThunk(
  "admin/getCompanyById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await adminService.getCompanyById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch company",
      );
    }
  },
);

export const updateCompanyStatus = createAsyncThunk(
  "admin/updateCompanyStatus",
  async (
    { id, data }: { id: number; data: UpdateCompanyStatusRequest },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.updateCompanyStatus(id, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to update company status",
      );
    }
  },
);

export const deleteCompany = createAsyncThunk(
  "admin/deleteCompany",
  async (id: number, { rejectWithValue }) => {
    try {
      await adminService.deleteCompany(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete company",
      );
    }
  },
);

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (
    params: { page?: number; size?: number; role?: string },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.getAllUsers(params);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch users",
      );
    }
  },
);

export const getUserById = createAsyncThunk(
  "admin/getUserById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await adminService.getUserById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async (
    { id, data }: { id: number; data: UpdateUserRoleRequest },
    { rejectWithValue },
  ) => {
    try {
      return await adminService.updateUserRole(id, data);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update user role",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    }
  },
);

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
      );
    }
  },
);

export const getMonthlyStats = createAsyncThunk(
  "admin/getMonthlyStats",
  async (year: number, { rejectWithValue }) => {
    try {
      return await adminService.getMonthlyStats(year);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to fetch monthly stats",
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdmin: (state) => {
      state.pendingEvents = [];
      state.allEvents = null;
      state.companies = null;
      state.users = null;
      state.dashboardStats = null;
      state.monthlyStats = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get pending events
      .addCase(getPendingEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getPendingEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.pendingEvents = action.payload;
        },
      )
      .addCase(getPendingEvents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch pending events";
      })
      // Get all events
      .addCase(getAllAdminEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAdminEvents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Event>>) => {
          state.loading = false;
          state.allEvents = action.payload;
        },
      )
      .addCase(getAllAdminEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch events";
      })
      // Get dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getDashboardStats.fulfilled,
        (state, action: PayloadAction<DashboardStats>) => {
          state.loading = false;
          state.dashboardStats = action.payload;
        },
      )
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch dashboard stats";
      })
      // Get monthly stats
      .addCase(getMonthlyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getMonthlyStats.fulfilled,
        (state, action: PayloadAction<MonthlyStats[]>) => {
          state.loading = false;
          state.monthlyStats = action.payload;
        },
      )
      .addCase(getMonthlyStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch monthly stats";
      })
      // Validate event
      .addCase(
        validateEvent.fulfilled,
        (state, action: PayloadAction<Event>) => {
          // Remove from pending if approved/rejected
          state.pendingEvents = state.pendingEvents.filter(
            (e) => e.id !== action.payload.id,
          );
          // Update in allEvents if exists
          if (state.allEvents) {
            const index = state.allEvents.items.findIndex(
              (e) => e.id === action.payload.id,
            );
            if (index !== -1) {
              state.allEvents.items[index] = action.payload;
            }
          }
        },
      )
      // Delete event
      .addCase(
        deleteAdminEvent.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.pendingEvents = state.pendingEvents.filter(
            (e) => e.id !== action.payload,
          );
          if (state.allEvents) {
            state.allEvents.items = state.allEvents.items.filter(
              (e) => e.id !== action.payload,
            );
          }
        },
      )
      // Get all companies
      .addCase(getAllCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllCompanies.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<AdminCompany>>) => {
          state.loading = false;
          state.companies = action.payload;
        },
      )
      .addCase(getAllCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch companies";
      })
      // Update company status
      .addCase(
        updateCompanyStatus.fulfilled,
        (state, action: PayloadAction<AdminCompany>) => {
          if (state.companies) {
            const index = state.companies.items.findIndex(
              (c) => c.id === action.payload.id,
            );
            if (index !== -1) {
              state.companies.items[index] = action.payload;
            }
          }
        },
      )
      // Delete company
      .addCase(
        deleteCompany.fulfilled,
        (state, action: PayloadAction<number>) => {
          if (state.companies) {
            state.companies.items = state.companies.items.filter(
              (c) => c.id !== action.payload,
            );
          }
        },
      )
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsers.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<AdminUser>>) => {
          state.loading = false;
          state.users = action.payload;
        },
      )
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch users";
      })
      // Update user role
      .addCase(
        updateUserRole.fulfilled,
        (state, action: PayloadAction<AdminUser>) => {
          if (state.users) {
            const index = state.users.items.findIndex(
              (u) => u.id === action.payload.id,
            );
            if (index !== -1) {
              state.users.items[index] = action.payload;
            }
          }
        },
      )
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        if (state.users) {
          state.users.items = state.users.items.filter(
            (u) => u.id !== action.payload,
          );
        }
      });
  },
});

export const { clearAdminError, resetAdmin } = adminSlice.actions;

// Selectors
export const selectPendingEvents = (state: { admin: AdminState }) =>
  state.admin.pendingEvents;
export const selectAllAdminEvents = (state: { admin: AdminState }) =>
  state.admin.allEvents;
export const selectCompanies = (state: { admin: AdminState }) =>
  state.admin.companies;
export const selectUsers = (state: { admin: AdminState }) => state.admin.users;
export const selectDashboardStats = (state: { admin: AdminState }) =>
  state.admin.dashboardStats;
export const selectMonthlyStats = (state: { admin: AdminState }) =>
  state.admin.monthlyStats;
export const selectAdminLoading = (state: { admin: AdminState }) =>
  state.admin.loading;
export const selectAdminError = (state: { admin: AdminState }) =>
  state.admin.error;

export default adminSlice.reducer;
