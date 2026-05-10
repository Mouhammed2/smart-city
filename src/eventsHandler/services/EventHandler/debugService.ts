import { eventHandlerApi } from "./httpClient";
import { DebugHeadersResponse, ApiResponse } from "../../types";

// Backend API endpoints for Debug:
// GET /api/eventhandler/debug/headers - Show request headers

export const debugService = {
  // GET /api/eventhandler/debug/headers - Show request headers
  getHeaders: async (): Promise<DebugHeadersResponse> => {
    const response = await eventHandlerApi.get<ApiResponse<DebugHeadersResponse>>(
      "/debug/headers",
    );
    return response.data.data;
  },
};
