import React from 'react';
import { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';

interface SearchRadiusProps {
  center: [number, number];
  radius: number; // in meters
}

const SearchRadius: React.FC<SearchRadiusProps> = React.memo(({ center, radius }) => {
  // Create a circle approximation using a polygon
  const createCirclePolygon = (center: [number, number], radiusInMeters: number, points: number = 64): number[][] => {
    const coords: number[][] = [];
    const earthRadius = 6371000; // Earth's radius in meters
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const dx = radiusInMeters * Math.cos(angle);
      const dy = radiusInMeters * Math.sin(angle);
      
      const newLng = center[0] + (dx / earthRadius) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180);
      const newLat = center[1] + (dy / earthRadius) * (180 / Math.PI);
      
      coords.push([newLng, newLat]);
    }
    
    return coords;
  };

  const circleGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [createCirclePolygon(center, radius)]
      },
      properties: {
        radius
      }
    }]
  };

  const radiusFillLayer: LayerProps = {
    id: 'search-radius-fill',
    type: 'fill',
    paint: {
      'fill-color': '#3366CC',
      'fill-opacity': 0.1
    }
  };

  const radiusStrokeLayer: LayerProps = {
    id: 'search-radius-stroke',
    type: 'line',
    paint: {
      'line-color': '#3366CC',
      'line-width': 2,
      'line-dasharray': [4, 2]
    }
  };

  return (
    <Source id="search-radius" type="geojson" data={circleGeoJSON}>
      <Layer {...radiusFillLayer} />
      <Layer {...radiusStrokeLayer} />
    </Source>
  );
});

SearchRadius.displayName = 'SearchRadius';

export default SearchRadius;
