import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Place as PlaceIcon,
  Search as SearchIcon,
  Accessible as AccessibleIcon,
  Roofing as RoofingIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedStop } from '../../store/slices/stopSlice';
import { setMapCenter, setMapZoom } from '../../store/slices/uiSlice';

const StopList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stops, loading } = useAppSelector((state) => state.stops);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStops = stops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStopClick = (stop: any) => {
    dispatch(setSelectedStop(stop));
    dispatch(setMapCenter([stop.longitude, stop.latitude]));
    dispatch(setMapZoom(16));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Bus Stops
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search stops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredStops.map((stop, index) => (
              <React.Fragment key={stop.id}>
                {index > 0 && <Divider />}
                <ListItemButton
                  onClick={() => handleStopClick(stop)}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon>
                    <PlaceIcon color={stop.hasShelter ? 'primary' : 'action'} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {stop.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={stop.code}
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {stop.address}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          {stop.hasShelter && (
                            <RoofingIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                          )}
                          {stop.wheelchairAccessible && (
                            <AccessibleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </React.Fragment>
            ))}
          </List>
        )}

        {filteredStops.length === 0 && !loading && (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            No stops found
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StopList;
