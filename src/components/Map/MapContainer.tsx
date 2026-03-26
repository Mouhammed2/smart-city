import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, GeoJSON, useMap, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setMapCenter, setMapZoom } from '../../store/slices/uiSlice';
import { selectAllRoutes, selectSelectedRoute, setSelectedRoute } from '../../store/slices/routeSlice';
import { selectAllStops, selectSelectedStop, setSelectedStop } from '../../store/slices/stopSlice';
import { selectAllBuses } from '../../store/slices/busSlice';
import { RouteFeature, StopFeature, BusFeature } from '../../busWay/types';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapContainerProps {
  showUserLocation?: boolean;
  showNearestBuses?: boolean;
  showSearchRadius?: boolean;
  interactive?: boolean;
}

// Map controller component
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const MapContainer: React.FC<MapContainerProps> = ({
  showUserLocation = false,
  showNearestBuses = false,
  showSearchRadius = false,
  interactive = true
}) => {
  const dispatch = useAppDispatch();
  const mapRef = useRef<L.Map | null>(null);
  
  const { mapCenter, mapZoom, userLocation } = useAppSelector((state) => state.ui);
  const { searchRadius } = useAppSelector((state) => state.buses);
  const routes = useAppSelector(selectAllRoutes);
  const selectedRoute = useAppSelector(selectSelectedRoute);
  const stops = useAppSelector(selectAllStops);
  const selectedStop = useAppSelector(selectSelectedStop);
  const buses = useAppSelector(selectAllBuses);
  const { nearestBuses } = useAppSelector((state) => state.buses);

  // Convert routes to GeoJSON features
  const routeFeatures = useMemo((): RouteFeature[] => {
    if (!routes || !Array.isArray(routes)) return [];
    return routes.map(route => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route.geometry?.coordinates || []
      },
      properties: {
        id: route.id,
        routeNumber: route.routeNumber,
        name: route.name,
        color: route.color || '#FF5733'
      }
    }));
  }, [routes]);

  // Convert stops to GeoJSON features
  const stopFeatures = useMemo((): StopFeature[] => {
    if (!stops || !Array.isArray(stops)) return [];
    return stops.map(stop => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [stop.longitude || 0, stop.latitude || 0]
      },
      properties: {
        id: stop.id,
        code: stop.code,
        name: stop.name,
        hasShelter: stop.hasShelter,
        wheelchairAccessible: stop.wheelchairAccessible,
        bench: stop.bench
      }
    }));
  }, [stops]);

  // Convert buses to GeoJSON features
  const busFeatures = useMemo((): BusFeature[] => {
    const busesToShow = showNearestBuses ? (nearestBuses || []) : (buses || []);
    if (!Array.isArray(busesToShow)) return [];
    return busesToShow.map(bus => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [bus.longitude || 0, bus.latitude || 0]
      },
      properties: {
        id: bus.id,
        busNumber: bus.busNumber,
        status: bus.status,
        routeName: bus.routeName,
        routeId: bus.routeId,
        occupancyStatus: bus.occupancyStatus,
        currentPassengers: bus.currentPassengers,
        capacity: bus.capacity,
        lastUpdated: bus.lastUpdated
      }
    }));
  }, [buses, nearestBuses, showNearestBuses]);

  // Route style function
  const getRouteStyle = (feature: any) => {
    const isSelected = selectedRoute?.id === feature.properties.id;
    return {
      color: feature.properties.color || '#FF5733',
      weight: isSelected ? 8 : 5,
      opacity: isSelected ? 1 : 0.8
    };
  };

  // Route click handler
  const onRouteClick = (e: any) => {
    const route = routes.find(r => r.id === e.target.feature.properties.id);
    if (route) {
      dispatch(setSelectedRoute(route));
    }
  };

  // Stop style function
  const getStopIcon = (feature: any) => {
    const isSelected = selectedStop?.id === feature.properties.id;
    const hasShelter = feature.properties.hasShelter;
    const color = hasShelter ? '#2196F3' : '#FF9800';
    
    return L.divIcon({
      className: 'custom-stop-marker',
      html: `<div style="
        width: ${isSelected ? 20 : 14}px;
        height: ${isSelected ? 20 : 14}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [isSelected ? 20 : 14, isSelected ? 20 : 14],
      iconAnchor: [isSelected ? 10 : 7, isSelected ? 10 : 7]
    });
  };

  // Bus style function
  const getBusIcon = (feature: any) => {
    const occupancy = feature.properties.occupancyStatus;
    const color = occupancy === 'AVAILABLE' ? '#4CAF50' : 
                  occupancy === 'LIMITED' ? '#FF9800' : '#F44336';
    
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `<div style="
        width: 16px;
        height: 16px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  // Ensure valid center coordinates (Leaflet uses [lat, lng])
  const validCenter: [number, number] = useMemo(() => {
    const [lng, lat] = mapCenter;
    if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
      return [40.7484, -73.9857]; // Default to NYC
    }
    return [lat, lng];
  }, [mapCenter]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Data Count Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderRadius: 2,
          px: 2,
          py: 1,
          boxShadow: 2,
          maxWidth: 350
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          {routes.length} Routes | {stops.length} Stops | {buses.length} Buses
        </Typography>
        <Typography variant="caption" color="primary" display="block" sx={{ fontSize: '10px', mt: 0.5 }}>
          Leaflet Map | Center: {validCenter[0].toFixed(4)}, {validCenter[1].toFixed(4)}
        </Typography>
      </Box>

      <LeafletMap
        center={validCenter}
        zoom={mapZoom || 13}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={validCenter} zoom={mapZoom || 13} />

        {/* Route Layers */}
        {routeFeatures.length > 0 && (
          <GeoJSON
            data={{
              type: 'FeatureCollection',
              features: routeFeatures
            } as any}
            style={getRouteStyle}
            eventHandlers={{
              click: onRouteClick
            }}
          />
        )}

        {/* Stop Markers */}
        {stopFeatures.map((stop) => (
          <Marker
            key={stop.properties.id}
            position={[stop.geometry.coordinates[1], stop.geometry.coordinates[0]]}
            icon={getStopIcon(stop)}
            eventHandlers={{
              click: () => {
                const stopData = stops.find(s => s.id === stop.properties.id);
                if (stopData) dispatch(setSelectedStop(stopData));
              }
            }}
          >
            <Popup>
              <div>
                <strong>{stop.properties.name}</strong><br />
                Code: {stop.properties.code}<br />
                {stop.properties.hasShelter && '🏠 Shelter '} 
                {stop.properties.wheelchairAccessible && '♿ Accessible'}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus Markers */}
        {busFeatures.map((bus) => (
          <Marker
            key={bus.properties.id}
            position={[bus.geometry.coordinates[1], bus.geometry.coordinates[0]]}
            icon={getBusIcon(bus)}
          >
            <Popup>
              <div>
                <strong>Bus {bus.properties.busNumber}</strong><br />
                Route: {bus.properties.routeName}<br />
                Status: {bus.properties.occupancyStatus}<br />
                Passengers: {bus.properties.currentPassengers}/{bus.properties.capacity}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Search Radius Circle */}
        {showSearchRadius && userLocation && searchRadius > 0 && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={searchRadius}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />
        )}

        {/* User Location */}
        {showUserLocation && userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </LeafletMap>
    </Box>
  );
};

export default MapContainer;
