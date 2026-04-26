import { buswayApi } from "./httpClient";
import { Bus, ApiResponse } from "../../types";

// Backend API endpoints for buses:
// GET /api/busway/buses - Get all buses
// GET /api/busway/buses/{id} - Get bus by ID
// GET /api/busway/buses/number/{busNumber} - Get bus by number
// GET /api/busway/buses/nearest - Find nearest buses
// GET /api/busway/buses/top-nearest - Find top nearest buses
// GET /api/busway/buses/route/{routeId} - Get buses on route
// GET /api/busway/buses/approaching/{stopId} - Get buses approaching stop
// GET /api/busway/buses/heading-to-stop/{stopId} - Get buses heading to stop
// POST /api/busway/buses - Create bus
// PUT /api/busway/buses/{id} - Update bus
// DELETE /api/busway/buses/{id} - Delete bus
// PUT /api/busway/buses/{id}/location - Update location
// PUT /api/busway/buses/{id}/occupancy - Update occupancy
// PUT /api/busway/buses/{id}/status - Change status
// PUT /api/busway/buses/{id}/next-stop/{stopId} - Update next stop

export const busService = {
  // GET /api/busway/buses - Get all buses
  getAll: async (): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>("/buses");
    return response.data.data;
  },

  // GET /api/busway/buses/{id} - Get bus by ID
  getById: async (id: number): Promise<Bus> => {
    const response = await buswayApi.get<ApiResponse<Bus>>(`/buses/${id}`);
    return response.data.data;
  },

  // GET /api/busway/buses/number/{busNumber} - Get bus by number
  getByNumber: async (busNumber: string): Promise<Bus> => {
    const response = await buswayApi.get<ApiResponse<Bus>>(
      `/buses/number/${busNumber}`,
    );
    return response.data.data;
  },

  // GET /api/busway/buses/nearest - Find nearest buses
  findNearest: async (
    lat: number,
    lng: number,
    radius: number,
  ): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>("/buses/nearest", {
      params: { lat, lng, radius },
    });
    return response.data.data;
  },

  // GET /api/busway/buses/top-nearest - Find top nearest buses
  findTopNearest: async (
    lat: number,
    lng: number,
    limit: number = 5,
  ): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>(
      "/buses/top-nearest",
      {
        params: { lat, lng, limit },
      },
    );
    return response.data.data;
  },

  // GET /api/busway/buses/route/{routeId} - Get buses on route
  getByRoute: async (routeId: number): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>(
      `/buses/route/${routeId}`,
    );
    return response.data.data;
  },

  // GET /api/busway/buses/approaching/{stopId} - Get buses approaching stop
  getApproachingStop: async (stopId: number): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>(
      `/buses/approaching/${stopId}`,
    );
    return response.data.data;
  },

  // GET /api/busway/buses/heading-to-stop/{stopId} - Get buses heading to stop
  getHeadingToStop: async (stopId: number): Promise<Bus[]> => {
    const response = await buswayApi.get<ApiResponse<Bus[]>>(
      `/buses/heading-to-stop/${stopId}`,
    );
    return response.data.data;
  },

  // POST /api/busway/buses - Create bus
  create: async (bus: Omit<Bus, "id">): Promise<Bus> => {
    const response = await buswayApi.post<ApiResponse<Bus>>("/buses", bus);
    return response.data.data;
  },

  // PUT /api/busway/buses/{id} - Update bus
  update: async (id: number, bus: Partial<Bus>): Promise<Bus> => {
    const response = await buswayApi.put<ApiResponse<Bus>>(`/buses/${id}`, bus);
    return response.data.data;
  },

  // DELETE /api/busway/buses/{id} - Delete bus
  delete: async (id: number): Promise<void> => {
    await buswayApi.delete(`/buses/${id}`);
  },

  // PUT /api/busway/buses/{id}/location - Update location
  updateLocation: async (
    id: number,
    lat: number,
    lng: number,
    speed?: number,
    heading?: number,
  ): Promise<Bus> => {
    const response = await buswayApi.put<ApiResponse<Bus>>(
      `/buses/${id}/location`,
      {
        lat,
        lng,
        speed,
        heading,
      },
    );
    return response.data.data;
  },

  // PUT /api/busway/buses/{id}/occupancy - Update occupancy
  updateOccupancy: async (id: number, passengerCount: number): Promise<Bus> => {
    const response = await buswayApi.put<ApiResponse<Bus>>(
      `/buses/${id}/occupancy`,
      null,
      {
        params: { passengerCount },
      },
    );
    return response.data.data;
  },

  // PUT /api/busway/buses/{id}/status - Change status
  updateStatus: async (id: number, status: string): Promise<Bus> => {
    const response = await buswayApi.put<ApiResponse<Bus>>(
      `/buses/${id}/status`,
      null,
      {
        params: { status },
      },
    );
    return response.data.data;
  },

  // PUT /api/busway/buses/{id}/next-stop/{stopId} - Update next stop
  updateNextStop: async (id: number, stopId: number): Promise<Bus> => {
    const response = await buswayApi.put<ApiResponse<Bus>>(
      `/buses/${id}/next-stop/${stopId}`,
    );
    return response.data.data;
  },

  // Check if backend API is available
  checkApiHealth: async (): Promise<boolean> => {
    try {
      await buswayApi.get("/buses");
      return true;
    } catch {
      return false;
    }
  },
};
