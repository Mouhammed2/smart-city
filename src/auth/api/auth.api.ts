import { api } from '../../shared/api/httpClient';
import { ApiResponse, LoginResDTO, User, UserLoginDTO } from '../components/auth-dto';

export const apiMe = () => api.get<ApiResponse<User> | User>('/user/me');

export const apiLogin = async (dto: UserLoginDTO): Promise<string> => {
  const res = await api.post<ApiResponse<LoginResDTO>>('/auth/login', dto, { withCredentials: true });
  return res.data.data.token;
};