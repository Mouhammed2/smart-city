# Busway Frontend - Complete Technical Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies & Tools](#technologies--tools)
3. [Architecture](#architecture)
4. [API Integration](#api-integration)
5. [Services & Endpoints](#services--endpoints)
6. [Data Models](#data-models)
7. [Special Features](#special-features)
8. [State Management](#state-management)
9. [Authentication](#authentication)
10. [Configuration](#configuration)

---

## 🎯 Project Overview

The Busway module is a comprehensive public transportation management system built as part of a Smart City platform. It provides real-time tracking, route management, and scheduling capabilities for bus transportation networks.

**Key Capabilities:**
- Real-time bus tracking with GPS coordinates
- Route visualization on interactive maps
- Stop management with accessibility features
- Schedule management for different day types
- OSRM integration for road-snapped routes
- Geospatial queries (nearest, bounding box, etc.)

---

## 🛠 Technologies & Tools

### Core Framework
- **React 18.2.0** - UI framework
- **TypeScript 5.3.3** - Type-safe JavaScript
- **Create React App 5.0.1** - Build tooling
- **Craco 5.9.0** - Custom webpack configuration

### State Management
- **Redux Toolkit 1.9.7** - State management
- **React Redux 8.1.3** - React bindings

### HTTP Client
- **Axios 1.6.2** - HTTP requests with interceptors

### Mapping & Geospatial
- **MapLibre GL 5.19.0** - Interactive maps
- **React Map GL 8.1.0** - React wrapper for MapLibre
- **Leaflet 1.9.4** - Alternative mapping library
- **React Leaflet 4.2.1** - React wrapper for Leaflet
- **OSRM (Open Source Routing Machine)** - Road routing engine

### UI Components
- **Material UI (MUI) 5.14.20** - Component library
- **Radix UI** - Headless UI components
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-label
  - @radix-ui/react-slot
  - @radix-ui/react-tabs
- **Lucide React 0.544.0** - Icon library
- **Framer Motion 12.38.0** - Animation library

### Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **PostCSS 8.5.6** - CSS processing
- **Emotion 11.11.1** - CSS-in-JS

### Form Handling
- **Formik 2.4.5** - Form management
- **Yup 1.3.3** - Schema validation

### 3D Graphics
- **Three.js 0.184.0** - 3D rendering
- **React Three Fiber 8.17.10** - React renderer for Three.js
- **React Three Drei 9.114.3** - Helpers for R3F
- **React Three Postprocessing 2.16.2** - Post-processing effects

### Animation
- **GSAP 3.15.0** - Animation library
- **@gsap/react 2.1.2** - React integration

### Data Visualization
- **Recharts 3.8.1** - Chart library

### Notifications
- **React Toastify 11.0.5** - Toast notifications

### Development Tools
- **@types packages** - TypeScript definitions
- **Testing Library** - Unit testing
- **ESLint** - Code linting

---

## 🏗 Architecture

### Project Structure
```
src/
├── busway/
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Layout components
│   ├── pages/              # Page components
│   ├── services/BusWay/    # API service layer
│   │   ├── api.ts          # API client export
│   │   ├── httpClient.ts   # Axios instance configuration
│   │   ├── busService.ts   # Bus-related API calls
│   │   ├── routeService.ts # Route-related API calls
│   │   ├── stopService.ts  # Stop-related API calls
│   │   ├── scheduleService.ts # Schedule-related API calls
│   │   └── osrmService.ts  # OSRM routing service
│   ├── store/              # Redux store configuration
│   ├── theme/              # Theme configuration
│   └── types/              # TypeScript type definitions
├── shared/
│   ├── api/                # Shared API utilities
│   └── auth/               # Authentication utilities
└── types/                  # Global type definitions
```

### Layered Architecture
1. **Presentation Layer** (Components, Pages)
2. **State Management Layer** (Redux Store)
3. **Service Layer** (API Services)
4. **HTTP Client Layer** (Axios with interceptors)
5. **Backend API** (Busway REST API)

---

## 🔌 API Integration

### Base Configuration
```typescript
// Environment Variables
REACT_APP_BUSWAY_API_URL=http://localhost:9090/api/busway
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### HTTP Client Setup
The application uses two Axios instances:

1. **Shared API Client** (`src/shared/api/httpClient.ts`)
   - Base URL: `REACT_APP_API_URL`
   - Features: Token refresh, auto-redirect to login
   - Used for: Authentication, shared services

2. **Busway API Client** (`src/busway/services/BusWay/httpClient.ts`)
   - Base URL: `REACT_APP_BUSWAY_API_URL`
   - Features: Bearer token injection, error logging
   - Used for: Busway-specific endpoints

### Authentication Flow
1. JWT tokens stored in localStorage/sessionStorage
2. Token automatically added to request headers
3. Automatic token refresh on 401 errors
4. Redirect to login on authentication failure

---

## 📡 Services & Endpoints

### 1. Bus Service (`busService.ts`)

**Base Endpoint:** `/api/busway/buses`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/buses` | Get all buses | - |
| GET | `/buses/{id}` | Get bus by ID | `id: number` |
| GET | `/buses/number/{busNumber}` | Get bus by number | `busNumber: string` |
| GET | `/buses/nearest` | Find nearest buses | `lat, lng, radius` |
| GET | `/buses/top-nearest` | Find top nearest buses | `lat, lng, limit` |
| GET | `/buses/route/{routeId}` | Get buses on route | `routeId: number` |
| GET | `/buses/approaching/{stopId}` | Get buses approaching stop | `stopId: number` |
| GET | `/buses/heading-to-stop/{stopId}` | Get buses heading to stop | `stopId: number` |
| POST | `/buses` | Create bus | `Bus` object |
| PUT | `/buses/{id}` | Update bus | `id, Partial<Bus>` |
| DELETE | `/buses/{id}` | Delete bus | `id: number` |
| PUT | `/buses/{id}/location` | Update location | `id, lat, lng, speed?, heading?` |
| PUT | `/buses/{id}/occupancy` | Update occupancy | `id, passengerCount` |
| PUT | `/buses/{id}/status` | Change status | `id, status` |
| PUT | `/buses/{id}/next-stop/{stopId}` | Update next stop | `id, stopId` |

### 2. Route Service (`routeService.ts`)

**Base Endpoint:** `/api/busway/routes`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/routes` | Get all routes | - |
| GET | `/routes/{id}` | Get route by ID | `id: number` |
| GET | `/routes/number/{routeNumber}` | Get route by number | `routeNumber: string` |
| GET | `/routes/search` | Search routes | `query: string` |
| GET | `/routes/nearby` | Find nearby routes | `lat, lng, radius` |
| GET | `/routes/bbox` | Find routes in bounding box | `minLon, minLat, maxLon, maxLat` |
| GET | `/routes/{id}/length` | Get route length | `id: number` |
| GET | `/routes/{id}/connections` | Get connecting routes | `id: number` |
| POST | `/routes` | Create route | `RouteRequest` object |
| PUT | `/routes/{id}` | Update route | `id, Partial<RouteRequest>` |
| DELETE | `/routes/{id}` | Soft delete route | `id: number` |
| DELETE | `/routes/{id}/hard` | Hard delete route | `id: number` |

### 3. Stop Service (`stopService.ts`)

**Base Endpoint:** `/api/busway/stops`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/stops` | Get all stops | - |
| GET | `/stops/{id}` | Get stop by ID | `id: number` |
| GET | `/stops/code/{code}` | Get stop by code | `code: string` |
| GET | `/stops/route/{routeId}` | Get stops by route | `routeId: number` |
| GET | `/stops/city/{city}` | Get stops by city | `city: string` |
| GET | `/stops/zone/{zone}` | Get stops by zone | `zone: string` |
| GET | `/stops/nearest` | Find nearest stops | `lat, lng, radius` |
| GET | `/stops/top-nearest` | Find top nearest stops | `lat, lng, limit` |
| GET | `/stops/bbox` | Find stops in bounding box | `minLon, minLat, maxLon, maxLat` |
| GET | `/stops/accessible` | Get accessible stops | - |
| GET | `/stops/with-shelter` | Get stops with shelter | - |
| GET | `/stops/with-bench` | Get stops with bench | - |
| GET | `/stops/with-facilities` | Get stops with facilities | - |
| GET | `/stops/search` | Search stops by name | `query: string` |
| GET | `/stops/distance` | Calculate distance between stops | `from, to` |
| GET | `/stops/statistics` | Get stop statistics | - |
| GET | `/stops/geojson` | Export stops as GeoJSON | - |
| POST | `/stops` | Create stop | `StopRequest` object |
| POST | `/stops/bulk` | Create multiple stops | `StopRequest[]` |
| PUT | `/stops/{id}` | Update stop | `id, Partial<StopRequest>` |
| PATCH | `/stops/{id}` | Partial update stop | `id, Partial<StopRequest>` |
| PATCH | `/stops/{id}/location` | Update stop location | `id, lat, lng` |
| PATCH | `/stops/{id}/toggle-status` | Toggle stop status | `id: number` |
| DELETE | `/stops/{id}` | Soft delete stop | `id: number` |
| DELETE | `/stops/{id}/hard` | Hard delete stop | `id: number` |
| DELETE | `/stops/bulk` | Delete multiple stops | `ids: number[]` |

### 4. Schedule Service (`scheduleService.ts`)

**Base Endpoint:** `/api/busway/schedules`

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/schedules/route/{routeId}` | Get schedules by route | `routeId: number` |
| GET | `/schedules/stop/{stopId}` | Get schedules by stop | `stopId: number` |
| GET | `/schedules/upcoming` | Get upcoming departures | `stopId?, limit` |

### 5. OSRM Service (`osrmService.ts`)

**External Service:** Open Source Routing Machine (OSRM)

**Demo Servers:**
- `https://router.project-osrm.org`
- `https://routing.openstreetmap.de/routed-car`

| Function | Description | Parameters |
|----------|-------------|------------|
| `snapRouteToRoads` | Snap coordinates to actual roads | `coordinates: [number, number][]` |
| `snapRoutesToRoads` | Batch process multiple routes | `routes: {id, coordinates}[]` |
| `checkOSRMHealth` | Check if OSRM service is available | - |
| `testOSRM` | Test OSRM with sample route | - |

**Features:**
- Automatic server fallback
- Coordinate sampling for large routes (max 25 points)
- Distance and duration calculation
- Road-snapped geometry for accurate route visualization

---

## 📊 Data Models

### Bus
```typescript
interface Bus {
  id: number;
  busNumber: string;
  licensePlate: string;
  latitude: number;
  longitude: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  routeName?: string;
  routeId?: number;
  occupancyStatus: "AVAILABLE" | "FULL" | "LIMITED";
  currentPassengers: number;
  capacity: number;
  lastUpdated?: string;
}
```

### Route
```typescript
interface Route {
  id: number;
  routeNumber: string;
  name: string;
  geometry: Geometry;
  color: string;
  snappedCoordinates?: number[][]; // OSRM-snapped coordinates
}

interface Geometry {
  type: "LineString";
  coordinates: number[][]; // [lng, lat] pairs
}
```

### Stop
```typescript
interface Stop {
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
  zone?: string;
}
```

### Schedule
```typescript
interface Schedule {
  id: number;
  routeId: number;
  routeName: string;
  stopId: number;
  stopName: string;
  departureTime: string;
  arrivalTime: string;
  dayType: "WEEKDAY" | "SATURDAY" | "SUNDAY";
}
```

### API Response Wrapper
```typescript
interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}
```

### GeoJSON Features
```typescript
interface RouteFeature extends Feature<LineString> {
  properties: {
    id: number;
    routeNumber: string;
    name: string;
    color: string;
  };
}

interface StopFeature extends Feature<Point> {
  properties: {
    id: number;
    code: string;
    name: string;
    hasShelter: boolean;
    wheelchairAccessible: boolean;
    bench?: boolean;
  };
}

interface BusFeature extends Feature<Point> {
  properties: {
    id: number;
    busNumber: string;
    licensePlate: string;
    status: Bus["status"];
    routeName?: string;
    routeId?: number;
    occupancyStatus: Bus["occupancyStatus"];
    currentPassengers: number;
    capacity: number;
    lastUpdated?: string;
  };
}
```

---

## ✨ Special Features

### 1. OSRM Road Snapping
- **Purpose:** Ensures bus routes follow actual roads instead of cutting through buildings
- **Implementation:** Uses free OSRM demo servers
- **Fallback:** Returns original coordinates if all servers fail
- **Optimization:** Samples coordinates to avoid URL length limits (max 25 points)

### 2. Geospatial Queries
- **Nearest Search:** Find buses/stops within a radius
- **Bounding Box:** Query entities within geographic bounds
- **Top Nearest:** Get limited results sorted by distance
- **Distance Calculation:** Calculate distance between stops

### 3. Accessibility Features
- Wheelchair-accessible stops filtering
- Shelter and bench information
- Accessibility status in stop properties

### 4. Real-time Updates
- Bus location tracking with speed and heading
- Occupancy status updates
- Next stop tracking
- Status changes (ACTIVE/INACTIVE/MAINTENANCE)

### 5. Soft Delete
- Routes and supports soft delete by default
- Hard delete option available
- Preserves data integrity

### 6. Bulk Operations
- Bulk create stops
- Bulk delete stops
- Batch route snapping with rate limiting

### 7. Schedule Management
- Different schedules for weekdays, Saturdays, and Sundays
- Route-based schedule queries
- Stop-based schedule queries
- Upcoming departures with limit

### 8. GeoJSON Export
- Export stops as GeoJSON format
- Compatible with mapping tools
- Standard geospatial data format

---

## 🗄 State Management

### Redux Store Structure
```typescript
interface RootState {
  buses: BusState;
  routes: RouteState;
  stops: StopState;
  ui: UIState;
}

interface BusState {
  buses: Bus[];
  nearestBuses: Bus[];
  selectedBus: Bus | null;
  searchRadius: number;
  loading: boolean;
  error: string | null;
}

interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
}

interface StopState {
  stops: Stop[];
  nearestStops: Stop[];
  selectedStop: Stop | null;
  loading: boolean;
  error: string | null;
}

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  mapCenter: [number, number];
  mapZoom: number;
  userLocation: UserLocation | null;
  loading: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  };
}
```

### State Management Pattern
- **Redux Toolkit** for simplified Redux setup
- **Slices** for modular state management
- **Async thunks** for API calls
- **Selectors** for efficient data access

---

## 🔐 Authentication

### Token Storage
- Tokens stored in localStorage or sessionStorage
- Configurable persistence via `getTokenPersistence()`
- Automatic token injection in request headers

### Token Refresh Flow
1. API call returns 401 Unauthorized
2. Interceptor catches the error
3. Attempts token refresh via `/auth/refresh`
4. If successful: retries original request with new token
5. If failed: clears token and redirects to login

### Auth Interceptors
```typescript
// Request interceptor
config.headers.Authorization = `Bearer ${token}`;

// Response interceptor
if (status === 401 && !originalRequest._retry) {
  // Attempt token refresh
  // Retry original request
}
```

---

## ⚙️ Configuration

### Environment Variables
```bash
# Busway API
REACT_APP_BUSWAY_API_URL=http://localhost:9090/api/busway

# General API
REACT_APP_API_URL=

# Event Handler API
REACT_APP_EVENTHANDLER_API_URL=

# Map Configuration
REACT_APP_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
REACT_APP_MAP_ATTRIBUTION=© OpenStreetMap contributors
```

### Build Configuration
```json
{
  "scripts": {
    "start": "set NODE_OPTIONS=--max-old-space-size=4096 && craco start",
    "build": "set NODE_OPTIONS=--max-old-space-size=4096 && craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
}
```

### Memory Configuration
- Node.js heap size increased to 4GB for large builds
- Craco for custom webpack configuration
- Optimized for large-scale applications

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:9090`

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Development
- Application runs on `http://localhost:3000`
- Hot module replacement enabled
- API proxy configured for development

---

## 📝 API Usage Examples

### Get All Buses
```typescript
import { busService } from './services/BusWay/busService';

const buses = await busService.getAll();
```

### Find Nearest Buses
```typescript
const nearestBuses = await busService.findNearest(
  34.6815,  // latitude
  -1.908,   // longitude
  500       // radius in meters
);
```

### Create Route with OSRM Snapping
```typescript
import { routeService } from './services/BusWay/routeService';
import { snapRouteToRoads } from './services/BusWay/osrmService';

const coordinates = [
  [-1.908, 34.6815],
  [-1.895, 34.674],
  [-1.885, 34.665]
];

// Snap to roads
const snapped = await snapRouteToRoads(coordinates);

// Create route
const route = await routeService.create({
  routeNumber: "L1",
  name: "Line 1 - City Center",
  color: "#FF0000",
  coordinates: snapped.coordinates
});
```

### Get Stops by City
```typescript
const cityStops = await stopService.getByCity("Oujda");
```

### Get Upcoming Departures
```typescript
const departures = await scheduleService.getUpcoming(
  123, // stopId
  10   // limit
);
```

---

## 🎨 UI Components

### Material UI Components
- Buttons, Cards, Dialogs
- Tables, Lists, Grids
- Forms, Inputs, Selects
- Navigation, Tabs, Drawers

### Custom Components
- Bus markers on map
- Route visualization
- Stop indicators
- Real-time updates
- Accessibility badges

### Animation
- Framer Motion for smooth transitions
- GSAP for complex animations
- React Three Fiber for 3D elements

---

## 🔍 Testing

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- TypeScript for type checking

### Test Commands
```bash
npm test
```

---

## 📦 Deployment

### Production Build
```bash
npm run build
```

### Output
- Optimized and minified files in `build/` directory
- Hashed filenames for cache busting
- Ready for deployment to any static hosting service

---

## 🤝 Contributing

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits

### Best Practices
- Use service layer for API calls
- Implement error handling
- Add TypeScript types
- Write tests for new features
- Document complex logic

---

## 📄 License

This project is part of the Smart City platform.

---

## 📞 Support

For issues or questions related to the Busway module, please contact the development team.

---

**Last Updated:** May 2026
**Version:** 0.1.0
