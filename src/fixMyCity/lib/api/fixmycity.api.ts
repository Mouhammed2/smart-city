import { api } from '@/lib/api/axios';
import { getAuthState } from '../../../auth/store/authSlice';

const FIX_MY_CITY_BASE = '/api/city';

export type ReportStatus = 'IN_PROGRESS' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

type ApiResponse<T> = {
  data: T;
  message?: string;
  timestamp: string;
};

type PaginatedList<T> = {
  items: T[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
};

export type CivilReport = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ReportStatus;
  latitude?: number;
  longitude?: number;
  addressText?: string | null;
  createdAt: string;
};

export type ReportStatusHistory = {
  id: string;
  civilReportId: string;
  changedByUserId: string;
  status: ReportStatus;
  comment?: string | null;
  changedAt: string;
};

const buildGatewayHeaders = (): Record<string, string> => {
  const { user } = getAuthState();

  if (!user) {
    return {};
  }

  const [firstName, ...rest] = (user.username || '').trim().split(' ');

  return {
    'X-User-Id': user.id,
    'X-User-Role': user.role,
    'X-User-Email': user.email,
    'X-User-Name': firstName || user.username || 'Citizen',
    'X-User-LastName': rest.join(' ') || 'User',
  };
};

const withGatewayHeaders = (headers: Record<string, string> = {}) => ({
  headers: {
    ...headers,
    ...buildGatewayHeaders(),
  },
});

export const ensureFixMyCityUser = async () => {
  try {
    await api.get<ApiResponse<{ id: string }>>(`${FIX_MY_CITY_BASE}/auth/me`, withGatewayHeaders());
  } catch {
    await api.post(`${FIX_MY_CITY_BASE}/auth/register`, {}, withGatewayHeaders());
  }
};

export const listReports = async (page = 1, limit = 50) => {
  const response = await api.get<ApiResponse<PaginatedList<CivilReport>>>(
    `${FIX_MY_CITY_BASE}/civilreports?page=${page}&limit=${limit}`,
    withGatewayHeaders()
  );

  return response.data.data;
};

export const listCurrentUserReports = async () => {
  const { user } = getAuthState();

  if (!user?.id) {
    return [] as CivilReport[];
  }

  const response = await api.get<ApiResponse<CivilReport[]>>(
    `${FIX_MY_CITY_BASE}/civilreports/user/${user.id}`,
    withGatewayHeaders()
  );

  return response.data.data;
};

export const getReportById = async (id: string) => {
  const response = await api.get<ApiResponse<CivilReport>>(
    `${FIX_MY_CITY_BASE}/civilreports/${id}`,
    withGatewayHeaders()
  );

  return response.data.data;
};

export const createReport = async (payload: {
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  addressText?: string;
}) => {
  const response = await api.post<ApiResponse<CivilReport>>(
    `${FIX_MY_CITY_BASE}/civilreports`,
    payload,
    withGatewayHeaders()
  );

  return response.data.data;
};

export const listStatusHistory = async (reportId: string) => {
  const response = await api.get<ApiResponse<ReportStatusHistory[]>>(
    `${FIX_MY_CITY_BASE}/reportstatushistories/civil-reports/${reportId}/status-history`,
    withGatewayHeaders()
  );

  return response.data.data;
};

export const changeReportStatus = async (
  reportId: string,
  payload: { status: ReportStatus; comment?: string }
) => {
  await api.patch(
    `${FIX_MY_CITY_BASE}/reportstatus/civil-reports/${reportId}/status`,
    payload,
    withGatewayHeaders()
  );
};

export const updateUserRestrictions = async (
  userId: string,
  payload: { canReport: boolean; canComment: boolean }
) => {
  await api.patch(
    `${FIX_MY_CITY_BASE}/usermanagement/users/${userId}/restrictions`,
    payload,
    withGatewayHeaders()
  );
};



