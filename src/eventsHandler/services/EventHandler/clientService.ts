import { eventHandlerApi } from "./httpClient";
import {
  UserProfile,
  CompleteProfileRequest,
  UserPreferences,
  UpdateUserPreferencesRequest,
  Favorite,
  FavoriteToggleResponse,
  FavoriteStatusResponse,
  Comment,
  CreateCommentRequest,
  Notification,
  UnreadCountResponse,
  ApiResponse,
} from "../../types";

// Backend API endpoints for Client (from documentation):
//
// Profile:
// GET /api/eventhandler/userprofile/exists
// GET /api/eventhandler/userprofile
// POST /api/eventhandler/userprofile/complete
// PUT /api/eventhandler/userprofile
// GET /api/eventhandler/userprofile/ping
//
// Preferences:
// GET /api/eventhandler/client/preferences
// GET /api/eventhandler/client/preferences/exists
// POST /api/eventhandler/client/preferences/init
// PUT /api/eventhandler/client/preferences
//
// Favorites:
// POST /api/eventhandler/client/favorites/toggle?eventId={eventId}&userId={userId}
// GET /api/eventhandler/client/favorites/status
// GET /api/eventhandler/client/favorites/user/{userId}
//
// Comments:
// POST /api/eventhandler/client/comments/event/{eventId}?userId={userId}
// GET /api/eventhandler/client/comments/event/{eventId}
// DELETE /api/eventhandler/client/comments/{commentId}
//
// Notifications:
// GET /api/eventhandler/client/notifications/user/{userId}
// GET /api/eventhandler/client/notifications/user/{userId}/unread-count
// PUT /api/eventhandler/client/notifications/{notificationId}/read
// PUT /api/eventhandler/client/notifications/user/{userId}/read-all

export const clientService = {
  // ============================================================================
  // User Profile
  // ============================================================================

  // GET /api/eventhandler/userprofile/exists
  checkProfileExists: async (): Promise<boolean> => {
    const response = await eventHandlerApi.get<ApiResponse<boolean>>(
      "/userprofile/exists",
    );
    return response.data.data;
  },

  // GET /api/eventhandler/userprofile
  getProfile: async (): Promise<UserProfile> => {
    const response =
      await eventHandlerApi.get<ApiResponse<UserProfile>>("/userprofile");
    return response.data.data;
  },

  // POST /api/eventhandler/userprofile/complete
  completeProfile: async (
    data: CompleteProfileRequest,
  ): Promise<UserProfile> => {
    const response = await eventHandlerApi.post<ApiResponse<UserProfile>>(
      "/userprofile/complete",
      data,
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/userprofile
  updateProfile: async (
    data: Partial<CompleteProfileRequest>,
  ): Promise<UserProfile> => {
    const response = await eventHandlerApi.put<ApiResponse<UserProfile>>(
      "/userprofile",
      data,
    );
    return response.data.data;
  },

  // GET /api/eventhandler/userprofile/ping
  pingProfile: async (): Promise<string> => {
    const response =
      await eventHandlerApi.get<ApiResponse<string>>("/userprofile/ping");
    return response.data.data;
  },

  // ============================================================================
  // User Preferences
  // ============================================================================

  // GET /api/eventhandler/client/preferences
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await eventHandlerApi.get<ApiResponse<UserPreferences>>(
      "/client/preferences",
    );
    return response.data.data;
  },

  // GET /api/eventhandler/client/preferences/exists
  checkPreferencesExists: async (): Promise<boolean> => {
    const response = await eventHandlerApi.get<ApiResponse<boolean>>(
      "/client/preferences/exists",
    );
    return response.data.data;
  },

  // POST /api/eventhandler/client/preferences/init
  initPreferences: async (): Promise<UserPreferences> => {
    const response = await eventHandlerApi.post<ApiResponse<UserPreferences>>(
      "/client/preferences/init",
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/client/preferences
  updatePreferences: async (
    data: UpdateUserPreferencesRequest,
  ): Promise<UserPreferences> => {
    const response = await eventHandlerApi.put<ApiResponse<UserPreferences>>(
      "/client/preferences",
      data,
    );
    return response.data.data;
  },

  // ============================================================================
  // Favorites
  // ============================================================================

  // POST /api/eventhandler/client/favorites/toggle?eventId={eventId}&userId={userId}
  toggleFavorite: async (
    eventId: number,
    userId: string,
  ): Promise<FavoriteToggleResponse> => {
    const response = await eventHandlerApi.post<
      ApiResponse<FavoriteToggleResponse>
    >("/client/favorites/toggle", null, { params: { eventId, userId } });
    return response.data.data;
  },

  // GET /api/eventhandler/client/favorites/status
  getFavoritesStatus: async (
    eventId?: number,
    userId?: string,
  ): Promise<FavoriteStatusResponse | FavoriteStatusResponse[]> => {
    const response = await eventHandlerApi.get<
      ApiResponse<FavoriteStatusResponse | FavoriteStatusResponse[]>
    >("/client/favorites/status", { params: { eventId, userId } });
    return response.data.data;
  },

  // GET /api/eventhandler/client/favorites/user/{userId}
  getUserFavorites: async (userId: string): Promise<Favorite[]> => {
    const response = await eventHandlerApi.get<ApiResponse<Favorite[]>>(
      `/client/favorites/user/${userId}`,
    );
    return response.data.data;
  },

  // ============================================================================
  // Comments
  // ============================================================================

  // POST /api/eventhandler/client/comments/event/{eventId}?userId={userId}
  createComment: async (
    eventId: number,
    userId: string,
    data: CreateCommentRequest,
  ): Promise<Comment> => {
    const response = await eventHandlerApi.post<ApiResponse<Comment>>(
      `/client/comments/event/${eventId}`,
      data,
      { params: { userId } },
    );
    return response.data.data;
  },

  // GET /api/eventhandler/client/comments/event/{eventId}
  getEventComments: async (eventId: number): Promise<Comment[]> => {
    const response = await eventHandlerApi.get<ApiResponse<Comment[]>>(
      `/client/comments/event/${eventId}`,
    );
    return response.data.data;
  },

  // DELETE /api/eventhandler/client/comments/{commentId}
  deleteComment: async (commentId: number): Promise<void> => {
    await eventHandlerApi.delete(`/client/comments/${commentId}`);
  },

  // ============================================================================
  // Notifications
  // ============================================================================

  // GET /api/eventhandler/client/notifications/user/{userId}
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await eventHandlerApi.get<ApiResponse<Notification[]>>(
      `/client/notifications/user/${userId}`,
    );
    return response.data.data;
  },

  // GET /api/eventhandler/client/notifications/user/{userId}/unread-count
  getUnreadCount: async (userId: string): Promise<number> => {
    const response = await eventHandlerApi.get<
      ApiResponse<UnreadCountResponse>
    >(`/client/notifications/user/${userId}/unread-count`);
    return response.data.data.count;
  },

  // PUT /api/eventhandler/client/notifications/{notificationId}/read
  markNotificationAsRead: async (
    notificationId: number,
  ): Promise<Notification> => {
    const response = await eventHandlerApi.put<ApiResponse<Notification>>(
      `/client/notifications/${notificationId}/read`,
    );
    return response.data.data;
  },

  // PUT /api/eventhandler/client/notifications/user/{userId}/read-all
  markAllNotificationsAsRead: async (userId: string): Promise<number> => {
    const response = await eventHandlerApi.put<ApiResponse<number>>(
      `/client/notifications/user/${userId}/read-all`,
    );
    return response.data.data;
  },
};
