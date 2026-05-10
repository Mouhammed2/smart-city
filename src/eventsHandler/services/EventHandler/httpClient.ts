import axios from "axios";
import { getStoredToken } from "../../../shared/auth/tokenStorage";

const EVENTHANDLER_API_BASE_URL =
  process.env.REACT_APP_EVENTHANDLER_API_URL || "/api/eventhandler";

export const eventHandlerApi = axios.create({
  baseURL: EVENTHANDLER_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
eventHandlerApi.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error handling
eventHandlerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "EventHandler API Error:",
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);
