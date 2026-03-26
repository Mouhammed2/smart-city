import API from './api';
import { Bus, ApiResponse, NearestBusesResponse } from '../../types';

// Mock data for testing without backend
const mockBuses: Bus[] = [
  {
    id: 1,
    busNumber: 'B101',
    latitude: 40.7484,
    longitude: -73.9857,
    status: 'ACTIVE',
    routeName: 'Downtown Express',
    routeId: 1,
    occupancyStatus: 'AVAILABLE',
    currentPassengers: 15,
    capacity: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 2,
    busNumber: 'B202',
    latitude: 40.7500,
    longitude: -73.9800,
    status: 'ACTIVE',
    routeName: 'Airport Shuttle',
    routeId: 2,
    occupancyStatus: 'LIMITED',
    currentPassengers: 35,
    capacity: 40,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 3,
    busNumber: 'B303',
    latitude: 40.7520,
    longitude: -73.9750,
    status: 'ACTIVE',
    routeName: 'University Loop',
    routeId: 3,
    occupancyStatus: 'AVAILABLE',
    currentPassengers: 8,
    capacity: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 4,
    busNumber: 'B404',
    latitude: 40.7550,
    longitude: -73.9700,
    status: 'MAINTENANCE',
    routeName: 'Beach Connector',
    routeId: 4,
    occupancyStatus: 'AVAILABLE',
    currentPassengers: 0,
    capacity: 35,
    lastUpdated: new Date().toISOString(),
  },
];

// Use mock data flag - set to true
const USE_MOCK_DATA = false;

export const busService = {
  // Get all buses
  getAll: async (): Promise<Bus[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBuses), 500);
      });
    }
    const response = await API.get<ApiResponse<Bus[]>>('/buses');
    return response.data.data;
  },

  // Get bus by ID
  getById: async (id: number): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const bus = mockBuses.find((b) => b.id === id);
      if (!bus) throw new Error('Bus not found');
      return bus;
    }
    const response = await API.get<ApiResponse<Bus>>(`/buses/${id}`);
    return response.data.data;
  },

  // Get bus by number
  getByNumber: async (busNumber: string): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const bus = mockBuses.find((b) => b.busNumber === busNumber);
      if (!bus) throw new Error('Bus not found');
      return bus;
    }
    const response = await API.get<ApiResponse<Bus>>(`/buses/number/${busNumber}`);
    return response.data.data;
  },

  // Get nearest buses (CORE FEATURE)
  getNearest: async (lat: number, lng: number, radius: number = 1000): Promise<Bus[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBuses.filter(bus => bus.status === 'ACTIVE')), 300);
      });
    }
    const response = await API.get<ApiResponse<Bus[]>>('/buses/nearest', {
      params: { lat, lng, radius }
    });
    return response.data.data;
  },

  // Get buses on route
  getByRoute: async (routeId: number): Promise<Bus[]> => {
    if (USE_MOCK_DATA) {
      return mockBuses.filter(bus => bus.routeId === routeId);
    }
    const response = await API.get<ApiResponse<Bus[]>>(`/buses/route/${routeId}`);
    return response.data.data;
  },

  // Get buses approaching stop
  getApproachingStop: async (stopId: number): Promise<Bus[]> => {
    if (USE_MOCK_DATA) {
      return mockBuses.filter(bus => bus.status === 'ACTIVE');
    }
    const response = await API.get<ApiResponse<Bus[]>>(`/buses/approaching/${stopId}`);
    return response.data.data;
  },

  // Create bus (admin)
  create: async (bus: Omit<Bus, 'id'>): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const newBus = { ...bus, id: Math.max(...mockBuses.map((b) => b.id)) + 1 };
      mockBuses.push(newBus as Bus);
      return newBus as Bus;
    }
    const response = await API.post<ApiResponse<Bus>>('/buses', bus);
    return response.data.data;
  },

  // Update bus (admin)
  update: async (id: number, bus: Partial<Bus>): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const index = mockBuses.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Bus not found');
      mockBuses[index] = { ...mockBuses[index], ...bus };
      return mockBuses[index];
    }
    const response = await API.put<ApiResponse<Bus>>(`/buses/${id}`, bus);
    return response.data.data;
  },

  // Delete bus (admin)
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockBuses.findIndex((b) => b.id === id);
      if (index !== -1) mockBuses.splice(index, 1);
      return;
    }
    await API.delete(`/buses/${id}`);
  },

  // Update bus location (real-time)
  updateLocation: async (id: number, lat: number, lng: number): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const bus = mockBuses.find((b) => b.id === id);
      if (!bus) throw new Error('Bus not found');
      bus.latitude = lat;
      bus.longitude = lng;
      bus.lastUpdated = new Date().toISOString();
      return bus;
    }
    const response = await API.put<ApiResponse<Bus>>(`/buses/${id}/location`, { lat, lng });
    return response.data.data;
  },

  // Update bus occupancy
  updateOccupancy: async (id: number, passengerCount: number): Promise<Bus> => {
    if (USE_MOCK_DATA) {
      const bus = mockBuses.find((b) => b.id === id);
      if (!bus) throw new Error('Bus not found');
      bus.currentPassengers = passengerCount;
      bus.lastUpdated = new Date().toISOString();
      return bus;
    }
    const response = await API.put<ApiResponse<Bus>>(`/buses/${id}/occupancy`, { passengerCount });
    return response.data.data;
  },
};