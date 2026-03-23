import React, { useMemo, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import { Box, Typography, Chip, Paper, LinearProgress } from '@mui/material';
import { DirectionsBus, People, Schedule } from '@mui/icons-material';
import { BusFeature, Bus } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { setSelectedBus } from '../../store/slices/busSlice';
import { formatOccupancy, getOccupancyColor } from '../../utils/formatters';

interface BusMarkersProps {
  features: BusFeature[];
}

const BusMarkers: React.FC<BusMarkersProps> = React.memo(({ features }) => {
  const dispatch = useAppDispatch();
  const [selectedBusId, setSelectedBusId] = useState<number | null>(null);

  const selectedBus = useMemo(() => {
    if (!selectedBusId) return null;
    const feature = features.find(f => f.properties.id === selectedBusId);
    if (!feature) return null;
    return {
      id: feature.properties.id,
      busNumber: feature.properties.busNumber,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      status: feature.properties.status,
      routeName: feature.properties.routeName,
      routeId: feature.properties.routeId,
      occupancyStatus: feature.properties.occupancyStatus,
      currentPassengers: feature.properties.currentPassengers,
      capacity: feature.properties.capacity,
      lastUpdated: feature.properties.lastUpdated
    } as Bus;
  }, [features, selectedBusId]);

  const geojson: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features
  }), [features]);

  const getOccupancyPercentage = (current: number, capacity: number): number => {
    return Math.min((current / capacity) * 100, 100);
  };

  const busLayerStyle: LayerProps = {
    id: 'buses',
    type: 'circle',
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'id'], selectedBusId || -1],
        16,
        12
      ],
      'circle-color': [
        'match',
        ['get', 'occupancyStatus'],
        'AVAILABLE', '#4CAF50',
        'LIMITED', '#FF9800',
        'FULL', '#F44336',
        '#9E9E9E'
      ],
      'circle-stroke-width': [
        'case',
        ['==', ['get', 'id'], selectedBusId || -1],
        4,
        2
      ],
      'circle-stroke-color': '#ffffff'
    }
  };

  // Glow effect for selected bus
  const busGlowLayer: LayerProps = {
    id: 'buses-glow',
    type: 'circle',
    paint: {
      'circle-radius': [
        'case',
        ['==', ['get', 'id'], selectedBusId || -1],
        24,
        0
      ],
      'circle-color': [
        'match',
        ['get', 'occupancyStatus'],
        'AVAILABLE', '#4CAF50',
        'LIMITED', '#FF9800',
        'FULL', '#F44336',
        '#9E9E9E'
      ],
      'circle-opacity': 0.3,
      'circle-blur': 3
    }
  };

  const busLabelLayer: LayerProps = {
    id: 'bus-labels',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'busNumber'],
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
      'text-size': 10,
      'text-offset': [0, -1.5],
      'text-anchor': 'bottom'
    },
    paint: {
      'text-color': '#333',
      'text-halo-color': '#fff',
      'text-halo-width': 2
    }
  };

  return (
    <>
      <Source id="buses" type="geojson" data={geojson}>
        <Layer {...busGlowLayer} />
        <Layer {...busLayerStyle} />
        <Layer {...busLabelLayer} />
      </Source>
      
      {selectedBus && (
        <Popup
          longitude={selectedBus.longitude}
          latitude={selectedBus.latitude}
          anchor="bottom"
          onClose={() => {
            setSelectedBusId(null);
            dispatch(setSelectedBus(null));
          }}
          closeButton={true}
          closeOnClick={false}
        >
          <Paper elevation={0} sx={{ minWidth: 260, p: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DirectionsBus color="primary" />
              <Typography variant="subtitle1" fontWeight="bold">
                Bus {selectedBus.busNumber}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Route: {selectedBus.routeName || 'Unknown'}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Occupancy</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {selectedBus.currentPassengers}/{selectedBus.capacity}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getOccupancyPercentage(selectedBus.currentPassengers, selectedBus.capacity)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getOccupancyColor(
                      selectedBus.occupancyStatus,
                      selectedBus.currentPassengers,
                      selectedBus.capacity
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<People fontSize="small" />}
                label={formatOccupancy(selectedBus.occupancyStatus, selectedBus.currentPassengers, selectedBus.capacity)}
                size="small"
                color={selectedBus.occupancyStatus === 'AVAILABLE' ? 'success' : 'warning'}
              />
              {selectedBus.lastUpdated && (
                <Chip
                  icon={<Schedule fontSize="small" />}
                  label={new Date(selectedBus.lastUpdated).toLocaleTimeString()}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Status: {selectedBus.status}
            </Typography>
          </Paper>
        </Popup>
      )}
    </>
  );
});

BusMarkers.displayName = 'BusMarkers';

export default BusMarkers;
