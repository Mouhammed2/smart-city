import axios from 'axios';
import { clearStoredToken, getStoredToken, getTokenPersistence, setStoredToken } from '../auth/tokenStorage';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error?.response?.status;
    const requestUrl = originalRequest?.url ?? '';

    const isAuthCall =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/refresh');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthCall) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await refreshClient.post('/auth/refresh', {});
        const refreshedToken =
          (refreshResponse?.data?.data?.token as string | undefined) ??
          (refreshResponse?.data?.data?.accessToken as string | undefined);

        if (!refreshedToken) {
          clearStoredToken();
          return Promise.reject(error);
        }

        setStoredToken(refreshedToken, getTokenPersistence());
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStoredToken();
        return Promise.reject(refreshError);
      }
    }

    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

