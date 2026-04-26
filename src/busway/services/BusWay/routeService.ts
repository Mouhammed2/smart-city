import { buswayApi } from "./httpClient";
import { Route, ApiResponse } from "../../types";

// Mock data for testing without backend
const mockRoutes: Route[] = [
  {
    id: 1,
    routeNumber: "101",
    name: "Downtown Express",
    color: "#2563EB",
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.9857, 40.7484],
        [-73.98, 40.75],
        [-73.975, 40.752],
        [-73.97, 40.755],
      ],
    },
  },
  {
    id: 2,
    routeNumber: "202",
    name: "Airport Shuttle",
    color: "#10B981",
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.99, 40.74],
        [-73.985, 40.745],
        [-73.98, 40.75],
        [-73.978, 40.76],
      ],
    },
  },
  {
    id: 3,
    routeNumber: "303",
    name: "University Loop",
    color: "#F59E0B",
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.98, 40.765],
        [-73.975, 40.76],
        [-73.97, 40.755],
        [-73.965, 40.75],
      ],
    },
  },
  {
    id: 4,
    routeNumber: "404",
    name: "Beach Connector",
    color: "#EF4444",
    geometry: {
      type: "LineString",
      coordinates: [
        [-73.995, 40.73],
        [-73.99, 40.735],
        [-73.985, 40.74],
        [-73.98, 40.745],
      ],
    },
  },
];

// Use mock data flag - set to false when backend is ready
const USE_MOCK_DATA = false;

export const routeService = {
  // Get all routes
  getAll: async (): Promise<Route[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockRoutes), 500);
      });
    }
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes");
    return response.data.data;
  },

  // Get route by ID
  getById: async (id: number): Promise<Route> => {
    if (USE_MOCK_DATA) {
      const route = mockRoutes.find((r) => r.id === id);
      if (!route) throw new Error("Route not found");
      return route;
    }
    const response = await buswayApi.get<ApiResponse<Route>>(`/routes/${id}`);
    return response.data.data;
  },

  // Get nearby routes
  getNearby: async (
    lat: number,
    lng: number,
    radius: number = 500,
  ): Promise<Route[]> => {
    if (USE_MOCK_DATA) {
      return mockRoutes;
    }
    const response = await buswayApi.get<ApiResponse<Route[]>>(
      "/routes/nearby",
      {
        params: { lat, lng, radius },
      },
    );
    return response.data.data;
  },

  // Get routes in bounding box
  getInBbox: async (
    minLon: number,
    minLat: number,
    maxLon: number,
    maxLat: number,
  ): Promise<Route[]> => {
    if (USE_MOCK_DATA) {
      return mockRoutes;
    }
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes/bbox", {
      params: { minLon, minLat, maxLon, maxLat },
    });
    return response.data.data;
  },

  // Create route (admin)
  create: async (route: Omit<Route, "id">): Promise<Route> => {
    if (USE_MOCK_DATA) {
      const newRoute = {
        ...route,
        id: Math.max(...mockRoutes.map((r) => r.id)) + 1,
      };
      mockRoutes.push(newRoute as Route);
      return newRoute as Route;
    }
    const response = await buswayApi.post<ApiResponse<Route>>("/routes", route);
    return response.data.data;
  },

  // Update route (admin)
  update: async (id: number, route: Partial<Route>): Promise<Route> => {
    if (USE_MOCK_DATA) {
      const index = mockRoutes.findIndex((r) => r.id === id);
      if (index === -1) throw new Error("Route not found");
      mockRoutes[index] = { ...mockRoutes[index], ...route };
      return mockRoutes[index];
    }
    const response = await buswayApi.put<ApiResponse<Route>>(
      `/routes/${id}`,
      route,
    );
    return response.data.data;
  },

  // Delete route (admin)
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockRoutes.findIndex((r) => r.id === id);
      if (index !== -1) mockRoutes.splice(index, 1);
      return;
    }
    await buswayApi.delete(`/routes/${id}`);
  },
};
