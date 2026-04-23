import { api } from '../../../shared/api/httpClient';
import type { ApiResponse, LoginPayload, LoginResDTO, RefreshResDTO, RegisterPayload, RegisterResDTO, User } from '../components/auth-dto';

export const apiLogin = (dto: LoginPayload) =>
    api.post<ApiResponse<LoginResDTO>>(
        '/auth/login',
        { email: dto.email, password: dto.password },
        { withCredentials: true }
    );

export const apiLogout = (token: string) =>
    api.post('/auth/logout', {}, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });

export const apiRefresh = () =>
    api.post<ApiResponse<RefreshResDTO>>('/auth/refresh', {}, { withCredentials: true });

export const apiMe = () =>
    api.get<ApiResponse<User>>('/user/me');

export const apiRegister = (dto: RegisterPayload) =>
    api.post<ApiResponse<RegisterResDTO>>(
        '/auth/register',
        { email: dto.email, password: dto.password },
        { withCredentials: true }
    );
