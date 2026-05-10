import { eventHandlerApi } from "./httpClient";
import {
  CompanyProfile,
  CompleteCompanyProfileRequest,
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

// Backend API endpoints for Company (from documentation):
//
// Profile:
// GET /api/eventhandler/companyprofile/exists
// GET /api/eventhandler/companyprofile
// POST /api/eventhandler/companyprofile/complete
// PUT /api/eventhandler/companyprofile
//
// Events:
// POST /api/eventhandler/company/events
// GET /api/eventhandler/company/events
// PUT /api/eventhandler/company/events/{eventId}

export const companyService = {
  // ============================================================================
  // Company Profile
  // ============================================================================

  // GET /api/eventhandler/companyprofile/exists
  checkProfileExists: async (): Promise<boolean> => {
    console.log("[DEBUG] Calling GET /companyprofile/exists");
    const response = await eventHandlerApi.get<ApiResponse<boolean>>(
      "/companyprofile/exists",
    );
    console.log("[DEBUG] Profile exists response:", response.data);
    return response.data.data;
  },

  // GET /api/eventhandler/companyprofile
  getProfile: async (): Promise<CompanyProfile> => {
    const response =
      await eventHandlerApi.get<ApiResponse<CompanyProfile>>("/companyprofile");
    return response.data.data;
  },

  // POST /api/eventhandler/companyprofile/complete
  completeProfile: async (
    data: CompleteCompanyProfileRequest,
  ): Promise<CompanyProfile> => {
    const response = await eventHandlerApi.post<ApiResponse<CompanyProfile>>(
      "/companyprofile/complete",
      data,
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/companyprofile
  updateProfile: async (
    data: Partial<CompleteCompanyProfileRequest>,
  ): Promise<CompanyProfile> => {
    const response = await eventHandlerApi.put<ApiResponse<CompanyProfile>>(
      "/companyprofile",
      data,
    );
    return response.data.data;
  },

  // ============================================================================
  // Company Events
  // ============================================================================

  // POST /api/eventhandler/company/events - Create event
  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    const response = await eventHandlerApi.post<ApiResponse<Event>>(
      "/company/events",
      data,
    );
    return response.data.data;
  },

  // GET /api/eventhandler/company/events - Get company events
  getCompanyEvents: async (params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Event>> => {
    console.log("[DEBUG] Calling GET /company/events with params:", params);
    const response = await eventHandlerApi.get<ApiResponse<unknown>>(
      "/company/events",
      { params },
    );
    console.log("[DEBUG] Response status:", response.status);
    const rawData = response.data.data;
    console.log("[DEBUG] getCompanyEvents raw response:", response.data);
    console.log(
      "[DEBUG] rawData type:",
      typeof rawData,
      "isArray:",
      Array.isArray(rawData),
    );
    // Handle both paginated response, flat array, and single object from backend
    if (Array.isArray(rawData)) {
      return {
        items: rawData as Event[],
        totalCount: (rawData as Event[]).length,
        totalPages: 1,
        pageSize: (rawData as Event[]).length,
        page: 0,
      };
    }
    // If backend returns a single event object instead of array
    if (rawData && typeof rawData === "object" && "id" in rawData) {
      const singleEvent = rawData as Event;
      return {
        items: [singleEvent],
        totalCount: 1,
        totalPages: 1,
        pageSize: 1,
        page: 0,
      };
    }
    return rawData as PaginatedResponse<Event>;
  },

  // PUT /api/eventhandler/company/events/{eventId} - Update event
  updateEvent: async (
    eventId: number,
    data: UpdateEventRequest,
  ): Promise<Event> => {
    const response = await eventHandlerApi.put<ApiResponse<Event>>(
      `/company/events/${eventId}`,
      data,
    );
    return response.data.data;
  },
};
