import { api } from '../../shared/api/httpClient';

export const getMe = () => api.get('/user/me');

