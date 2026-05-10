import { eventHandlerApi } from "./httpClient";
import {
  Event,
  EventSearchParams,
  EventMapData,
  ShareLinkResponse,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

// Backend API endpoints for Public Events:
// GET /api/eventhandler/event - Get events (searchable)
// GET /api/eventhandler/event/{id} - Get event details
// GET /api/eventhandler/event/map - Get events for map
// GET /api/eventhandler/event/{id}/share - Get share link

export const eventService = {
  // GET /api/eventhandler/event - Get events (searchable)
  searchEvents: async (
    params?: EventSearchParams,
  ): Promise<PaginatedResponse<Event>> => {
    const response = await eventHandlerApi.get<ApiResponse<unknown>>("/event", {
      params,
    });
    const rawData = response.data.data;
    // Handle both paginated response and flat array from backend
    if (Array.isArray(rawData)) {
      return {
        items: rawData as Event[],
        totalCount: (rawData as Event[]).length,
        totalPages: 1,
        pageSize: (rawData as Event[]).length,
        page: 0,
      };
    }
    return rawData as PaginatedResponse<Event>;
  },

  // GET /api/eventhandler/event/{id} - Get event details
  getEventById: async (id: number): Promise<Event> => {
    const response = await eventHandlerApi.get<ApiResponse<Event>>(
      `/event/${id}`,
    );
    return response.data.data;
  },

  // GET /api/eventhandler/event/map - Get events for map
  getEventsForMap: async (
    bounds?: { north: number; south: number; east: number; west: number },
    filters?: { category?: string; startDate?: string; endDate?: string },
  ): Promise<EventMapData[]> => {
    const params = { ...bounds, ...filters };
    const response = await eventHandlerApi.get<ApiResponse<unknown>>(
      "/event/map",
      { params },
    );
    const rawData = response.data.data;
    return Array.isArray(rawData) ? (rawData as EventMapData[]) : [];
  },

  // GET /api/eventhandler/event/{id}/share - Get share link
  getShareLink: async (id: number): Promise<ShareLinkResponse> => {
    const response = await eventHandlerApi.get<ApiResponse<ShareLinkResponse>>(
      `/event/${id}/share`,
    );
    return response.data.data;
  },

  // Check if backend API is available
  checkApiHealth: async (): Promise<boolean> => {
    try {
      await eventHandlerApi.get("/event");
      return true;
    } catch {
      return false;
    }
  },
};
