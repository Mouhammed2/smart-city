import axios from 'axios';
import { getStoredToken } from '../../../shared/auth/tokenStorage';

const BUSWAY_API_BASE_URL = process.env.REACT_APP_BUSWAY_API_URL || '/api/busway';

export const buswayApi = axios.create({
  baseURL: BUSWAY_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
buswayApi.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error handling
buswayApi.interceptors.response.use(
  response => response,
  error => {
    console.error('BusWay API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
