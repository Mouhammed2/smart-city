import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../../types';

// Mock authentication - in production, this would call your backend API
const resolveMockUser = (usernameOrEmail: string): 'admin' | 'user' | null => {
  const value = usernameOrEmail.trim().toLowerCase();

  if (value === 'admin' || value === 'admin@busway.com') {
    return 'admin';
  }

  if (value === 'user' || value === 'user@busway.com') {
    return 'user';
  }

  return null;
};

const mockLogin = async (username: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  const account = resolveMockUser(username);

  if (account === 'admin' && password === 'admin') {
    return {
      id: 1,
      username: 'admin',
      email: 'admin@busway.com',
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    };
  } else if (account === 'user' && password === 'user') {
    return {
      id: 2,
      username: 'user',
      email: 'user@busway.com',
      role: 'USER',
      firstName: 'Regular',
      lastName: 'User',
    };
  }

  throw new Error('Invalid credentials');
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await mockLogin(username, password);
      // Store in localStorage for persistence
      localStorage.setItem('busway_user', JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('busway_user');
    return null;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const storedUser = localStorage.getItem('busway_user');
    if (storedUser) {
      return JSON.parse(storedUser) as User;
    }
    return null;
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // For development/testing - quick role switch
    setRole: (state, action: PayloadAction<'USER' | 'ADMIN'>) => {
      if (state.user) {
        state.user.role = action.payload;
        localStorage.setItem('busway_user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Check auth status
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    });
  },
});

// Actions
export const { clearError, setRole } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsAdmin = (state: { auth: AuthState }) => state.auth.user?.role === 'ADMIN';
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;

