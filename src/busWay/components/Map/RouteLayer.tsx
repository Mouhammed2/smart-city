import React, { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { LayerProps } from 'react-map-gl/maplibre';
import type { FeatureCollection } from 'geojson';
import { RouteFeature, Route } from '../../types';

interface RouteLayerProps {
  features: RouteFeature[];
  selectedRoute: Route | null;
}

const RouteLayer: React.FC<RouteLayerProps> = React.memo(({ features, selectedRoute }) => {
  // Debug logging
  React.useEffect(() => {
    console.log('RouteLayer - Features count:', features.length);
    if (features.length > 0) {
      const firstFeature = features[0];
      console.log('RouteLayer - First feature id:', firstFeature.properties?.id);
      console.log('RouteLayer - First feature geometry type:', firstFeature.geometry?.type);
      console.log('RouteLayer - First feature coords count:', firstFeature.geometry?.coordinates?.length);
      console.log('RouteLayer - First feature coords sample:', firstFeature.geometry?.coordinates?.slice(0, 2));
      console.log('RouteLayer - First feature color:', firstFeature.properties?.color);
    }
  }, [features]);

  const geojson: FeatureCollection = useMemo(() => {
    const validFeatures = features.filter(f => {
      const hasGeometry = f.geometry && f.geometry.coordinates;
      const hasCoords = hasGeometry && f.geometry.coordinates.length > 0;
      if (!hasGeometry) console.log('RouteLayer - Filtered out: no geometry', f.properties?.id);
      else if (!hasCoords) console.log('RouteLayer - Filtered out: no coordinates', f.properties?.id);
      return hasGeometry && hasCoords;
    });
    console.log('RouteLayer - Valid features for GeoJSON:', validFeatures.length);
    return {
      type: 'FeatureCollection',
      features: validFeatures
    };
  }, [features]);

  const routeLayerStyle: LayerProps = {
    id: 'routes',
    type: 'line',
    paint: {
      'line-width': 8,
      'line-color': '#FF0000',
      'line-opacity': 1
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    }
  };

  // Glow effect layer for selected route
  const routeGlowLayer: LayerProps = {
    id: 'routes-glow',
    type: 'line',
    paint: {
      'line-width': 12,
      'line-color': '#FF5733',
      'line-opacity': 0.4,
      'line-blur': 2
    },
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    }
  };

  const routeLabelsLayer: LayerProps = {
    id: 'route-labels',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'routeNumber'],
      'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
      'text-size': 14,
      'text-offset': [0, -1],
      'text-anchor': 'bottom',
      'symbol-placement': 'line-center',
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 3
    }
  };

  return (
    <>
      {geojson.features.length > 0 ? (
        <Source id="routes" type="geojson" data={geojson}>
          <Layer {...routeGlowLayer} />
          <Layer {...routeLayerStyle} />
          <Layer {...routeLabelsLayer} />
        </Source>
      ) : (
        console.log('RouteLayer: No features to render') as any
      )}
    </>
  );
});

RouteLayer.displayName = 'RouteLayer';

export default RouteLayer;
