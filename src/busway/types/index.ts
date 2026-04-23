import { Feature, LineString, Point } from 'geojson';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Geometry {
  type: 'LineString';
  coordinates: number[][];
}

export interface Route {
  id: number;
  routeNumber: string;
  name: string;
  geometry: Geometry;
  color: string;
}

export interface Stop {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  hasShelter: boolean;
  wheelchairAccessible: boolean;
  bench?: boolean;
  city?: string;
}

export interface Bus {
  id: number;
  busNumber: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  routeName?: string;
  routeId?: number;
  occupancyStatus: 'AVAILABLE' | 'FULL' | 'LIMITED';
  currentPassengers: number;
  capacity: number;
  lastUpdated?: string;
}

export interface Schedule {
  id: number;
  routeId: number;
  routeName: string;
  stopId: number;
  stopName: string;
  departureTime: string;
  arrivalTime: string;
  dayType: 'WEEKDAY' | 'SATURDAY' | 'SUNDAY';
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export interface NearestBusesResponse {
  buses: Bus[];
  distance: number;
}

export interface NearestStopsResponse {
  stops: Stop[];
  distance: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// Mapbox-specific types
export interface RouteFeature extends Feature<LineString> {
  properties: {
    id: number;
    routeNumber: string;
    name: string;
    color: string;
  };
}

export interface StopFeature extends Feature<Point> {
  properties: {
    id: number;
    code: string;
    name: string;
    hasShelter: boolean;
    wheelchairAccessible: boolean;
    bench?: boolean;
  };
}

export interface BusFeature extends Feature<Point> {
  properties: {
    id: number;
    busNumber: string;
    status: Bus['status'];
    routeName?: string;
    routeId?: number;
    occupancyStatus: Bus['occupancyStatus'];
    currentPassengers: number;
    capacity: number;
    lastUpdated?: string;
  };
}

// Redux state types
export interface BusState {
  buses: Bus[];
  nearestBuses: Bus[];
  selectedBus: Bus | null;
  searchRadius: number;
  loading: boolean;
  error: string | null;
}

export interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
}

export interface StopState {
  stops: Stop[];
  nearestStops: Stop[];
  selectedStop: Stop | null;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  mapCenter: [number, number];
  mapZoom: number;
  userLocation: UserLocation | null;
  loading: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
}

export interface RootState {
  buses: BusState;
  routes: RouteState;
  stops: StopState;
  ui: UIState;
}

