import React, { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { UserLocation as UserLocationType } from '../../types';

interface UserLocationProps {
  location: UserLocationType;
}

const UserLocation: React.FC<UserLocationProps> = React.memo(({ location }) => {
  // Validate coordinates
  const isValidLocation = useMemo(() => {
    return typeof location.latitude === 'number' && 
           typeof location.longitude === 'number' &&
           !isNaN(location.latitude) && 
           !isNaN(location.longitude);
  }, [location]);

  if (!isValidLocation) {
    return null;
  }

  const pointGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      },
      properties: {}
    }]
  };

  // Only show accuracy circle if accuracy is a valid positive number
  const showAccuracy = location.accuracy && location.accuracy > 0;

  const userPointLayer: LayerProps = {
    id: 'user-location-point',
    type: 'circle',
    paint: {
      'circle-radius': 8,
      'circle-color': '#2563EB',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#ffffff',
    }
  };

  const userHaloLayer: LayerProps = {
    id: 'user-location-halo',
    type: 'circle',
    paint: {
      'circle-radius': 14,
      'circle-color': 'rgba(37, 99, 235, 0.3)',
    }
  };

  // Fixed radius for accuracy circle (in pixels)
  const accuracyRadius = showAccuracy ? Math.min(location.accuracy! / 10, 100) : 0;

  const accuracyLayer: LayerProps = showAccuracy ? {
    id: 'user-accuracy-circle',
    type: 'circle',
    paint: {
      'circle-radius': accuracyRadius,
      'circle-color': 'rgba(37, 99, 235, 0.1)',
      'circle-stroke-width': 1,
      'circle-stroke-color': 'rgba(37, 99, 235, 0.3)',
    }
  } : null as any;

  return (
    <>
      <Source id="user-location" type="geojson" data={pointGeoJSON}>
        <Layer {...userHaloLayer} />
        <Layer {...userPointLayer} />
      </Source>
      
      {showAccuracy && accuracyLayer && (
        <Source id="user-accuracy" type="geojson" data={pointGeoJSON}>
          <Layer {...accuracyLayer} />
        </Source>
      )}
    </>
  );
});

UserLocation.displayName = 'UserLocation';

export default UserLocation;
