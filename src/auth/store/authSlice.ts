import type { User, AuthState } from '../../busWay/types';
import axios from 'axios';
import { api } from '../../shared/api/httpClient';
import { getMe, login as loginRequest } from '../api/auth.api';

export type LoginPayload = {
  email: string;
  password: string;
  stayLogin?: boolean;
};

const TOKEN_KEY = 'busway_token';
const USER_KEY = 'busway_user';

type AuthSubscriber = (state: AuthState) => void;

const subscribers = new Set<AuthSubscriber>();

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return apiMessage || error.message || 'Login failed';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Login failed';
};

const normalizeUser = (raw: any, emailFallback: string): User => {
  const role = raw?.role === 'ADMIN' ? 'ADMIN' : 'USER';

  return {
    id: Number(raw?.id ?? 0),
    username: String(raw?.username ?? raw?.name ?? emailFallback),
    email: String(raw?.email ?? emailFallback),
    role,
    firstName: raw?.firstName,
    lastName: raw?.lastName,
  };
};

const unwrapUserPayload = (payload: User | { data: User }): User => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload as User;
};

const applyAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

const readStoredUser = (): User | null => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const readStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

let currentAuthState: AuthState = {
  user: readStoredUser(),
  isAuthenticated: !!readStoredUser(),
  loading: false,
  error: null,
};

const publishAuthState = () => {
  subscribers.forEach((subscriber) => {
    subscriber(currentAuthState);
  });
};

const setAuthState = (next: Partial<AuthState>) => {
  currentAuthState = { ...currentAuthState, ...next };
  publishAuthState();
};

export const getAuthState = (): AuthState => currentAuthState;

export const subscribeAuthState = (subscriber: AuthSubscriber): (() => void) => {
  subscribers.add(subscriber);

  return () => {
    subscribers.delete(subscriber);
  };
};

export const clearError = () => {
  setAuthState({ error: null });
};

export const login = async ({ email, password, stayLogin = false }: LoginPayload): Promise<User> => {
  setAuthState({ loading: true, error: null });

  try {
    const token = await loginRequest({ email, password, stayLogin });
    localStorage.setItem(TOKEN_KEY, token);
    applyAuthHeader(token);

    const meResponse = await getMe();
    const rawUser = unwrapUserPayload(meResponse.data);
    const user = normalizeUser(rawUser, email);

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    return user;
  } catch (error: unknown) {
    const message = extractErrorMessage(error);

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: message,
    });

    throw new Error(message);
  }
};

export const logout = async (): Promise<null> => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  applyAuthHeader(null);

  setAuthState({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  return null;
};

export const checkAuthStatus = async (): Promise<User | null> => {
  const storedUser = readStoredUser();

  if (storedUser) {
    setAuthState({
      user: storedUser,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
    return storedUser;
  }

  const token = readStoredToken();

  if (!token) {
    setAuthState({ user: null, isAuthenticated: false, loading: false, error: null });
    return null;
  }

  setAuthState({ loading: true, error: null });

  try {
    applyAuthHeader(token);
    const response = await getMe();
    const rawUser = unwrapUserPayload(response.data);
    const user = normalizeUser(rawUser, 'user@domain.com');

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
      error: null,
    });

    return user;
  } catch {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    applyAuthHeader(null);

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    return null;
  }
};

const selectFromState = (state?: { auth?: AuthState }): AuthState => {
  return state?.auth ?? currentAuthState;
};

export const selectCurrentUser = (state?: { auth?: AuthState }) => selectFromState(state).user;
export const selectIsAuthenticated = (state?: { auth?: AuthState }) => selectFromState(state).isAuthenticated;
export const selectIsAdmin = (state?: { auth?: AuthState }) => selectFromState(state).user?.role === 'ADMIN';
export const selectAuthLoading = (state?: { auth?: AuthState }) => selectFromState(state).loading;
export const selectAuthError = (state?: { auth?: AuthState }) => selectFromState(state).error;

const authReducer = (state: AuthState = currentAuthState): AuthState => {
  return state;
};

applyAuthHeader(readStoredToken());

export default authReducer;
