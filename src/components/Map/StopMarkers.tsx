import React, { useMemo } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { Accessible, BeachAccess, Roofing } from '@mui/icons-material';
import { StopFeature, Stop } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedStop } from '../../store/slices/stopSlice';

interface StopMarkersProps {
  features: StopFeature[];
  selectedStop: Stop | null;
}

const StopMarkers: React.FC<StopMarkersProps> = React.memo(({ features, selectedStop }) => {
  const dispatch = useAppDispatch();

  const geojson: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features
  }), [features]);

  const stopLayerStyle: LayerProps = {
    id: 'stops',
    type: 'circle',
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'id'], selectedStop?.id || -1],
        14,
        9
      ],
      'circle-color': [
        'case',
        ['==', ['get', 'hasShelter'], true],
        '#2196F3',  // Blue for sheltered stops
        '#FF9800'   // Orange for regular stops
      ],
      'circle-stroke-width': [
        'case',
        ['==', ['get', 'id'], selectedStop?.id || -1],
        4,
        2
      ],
      'circle-stroke-color': [
        'case',
        ['==', ['get', 'id'], selectedStop?.id || -1],
        '#FFFFFF',
        '#FFFFFF'
      ],
      'circle-opacity': 0.9,
      'circle-stroke-opacity': 1
    }
  };

  // Glow effect for selected stop
  const stopGlowLayer: LayerProps = {
    id: 'stops-glow',
    type: 'circle',
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'id'], selectedStop?.id || -1],
        20,
        0
      ],
      'circle-color': '#2196F3',
      'circle-opacity': 0.3,
      'circle-blur': 2
    }
  };

  return (
    <>
      <Source id="stops" type="geojson" data={geojson}>
        <Layer {...stopGlowLayer} />
        <Layer {...stopLayerStyle} />
      </Source>
      
      {selectedStop && (
        <Popup
          longitude={selectedStop.longitude}
          latitude={selectedStop.latitude}
          anchor="bottom"
          onClose={() => dispatch(setSelectedStop(null))}
          closeButton={true}
          closeOnClick={false}
        >
          <Paper elevation={0} sx={{ minWidth: 220, p: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {selectedStop.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Code: {selectedStop.code}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {selectedStop.address}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {selectedStop.hasShelter && (
                <Chip
                  icon={<Roofing fontSize="small" />}
                  label="Shelter"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedStop.wheelchairAccessible && (
                <Chip
                  icon={<Accessible fontSize="small" />}
                  label="Accessible"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
              {selectedStop.bench && (
                <Chip
                  icon={<BeachAccess fontSize="small" />}
                  label="Bench"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        </Popup>
      )}
    </>
  );
});

StopMarkers.displayName = 'StopMarkers';

export default StopMarkers;
