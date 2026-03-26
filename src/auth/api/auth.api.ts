import { api } from '../../shared/api/httpClient';
import type { User } from '../../busWay/types';
import { ApiResponse, LoginResDTO, UserLoginDTO } from '../components/auth-dto';

export const getMe = () => api.get<ApiResponse<User> | User>('/user/me');

export const login = async (dto: UserLoginDTO): Promise<string> => {
  const res = await api.post<ApiResponse<LoginResDTO>>('/auth/login', dto, { withCredentials: true });
  return res.data.data.token;
};