import { Feature, Point } from "geojson";

// ============================================================================
// Common Types
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  page: number;
}

// ============================================================================
// Event Types (Public)
// ============================================================================

export type EventStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";
export type EventCategory =
  | "Music"
  | "Sports"
  | "Conference"
  | "Exhibition"
  | "Festival"
  | "Workshop"
  | "Theater"
  | "Comedy"
  | "Food"
  | "Technology"
  | "Art"
  | "Other";

export interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  eventDate: string;
  endDate: string;
  location: string;
  latitude: number;
  longitude: number;
  exactAddress: string;
  imageUrl?: string;
  price?: number;
  maxParticipants?: number;
  currentParticipants: number;
  companyId?: number;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSearchParams {
  query?: string;
  category?: EventCategory;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EventMapData {
  id: number;
  title: string;
  latitude: number;
  longitude: number;
  category: EventCategory;
  status: EventStatus;
  eventDate: string;
}

export interface ShareLinkResponse {
  shareUrl: string;
  expiresAt: string;
}

// ============================================================================
// User Profile Types (Client)
// ============================================================================

export interface UserProfile {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  city?: string;
  country?: string;
  preferences?: UserPreferences;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  eventReminders: boolean;
  newEventAlerts: boolean;
  favoriteEventUpdates: boolean;
  preferredCategories: string[];
  preferredCities: string[];
  maxPriceRange?: number;
  minPriceRange?: number;
  language: string;
  theme: "light" | "dark";
  profileVisible: boolean;
  allowComments: boolean;
}

export interface CompleteProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  city?: string;
  country?: string;
  bio?: string;
}

export interface UpdateUserPreferencesRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  newsletter?: boolean;
  eventReminders?: boolean;
  newEventAlerts?: boolean;
  favoriteEventUpdates?: boolean;
  preferredCategories?: string[];
  preferredCities?: string[];
  maxPriceRange?: number;
  minPriceRange?: number;
  language?: string;
  theme?: "light" | "dark";
  profileVisible?: boolean;
  allowComments?: boolean;
}

// ============================================================================
// Favorites Types (Client)
// ============================================================================

export interface Favorite {
  id: number;
  userId: number;
  eventId: number;
  eventTitle: string;
  eventImageUrl?: string;
  eventStartDate: string;
  eventCity: string;
  createdAt: string;
}

export interface FavoriteToggleResponse {
  isFavorited: boolean;
  message: string;
}

export interface FavoriteStatusResponse {
  eventId: number;
  isFavorited: boolean;
}

// ============================================================================
// Comments Types (Client)
// ============================================================================

export interface Comment {
  id: number;
  eventId: number;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  content: string;
  rating?: number;
  likes: number;
  parentId?: number;
  replies?: Comment[];
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  rating?: number;
  parentId?: number;
}

// ============================================================================
// Notifications Types (Client)
// ============================================================================

export type NotificationType =
  | "EVENT_REMINDER"
  | "EVENT_UPDATE"
  | "NEW_COMMENT"
  | "FAVORITE_EVENT"
  | "SYSTEM"
  | "PROMOTION";
export type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  status: NotificationStatus;
  createdAt: string;
  readAt?: string;
}

export interface UnreadCountResponse {
  count: number;
}

// ============================================================================
// Company Profile Types (Company)
// ============================================================================

export type CompanyStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface CompanyProfile {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  registrationNumber?: string;
  taxId?: string;
  status: CompanyStatus;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteCompanyProfileRequest {
  CompanyName: string;
  Siret?: string;
  VatNumber?: string;
  Email?: string;
  Phone?: string;
  Address?: string;
  City?: string;
  PostalCode?: string;
  Country?: string;
  Website?: string;
  LogoUrl?: string;
  Description?: string;
}

// ============================================================================
// Company Events Types (Company)
// ============================================================================

export interface CreateEventRequest {
  Title: string;
  Description?: string;
  Category: EventCategory;
  EventDate: string;
  EndDate?: string;
  Location?: string;
  Latitude?: number;
  Longitude?: number;
  ExactAddress?: string;
  ImageUrl?: string;
  Price?: number;
  MaxParticipants?: number;
}

export interface UpdateEventRequest {
  Title?: string;
  Description?: string;
  Category?: EventCategory;
  EventDate?: string;
  EndDate?: string;
  Location?: string;
  Latitude?: number;
  Longitude?: number;
  ExactAddress?: string;
  ImageUrl?: string;
  Price?: number;
  MaxParticipants?: number;
  status?: EventStatus;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UpdateUserRoleRequest {
  Role: string;
}

export interface AdminCompany extends CompanyProfile {
  eventCount: number;
  totalAttendees: number;
}

export interface UpdateCompanyStatusRequest {
  IsActive: boolean;
}

export interface ValidateEventRequest {
  Status: "APPROVED" | "REJECTED";
  RejectionReason?: string;
}

// ============================================================================
// Dashboard Types (Admin)
// ============================================================================

export interface DashboardStats {
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  totalUsers: number;
  activeUsers: number;
  totalComments: number;
  totalFavorites: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  newEvents: number;
  newCompanies: number;
  newUsers: number;
  totalAttendees: number;
}

// ============================================================================
// Debug Types
// ============================================================================

export interface DebugHeadersResponse {
  headers: Record<string, string>;
  timestamp: string;
}

// ============================================================================
// Map Feature Types
// ============================================================================

export interface EventFeature extends Feature<Point> {
  properties: {
    id: number;
    title: string;
    category: EventCategory;
    status: EventStatus;
    eventDate: string;
  };
}

// ============================================================================
// Redux State Types
// ============================================================================

export interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  mapEvents: EventMapData[];
  searchResults: PaginatedResponse<Event> | null;
  loading: boolean;
  error: string | null;
}

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UserPreferencesState {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

export interface FavoritesState {
  favorites: Favorite[];
  statusMap: Record<number, boolean>;
  loading: boolean;
  error: string | null;
}

export interface CommentsState {
  comments: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface CompanyState {
  profile: CompanyProfile | null;
  companyEvents: Event[];
  loading: boolean;
  error: string | null;
}

export interface AdminState {
  pendingEvents: Event[];
  allEvents: PaginatedResponse<Event> | null;
  companies: PaginatedResponse<AdminCompany> | null;
  users: PaginatedResponse<AdminUser> | null;
  dashboardStats: DashboardStats | null;
  monthlyStats: MonthlyStats[];
  loading: boolean;
  error: string | null;
}

export interface EventsUIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  mapCenter: [number, number];
  mapZoom: number;
  userLocation: Coordinates | null;
  loading: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  };
}

export interface EventsRootState {
  events: EventsState;
  userProfile: UserProfileState;
  userPreferences: UserPreferencesState;
  favorites: FavoritesState;
  comments: CommentsState;
  notifications: NotificationsState;
  company: CompanyState;
  admin: AdminState;
  ui: EventsUIState;
}
