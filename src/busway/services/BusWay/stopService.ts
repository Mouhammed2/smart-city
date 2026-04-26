import { buswayApi } from "./httpClient";
import { Stop, ApiResponse } from "../../types";

// Mock data for testing without backend
const mockStops: Stop[] = [
  {
    id: 1,
    code: "S001",
    name: "Times Square Station",
    latitude: 40.758,
    longitude: -73.9855,
    address: "Times Square, Manhattan",
    hasShelter: true,
    wheelchairAccessible: true,
    bench: true,
    city: "New York",
  },
  {
    id: 2,
    code: "S002",
    name: "Central Park South",
    latitude: 40.7654,
    longitude: -73.9757,
    address: "Central Park South, Manhattan",
    hasShelter: true,
    wheelchairAccessible: true,
    bench: true,
    city: "New York",
  },
  {
    id: 3,
    code: "S003",
    name: "Grand Central Terminal",
    latitude: 40.7527,
    longitude: -73.9772,
    address: "42nd St & Park Ave, Manhattan",
    hasShelter: true,
    wheelchairAccessible: true,
    bench: true,
    city: "New York",
  },
  {
    id: 4,
    code: "S004",
    name: "Penn Station",
    latitude: 40.7505,
    longitude: -73.9934,
    address: "34th St & 8th Ave, Manhattan",
    hasShelter: true,
    wheelchairAccessible: true,
    bench: true,
    city: "New York",
  },
  {
    id: 5,
    code: "S005",
    name: "Wall Street Station",
    latitude: 40.7074,
    longitude: -74.0113,
    address: "Wall Street, Manhattan",
    hasShelter: false,
    wheelchairAccessible: false,
    bench: true,
    city: "New York",
  },
];

// Use mock data flag - set to false when backend is ready
const USE_MOCK_DATA = false;

export const stopService = {
  // Get all stops
  getAll: async (): Promise<Stop[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockStops), 500);
      });
    }
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops");
    return response.data.data;
  },

  // Get stop by ID
  getById: async (id: number): Promise<Stop> => {
    if (USE_MOCK_DATA) {
      const stop = mockStops.find((s) => s.id === id);
      if (!stop) throw new Error("Stop not found");
      return stop;
    }
    const response = await buswayApi.get<ApiResponse<Stop>>(`/stops/${id}`);
    return response.data.data;
  },

  // Get stop by code
  getByCode: async (code: string): Promise<Stop> => {
    if (USE_MOCK_DATA) {
      const stop = mockStops.find((s) => s.code === code);
      if (!stop) throw new Error("Stop not found");
      return stop;
    }
    const response = await buswayApi.get<ApiResponse<Stop>>(
      `/stops/code/${code}`,
    );
    return response.data.data;
  },

  // Get nearest stops
  getNearest: async (
    lat: number,
    lng: number,
    radius: number = 500,
  ): Promise<Stop[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockStops.slice(0, 3)), 300);
      });
    }
    const response = await buswayApi.get<ApiResponse<Stop[]>>(
      "/stops/nearest",
      {
        params: { lat, lng, radius },
      },
    );
    return response.data.data;
  },

  // Get wheelchair accessible stops
  getAccessible: async (): Promise<Stop[]> => {
    if (USE_MOCK_DATA) {
      return mockStops.filter((stop) => stop.wheelchairAccessible);
    }
    const response =
      await buswayApi.get<ApiResponse<Stop[]>>("/stops/accessible");
    return response.data.data;
  },

  // Get stops with shelter
  getWithShelter: async (): Promise<Stop[]> => {
    if (USE_MOCK_DATA) {
      return mockStops.filter((stop) => stop.hasShelter);
    }
    const response = await buswayApi.get<ApiResponse<Stop[]>>(
      "/stops/with-shelter",
    );
    return response.data.data;
  },

  // Get stops with bench
  getWithBench: async (): Promise<Stop[]> => {
    if (USE_MOCK_DATA) {
      return mockStops.filter((stop) => stop.bench);
    }
    const response =
      await buswayApi.get<ApiResponse<Stop[]>>("/stops/with-bench");
    return response.data.data;
  },

  // Create stop (admin)
  create: async (stop: Omit<Stop, "id">): Promise<Stop> => {
    if (USE_MOCK_DATA) {
      const newStop = {
        ...stop,
        id: Math.max(...mockStops.map((s) => s.id)) + 1,
      };
      mockStops.push(newStop as Stop);
      return newStop as Stop;
    }
    const response = await buswayApi.post<ApiResponse<Stop>>("/stops", stop);
    return response.data.data;
  },

  // Update stop (admin)
  update: async (id: number, stop: Partial<Stop>): Promise<Stop> => {
    if (USE_MOCK_DATA) {
      const index = mockStops.findIndex((s) => s.id === id);
      if (index === -1) throw new Error("Stop not found");
      mockStops[index] = { ...mockStops[index], ...stop };
      return mockStops[index];
    }
    const response = await buswayApi.put<ApiResponse<Stop>>(
      `/stops/${id}`,
      stop,
    );
    return response.data.data;
  },

  // Delete stop (admin)
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockStops.findIndex((s) => s.id === id);
      if (index !== -1) mockStops.splice(index, 1);
      return;
    }
    await buswayApi.delete(`/stops/${id}`);
  },
};
