import { api } from '../../shared/api/httpClient';
import {ApiResponse} from "../../types";

export const getMe = () => api.get('/user/me');

// export const login: ApiResponse<any>