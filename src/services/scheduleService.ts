import API from './api';
import { Schedule, ApiResponse } from '../types';

export const scheduleService = {
  // Get schedules by route
  getByRoute: async (routeId: number): Promise<Schedule[]> => {
    const response = await API.get<ApiResponse<Schedule[]>>(`/schedules/route/${routeId}`);
    return response.data.data;
  },

  // Get schedules by stop
  getByStop: async (stopId: number): Promise<Schedule[]> => {
    const response = await API.get<ApiResponse<Schedule[]>>(`/schedules/stop/${stopId}`);
    return response.data.data;
  },

  // Get upcoming departures
  getUpcoming: async (stopId?: number, limit: number = 10): Promise<Schedule[]> => {
    const response = await API.get<ApiResponse<Schedule[]>>('/schedules/upcoming', {
      params: { stopId, limit }
    });
    return response.data.data;
  },
};