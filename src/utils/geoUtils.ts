import { Coordinates } from '../types';

// Calculate distance between two points in meters using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Check if a point is within a bounding box
export const isPointInBbox = (
  lat: number,
  lng: number,
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number
): boolean => {
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

// Get bounding box from center and radius
export const getBboxFromCenter = (
  centerLat: number,
  centerLng: number,
  radiusKm: number
): [number, number, number, number] => {
  const latChange = radiusKm / 111; // 1 degree ≈ 111 km
  const lngChange = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

  return [
    centerLng - lngChange,
    centerLat - latChange,
    centerLng + lngChange,
    centerLat + latChange,
  ];
};