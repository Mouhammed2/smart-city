import { buswayApi } from "./httpClient";
import { Route, ApiResponse } from "../../types";

// Backend API endpoints for routes:
// GET /api/busway/routes - Get all routes
// GET /api/busway/routes/{id} - Get route by ID
// GET /api/busway/routes/number/{routeNumber} - Get route by number
// GET /api/busway/routes/search - Search routes
// GET /api/busway/routes/nearby - Find nearby routes
// GET /api/busway/routes/bbox - Find routes in bounding box
// GET /api/busway/routes/{id}/length - Get route length
// GET /api/busway/routes/{id}/connections - Get connecting routes
// POST /api/busway/routes - Create route
// PUT /api/busway/routes/{id} - Update route
// DELETE /api/busway/routes/{id} - Delete route
// DELETE /api/busway/routes/{id}/hard - Hard delete route

// RouteRequest interface for creating/updating routes
export interface RouteRequest {
  routeNumber: string;
  name: string;
  color: string;
  coordinates: [number, number][]; // [lng, lat] pairs
}

export const routeService = {
  // GET /api/busway/routes - Get all routes
  getAll: async (): Promise<Route[]> => {
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes");
    return response.data.data;
  },

  // GET /api/busway/routes/{id} - Get route by ID
  getById: async (id: number): Promise<Route> => {
    const response = await buswayApi.get<ApiResponse<Route>>(`/routes/${id}`);
    return response.data.data;
  },

  // GET /api/busway/routes/number/{routeNumber} - Get route by number
  getByNumber: async (routeNumber: string): Promise<Route> => {
    const response = await buswayApi.get<ApiResponse<Route>>(`/routes/number/${routeNumber}`);
    return response.data.data;
  },

  // GET /api/busway/routes/search - Search routes
  search: async (query: string): Promise<Route[]> => {
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes/search", {
      params: { query },
    });
    return response.data.data;
  },

  // GET /api/busway/routes/nearby - Find nearby routes
  getNearby: async (lat: number, lng: number, radius: number = 500): Promise<Route[]> => {
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes/nearby", {
      params: { lat, lng, radius },
    });
    return response.data.data;
  },

  // GET /api/busway/routes/bbox - Find routes in bounding box
  getInBbox: async (minLon: number, minLat: number, maxLon: number, maxLat: number): Promise<Route[]> => {
    const response = await buswayApi.get<ApiResponse<Route[]>>("/routes/bbox", {
      params: { minLon, minLat, maxLon, maxLat },
    });
    return response.data.data;
  },

  // GET /api/busway/routes/{id}/length - Get route length
  getLength: async (id: number): Promise<number> => {
    const response = await buswayApi.get<ApiResponse<number>>(`/routes/${id}/length`);
    return response.data.data;
  },

  // GET /api/busway/routes/{id}/connections - Get connecting routes
  getConnections: async (id: number): Promise<Route[]> => {
    const response = await buswayApi.get<ApiResponse<Route[]>>(`/routes/${id}/connections`);
    return response.data.data;
  },

  // POST /api/busway/routes - Create route
  create: async (route: RouteRequest): Promise<Route> => {
    const response = await buswayApi.post<ApiResponse<Route>>("/routes", route);
    return response.data.data;
  },

  // PUT /api/busway/routes/{id} - Update route
  update: async (id: number, route: Partial<RouteRequest>): Promise<Route> => {
    const response = await buswayApi.put<ApiResponse<Route>>(`/routes/${id}`, route);
    return response.data.data;
  },

  // DELETE /api/busway/routes/{id} - Delete route (soft delete)
  delete: async (id: number): Promise<void> => {
    await buswayApi.delete(`/routes/${id}`);
  },

  // DELETE /api/busway/routes/{id}/hard - Hard delete route
  hardDelete: async (id: number): Promise<void> => {
    await buswayApi.delete(`/routes/${id}/hard`);
  },

  // Check API health
  checkApiHealth: async (): Promise<boolean> => {
    try {
      await buswayApi.get("/routes");
      return true;
    } catch {
      return false;
    }
  },
};
