// OSRM (Open Source Routing Machine) Service
// Free routing engine that snaps routes to actual roads
// Public demo server: https://router.project-osrm.org

export interface OSRMRoute {
  coordinates: [number, number][]; // [lng, lat] pairs snapped to roads
  distance: number; // meters
  duration: number; // seconds
}

// Try multiple OSRM demo servers
const OSRM_SERVERS = [
  "https://router.project-osrm.org",
  "https://routing.openstreetmap.de/routed-car",
];

/**
 * Snap a route to actual roads using OSRM
 * This makes bus lines follow real streets instead of cutting through buildings
 */
export const snapRouteToRoads = async (
  coordinates: [number, number][],
  retries = 2,
): Promise<OSRMRoute | null> => {
  if (coordinates.length < 2) {
    return { coordinates, distance: 0, duration: 0 };
  }

  // Limit coordinates to avoid URL too long errors (max ~100 points)
  const sampledCoords =
    coordinates.length > 25 ? sampleCoordinates(coordinates, 25) : coordinates;

  // Try each OSRM server
  for (const baseUrl of OSRM_SERVERS) {
    try {
      // Format coordinates for OSRM: "lng,lat;lng,lat;..."
      const coordsString = sampledCoords
        .map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`)
        .join(";");

      // Use OSRM route service with driving profile (best for buses)
      // geometries=geojson returns full road geometry
      // overview=full gets complete route
      // continue_straight=false allows proper routing
      const url = `${baseUrl}/route/v1/driving/${coordsString}?geometries=geojson&overview=full&alternatives=false&steps=false&continue_straight=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.warn(
          `OSRM server ${baseUrl} returned ${response.status}, trying next...`,
        );
        continue;
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        console.warn(
          `OSRM server ${baseUrl} returned no route, trying next...`,
        );
        continue;
      }

      // Extract snapped coordinates from OSRM response
      // OSRM returns [lng, lat] pairs in the geometry
      const snappedCoordinates: [number, number][] =
        data.routes[0].geometry.coordinates;

      return {
        coordinates: snappedCoordinates,
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } catch (error) {
      console.warn(`OSRM server ${baseUrl} failed:`, error);
      continue;
    }
  }

  // All servers failed - fallback to original coordinates
  console.warn("All OSRM servers failed, using original coordinates");
  return { coordinates, distance: 0, duration: 0 };
};

/**
 * Sample coordinates to reduce number of points for OSRM
 * Uses distance-based sampling to keep important points
 */
const sampleCoordinates = (
  coords: [number, number][],
  maxPoints: number,
): [number, number][] => {
  if (coords.length <= maxPoints) return coords;

  const result: [number, number][] = [coords[0]]; // Always keep first
  const step = (coords.length - 2) / (maxPoints - 2);

  for (let i = 1; i < maxPoints - 1; i++) {
    const index = Math.floor(i * step);
    result.push(coords[index]);
  }

  result.push(coords[coords.length - 1]); // Always keep last
  return result;
};

/**
 * Batch process multiple routes to snap them to roads
 */
export const snapRoutesToRoads = async (
  routes: { id: number; coordinates: [number, number][] }[],
): Promise<Map<number, OSRMRoute>> => {
  const results = new Map<number, OSRMRoute>();

  // Process routes sequentially to avoid rate limiting
  for (const route of routes) {
    const snapped = await snapRouteToRoads(route.coordinates);
    if (snapped) {
      results.set(route.id, snapped);
    }
    // Small delay to be nice to the free OSRM server
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
};

/**
 * Check if OSRM service is available
 */
export const checkOSRMHealth = async (): Promise<boolean> => {
  for (const baseUrl of OSRM_SERVERS) {
    try {
      const testCoord = "-1.908,34.6815";
      const url = `${baseUrl}/route/v1/driving/${testCoord};${testCoord}?geometries=geojson`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (response.ok) return true;
    } catch {
      continue;
    }
  }
  return false;
};

/**
 * Test OSRM with a sample Oujda route
 */
export const testOSRM = async (): Promise<void> => {
  const testCoords: [number, number][] = [
    [-1.908, 34.6815], // وسط المدينة
    [-1.895, 34.674], // الولاية
    [-1.885, 34.665], // سيدي يحيى
  ];

  console.log("Testing OSRM with Oujda route...");
  const result = await snapRouteToRoads(testCoords);
  if (result) {
    console.log("✅ OSRM test successful!");
    console.log(`   Distance: ${(result.distance / 1000).toFixed(2)} km`);
    console.log(`   Duration: ${(result.duration / 60).toFixed(1)} min`);
    console.log(`   Snapped points: ${result.coordinates.length}`);
  } else {
    console.log("❌ OSRM test failed");
  }
};

export const osrmService = {
  snapRouteToRoads,
  snapRoutesToRoads,
  checkOSRMHealth,
  testOSRM,
};
