import { eventHandlerApi } from "./httpClient";
import {
  Event,
  AdminCompany,
  AdminUser,
  DashboardStats,
  MonthlyStats,
  ValidateEventRequest,
  UpdateCompanyStatusRequest,
  UpdateUserRoleRequest,
  Notification,
  ApiResponse,
  PaginatedResponse,
} from "../../types";

// Backend API endpoints for Admin (from documentation):
//
// Events:
// GET /api/eventhandler/admin/events/pending
// GET /api/eventhandler/admin/events
// GET /api/eventhandler/admin/events/{id}
// POST /api/eventhandler/admin/events/{id}/validate
// DELETE /api/eventhandler/admin/events/{id}
//
// Companies:
// GET /api/eventhandler/admin/companies
// GET /api/eventhandler/admin/companies/{id}
// PUT /api/eventhandler/admin/companies/{id}/status
// DELETE /api/eventhandler/admin/companies/{id}
//
// Users:
// GET /api/eventhandler/admin/users
// GET /api/eventhandler/admin/users/{id}
// PUT /api/eventhandler/admin/users/{id}/role
// DELETE /api/eventhandler/admin/users/{id}
//
// Notifications:
// POST /api/eventhandler/admin/notifications/send-to-user/{userId}
// POST /api/eventhandler/admin/notifications/broadcast
// POST /api/eventhandler/admin/notifications/broadcast-to-users
// POST /api/eventhandler/admin/notifications/notify-new-event/{eventId}
// POST /api/eventhandler/admin/notifications/notify-event-update/{eventId}
//
// Dashboard:
// GET /api/eventhandler/admin/dashboard/stats
// GET /api/eventhandler/admin/dashboard/monthly/{year}

export const adminService = {
  // ============================================================================
  // Admin Events
  // ============================================================================

  // GET /api/eventhandler/admin/events/pending
  getPendingEvents: async (): Promise<Event[]> => {
    const response = await eventHandlerApi.get<ApiResponse<Event[]>>(
      "/admin/events/pending",
    );
    return response.data.data;
  },

  // GET /api/eventhandler/admin/events
  getAllEvents: async (params?: {
    page?: number;
    size?: number;
    status?: string;
    type?: string;
  }): Promise<PaginatedResponse<Event>> => {
    const response = await eventHandlerApi.get<
      ApiResponse<PaginatedResponse<Event>>
    >("/admin/events", { params });
    return response.data.data;
  },

  // GET /api/eventhandler/admin/events/{id}
  getEventById: async (id: number): Promise<Event> => {
    const response = await eventHandlerApi.get<ApiResponse<Event>>(
      `/admin/events/${id}`,
    );
    return response.data.data;
  },

  // POST /api/eventhandler/admin/events/{id}/validate
  validateEvent: async (
    id: number,
    data: ValidateEventRequest,
  ): Promise<Event> => {
    const response = await eventHandlerApi.post<ApiResponse<Event>>(
      `/admin/events/${id}/validate`,
      data,
    );
    return response.data.data;
  },

  // DELETE /api/eventhandler/admin/events/{id}
  deleteEvent: async (id: number): Promise<void> => {
    await eventHandlerApi.delete(`/admin/events/${id}`);
  },

  // ============================================================================
  // Admin Companies
  // ============================================================================

  // GET /api/eventhandler/admin/companies
  getAllCompanies: async (params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<AdminCompany>> => {
    const response = await eventHandlerApi.get<
      ApiResponse<PaginatedResponse<AdminCompany>>
    >("/admin/companies", { params });
    return response.data.data;
  },

  // GET /api/eventhandler/admin/companies/{id}
  getCompanyById: async (id: number): Promise<AdminCompany> => {
    const response = await eventHandlerApi.get<ApiResponse<AdminCompany>>(
      `/admin/companies/${id}`,
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/admin/companies/{id}/status
  updateCompanyStatus: async (
    id: number,
    data: UpdateCompanyStatusRequest,
  ): Promise<AdminCompany> => {
    const response = await eventHandlerApi.put<ApiResponse<AdminCompany>>(
      `/admin/companies/${id}/status`,
      data,
    );
    return response.data.data;
  },

  // DELETE /api/eventhandler/admin/companies/{id}
  deleteCompany: async (id: number): Promise<void> => {
    await eventHandlerApi.delete(`/admin/companies/${id}`);
  },

  // ============================================================================
  // Admin Users
  // ============================================================================

  // GET /api/eventhandler/admin/users
  getAllUsers: async (params?: {
    page?: number;
    size?: number;
    role?: string;
  }): Promise<PaginatedResponse<AdminUser>> => {
    const response = await eventHandlerApi.get<
      ApiResponse<PaginatedResponse<AdminUser>>
    >("/admin/users", { params });
    return response.data.data;
  },

  // GET /api/eventhandler/admin/users/{id}
  getUserById: async (id: number): Promise<AdminUser> => {
    const response = await eventHandlerApi.get<ApiResponse<AdminUser>>(
      `/admin/users/${id}`,
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/admin/users/{id}/role
  updateUserRole: async (
    id: number,
    data: UpdateUserRoleRequest,
  ): Promise<AdminUser> => {
    const response = await eventHandlerApi.put<ApiResponse<AdminUser>>(
      `/admin/users/${id}/role`,
      data,
    );
    return response.data.data;
  },

  // DELETE /api/eventhandler/admin/users/{id}
  deleteUser: async (id: number): Promise<void> => {
    await eventHandlerApi.delete(`/admin/users/${id}`);
  },

  // ============================================================================
  // Admin Dashboard
  // ============================================================================

  // GET /api/eventhandler/admin/dashboard/stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await eventHandlerApi.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard/stats",
    );
    return response.data.data;
  },

  // GET /api/eventhandler/admin/dashboard/monthly/{year}
  getMonthlyStats: async (year: number): Promise<MonthlyStats[]> => {
    const response = await eventHandlerApi.get<ApiResponse<MonthlyStats[]>>(
      `/admin/dashboard/monthly/${year}`,
    );
    return response.data.data;
  },

  // ============================================================================
  // Admin Notifications (Broadcasting)
  // ============================================================================

  // POST /api/eventhandler/admin/notifications/send-to-user/{userId}
  sendNotificationToUser: async (
    userId: string,
    data: {
      title: string;
      message: string;
      type: string;
      referenceId?: number;
      referenceType?: string;
    },
  ): Promise<Notification> => {
    const response = await eventHandlerApi.post<ApiResponse<Notification>>(
      `/admin/notifications/send-to-user/${userId}`,
      data,
    );
    return response.data.data;
  },

  // POST /api/eventhandler/admin/notifications/broadcast
  broadcastNotification: async (data: {
    title: string;
    message: string;
    type: string;
  }): Promise<number> => {
    const response = await eventHandlerApi.post<ApiResponse<number>>(
      "/admin/notifications/broadcast",
      data,
    );
    return response.data.data;
  },

  // POST /api/eventhandler/admin/notifications/broadcast-to-users
  broadcastToUsers: async (
    userIds: string[],
    data: {
      title: string;
      message: string;
      type: string;
    },
  ): Promise<number> => {
    const response = await eventHandlerApi.post<ApiResponse<number>>(
      "/admin/notifications/broadcast-to-users",
      { ...data, targetUserIds: userIds },
    );
    return response.data.data;
  },

  // POST /api/eventhandler/admin/notifications/notify-new-event/{eventId}
  notifyNewEvent: async (
    eventId: number,
    eventTitle: string,
    category: string,
  ): Promise<number> => {
    const response = await eventHandlerApi.post<ApiResponse<number>>(
      `/admin/notifications/notify-new-event/${eventId}`,
      null,
      { params: { eventTitle, category } },
    );
    return response.data.data;
  },

  // POST /api/eventhandler/admin/notifications/notify-event-update/{eventId}
  notifyEventUpdate: async (eventId: number): Promise<number> => {
    const response = await eventHandlerApi.post<ApiResponse<number>>(
      `/admin/notifications/notify-event-update/${eventId}`,
    );
    return response.data.data;
  },
};
