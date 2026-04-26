import { buswayApi } from "./httpClient";
import { Stop, ApiResponse } from "../../types";

// Backend API endpoints for stops:
// GET /api/busway/stops - Get all stops
// GET /api/busway/stops/{id} - Get stop by ID
// GET /api/busway/stops/code/{code} - Get stop by code
// GET /api/busway/stops/route/{routeId} - Get stops by route
// GET /api/busway/stops/city/{city} - Get stops by city
// GET /api/busway/stops/zone/{zone} - Get stops by zone
// GET /api/busway/stops/nearest - Find nearest stops
// GET /api/busway/stops/top-nearest - Find top nearest stops
// GET /api/busway/stops/bbox - Find stops in bounding box
// GET /api/busway/stops/accessible - Get accessible stops
// GET /api/busway/stops/with-shelter - Get stops with shelter
// GET /api/busway/stops/with-bench - Get stops with bench
// GET /api/busway/stops/with-facilities - Get stops with both facilities
// GET /api/busway/stops/search - Search stops by name
// GET /api/busway/stops/distance - Calculate distance between stops
// GET /api/busway/stops/statistics - Get stop statistics
// GET /api/busway/stops/geojson - Export stops as GeoJSON
// POST /api/busway/stops - Create stop
// POST /api/busway/stops/bulk - Create multiple stops
// PUT /api/busway/stops/{id} - Update stop
// PATCH /api/busway/stops/{id} - Partial update stop
// PATCH /api/busway/stops/{id}/location - Update stop location
// PATCH /api/busway/stops/{id}/toggle-status - Toggle stop status
// DELETE /api/busway/stops/{id} - Delete stop
// DELETE /api/busway/stops/{id}/hard - Hard delete stop
// DELETE /api/busway/stops/bulk - Delete multiple stops

// StopRequest interface for creating/updating stops
export interface StopRequest {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  hasShelter?: boolean;
  wheelchairAccessible?: boolean;
  bench?: boolean;
  city?: string;
  zone?: string;
}

export const stopService = {
  // GET /api/busway/stops - Get all stops
  getAll: async (): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops");
    return response.data.data;
  },

  // GET /api/busway/stops/{id} - Get stop by ID
  getById: async (id: number): Promise<Stop> => {
    const response = await buswayApi.get<ApiResponse<Stop>>(`/stops/${id}`);
    return response.data.data;
  },

  // GET /api/busway/stops/code/{code} - Get stop by code
  getByCode: async (code: string): Promise<Stop> => {
    const response = await buswayApi.get<ApiResponse<Stop>>(`/stops/code/${code}`);
    return response.data.data;
  },

  // GET /api/busway/stops/route/{routeId} - Get stops by route
  getByRoute: async (routeId: number): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>(`/stops/route/${routeId}`);
    return response.data.data;
  },

  // GET /api/busway/stops/city/{city} - Get stops by city
  getByCity: async (city: string): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>(`/stops/city/${city}`);
    return response.data.data;
  },

  // GET /api/busway/stops/zone/{zone} - Get stops by zone
  getByZone: async (zone: string): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>(`/stops/zone/${zone}`);
    return response.data.data;
  },

  // GET /api/busway/stops/nearest - Find nearest stops
  getNearest: async (lat: number, lng: number, radius: number = 500): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/nearest", {
      params: { lat, lng, radius },
    });
    return response.data.data;
  },

  // GET /api/busway/stops/top-nearest - Find top nearest stops
  getTopNearest: async (lat: number, lng: number, limit: number = 5): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/top-nearest", {
      params: { lat, lng, limit },
    });
    return response.data.data;
  },

  // GET /api/busway/stops/bbox - Find stops in bounding box
  getInBbox: async (minLon: number, minLat: number, maxLon: number, maxLat: number): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/bbox", {
      params: { minLon, minLat, maxLon, maxLat },
    });
    return response.data.data;
  },

  // GET /api/busway/stops/accessible - Get accessible stops
  getAccessible: async (): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/accessible");
    return response.data.data;
  },

  // GET /api/busway/stops/with-shelter - Get stops with shelter
  getWithShelter: async (): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/with-shelter");
    return response.data.data;
  },

  // GET /api/busway/stops/with-bench - Get stops with bench
  getWithBench: async (): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/with-bench");
    return response.data.data;
  },

  // GET /api/busway/stops/with-facilities - Get stops with both facilities
  getWithFacilities: async (): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/with-facilities");
    return response.data.data;
  },

  // GET /api/busway/stops/search - Search stops by name
  search: async (query: string): Promise<Stop[]> => {
    const response = await buswayApi.get<ApiResponse<Stop[]>>("/stops/search", {
      params: { query },
    });
    return response.data.data;
  },

  // GET /api/busway/stops/distance - Calculate distance between stops
  getDistance: async (fromStopId: number, toStopId: number): Promise<number> => {
    const response = await buswayApi.get<ApiResponse<number>>("/stops/distance", {
      params: { from: fromStopId, to: toStopId },
    });
    return response.data.data;
  },

  // GET /api/busway/stops/statistics - Get stop statistics
  getStatistics: async (): Promise<any> => {
    const response = await buswayApi.get<ApiResponse<any>>("/stops/statistics");
    return response.data.data;
  },

  // GET /api/busway/stops/geojson - Export stops as GeoJSON
  getGeoJSON: async (): Promise<any> => {
    const response = await buswayApi.get<ApiResponse<any>>("/stops/geojson");
    return response.data.data;
  },

  // POST /api/busway/stops - Create stop
  create: async (stop: StopRequest): Promise<Stop> => {
    const response = await buswayApi.post<ApiResponse<Stop>>("/stops", stop);
    return response.data.data;
  },

  // POST /api/busway/stops/bulk - Create multiple stops
  createBulk: async (stops: StopRequest[]): Promise<Stop[]> => {
    const response = await buswayApi.post<ApiResponse<Stop[]>>("/stops/bulk", stops);
    return response.data.data;
  },

  // PUT /api/busway/stops/{id} - Update stop
  update: async (id: number, stop: Partial<StopRequest>): Promise<Stop> => {
    const response = await buswayApi.put<ApiResponse<Stop>>(`/stops/${id}`, stop);
    return response.data.data;
  },

  // PATCH /api/busway/stops/{id} - Partial update stop
  patch: async (id: number, stop: Partial<StopRequest>): Promise<Stop> => {
    const response = await buswayApi.patch<ApiResponse<Stop>>(`/stops/${id}`, stop);
    return response.data.data;
  },

  // PATCH /api/busway/stops/{id}/location - Update stop location
  updateLocation: async (id: number, lat: number, lng: number): Promise<Stop> => {
    const response = await buswayApi.patch<ApiResponse<Stop>>(`/stops/${id}/location`, {
      lat, lng
    });
    return response.data.data;
  },

  // PATCH /api/busway/stops/{id}/toggle-status - Toggle stop status
  toggleStatus: async (id: number): Promise<Stop> => {
    const response = await buswayApi.patch<ApiResponse<Stop>>(`/stops/${id}/toggle-status`);
    return response.data.data;
  },

  // DELETE /api/busway/stops/{id} - Delete stop (soft delete)
  delete: async (id: number): Promise<void> => {
    await buswayApi.delete(`/stops/${id}`);
  },

  // DELETE /api/busway/stops/{id}/hard - Hard delete stop
  hardDelete: async (id: number): Promise<void> => {
    await buswayApi.delete(`/stops/${id}/hard`);
  },

  // DELETE /api/busway/stops/bulk - Delete multiple stops
  deleteBulk: async (ids: number[]): Promise<void> => {
    await buswayApi.delete("/stops/bulk", { data: ids });
  },

  // Check API health
  checkApiHealth: async (): Promise<boolean> => {
    try {
      await buswayApi.get("/stops");
      return true;
    } catch {
      return false;
    }
  },
};
