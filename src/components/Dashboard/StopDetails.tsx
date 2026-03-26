import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Place as PlaceIcon,
  Accessible as AccessibleIcon,
  Roofing as RoofingIcon,
  BeachAccess as BeachAccessIcon,
  Schedule as ScheduleIcon,
  DirectionsBus as BusIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { scheduleService } from '../../services/BusWay/scheduleService';
import { Schedule } from '../../types';
import { formatTime } from '../../utils/formatters';

const StopDetails: React.FC = () => {
  const { selectedStop } = useAppSelector((state) => state.stops);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStop) {
      loadSchedules();
    }
  }, [selectedStop]);

  const loadSchedules = async () => {
    if (!selectedStop) return;

    setLoading(true);
    setError(null);

    try {
      const data = await scheduleService.getByStop(selectedStop.id);
      setSchedules(data);
    } catch (err) {
      setError('Failed to load schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedStop) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" align="center">
            Select a stop on the map to view details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PlaceIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{selectedStop.name}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Code: {selectedStop.code}
        </Typography>

        <Typography variant="body2" paragraph>
          {selectedStop.address}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          {selectedStop.hasShelter && (
            <Chip icon={<RoofingIcon />} label="Shelter" size="small" color="primary" />
          )}
          {selectedStop.wheelchairAccessible && (
            <Chip icon={<AccessibleIcon />} label="Accessible" size="small" color="success" />
          )}
          {selectedStop.bench && (
            <Chip icon={<BeachAccessIcon />} label="Bench" size="small" color="secondary" />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ScheduleIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Upcoming Departures</Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : schedules.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No upcoming departures
          </Typography>
        ) : (
          <List>
            {schedules.slice(0, 5).map((schedule, index) => (
              <React.Fragment key={schedule.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">
                          Route {schedule.routeName}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                        <Typography variant="caption" color="primary">
                          Departs: {formatTime(schedule.departureTime)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Arrives: {formatTime(schedule.arrivalTime)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={loadSchedules}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Refresh Schedule
        </Button>
      </CardContent>
    </Card>
  );
};

export default StopDetails;