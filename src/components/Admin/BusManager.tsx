import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Typography,
  CircularProgress,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MyLocation as LocationIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { busService } from '../../services/BusWay/busService';
import { routeService } from '../../services/BusWay/routeService';
import { Bus, Route } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { showNotification } from '../../store/slices/uiSlice';
import { getOccupancyColor } from '../../utils/formatters';

interface BusFormData {
  busNumber: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  routeId?: number;
  occupancyStatus: 'AVAILABLE' | 'FULL' | 'LIMITED';
  currentPassengers: number;
  capacity: number;
}

const initialFormData: BusFormData = {
  busNumber: '',
  latitude: 40.7484,
  longitude: -73.9857,
  status: 'ACTIVE',
  routeId: undefined,
  occupancyStatus: 'AVAILABLE',
  currentPassengers: 0,
  capacity: 50,
};

const BusManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState<BusFormData>(initialFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [busToDelete, setBusToDelete] = useState<number | null>(null);
  const [locationUpdateOpen, setLocationUpdateOpen] = useState(false);
  const [selectedBusForLocation, setSelectedBusForLocation] = useState<Bus | null>(null);
  const [newLocation, setNewLocation] = useState({ lat: 0, lng: 0 });
  const [occupancyUpdateOpen, setOccupancyUpdateOpen] = useState(false);
  const [newPassengerCount, setNewPassengerCount] = useState(0);

  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  const loadBuses = async () => {
    setLoading(true);
    try {
      const data = await busService.getAll();
      setBuses(data || []);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to load buses',
        severity: 'error',
      }));
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    try {
      const data = await routeService.getAll();
      setRoutes(data || []);
    } catch (error) {
      console.error('Failed to load routes:', error);
      setRoutes([]);
    }
  };

  const handleOpenDialog = (bus?: Bus) => {
    if (bus) {
      setEditingBus(bus);
      setFormData({
        busNumber: bus.busNumber,
        latitude: bus.latitude,
        longitude: bus.longitude,
        status: bus.status,
        routeId: bus.routeId,
        occupancyStatus: bus.occupancyStatus,
        currentPassengers: bus.currentPassengers,
        capacity: bus.capacity,
      });
    } else {
      setEditingBus(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBus(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingBus) {
        await busService.update(editingBus.id, formData);
        dispatch(showNotification({
          message: 'Bus updated successfully',
          severity: 'success',
        }));
      } else {
        await busService.create(formData);
        dispatch(showNotification({
          message: 'Bus created successfully',
          severity: 'success',
        }));
      }
      handleCloseDialog();
      loadBuses();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to save bus',
        severity: 'error',
      }));
    }
  };

  const handleDeleteClick = (id: number) => {
    setBusToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!busToDelete) return;

    try {
      await busService.delete(busToDelete);
      dispatch(showNotification({
        message: 'Bus deleted successfully',
        severity: 'success',
      }));
      loadBuses();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to delete bus',
        severity: 'error',
      }));
    } finally {
      setDeleteConfirmOpen(false);
      setBusToDelete(null);
    }
  };

  const handleOpenLocationUpdate = (bus: Bus) => {
    setSelectedBusForLocation(bus);
    setNewLocation({ lat: bus.latitude, lng: bus.longitude });
    setLocationUpdateOpen(true);
  };

  const handleLocationUpdate = async () => {
    if (!selectedBusForLocation) return;

    try {
      await busService.updateLocation(
        selectedBusForLocation.id,
        newLocation.lat,
        newLocation.lng
      );
      dispatch(showNotification({
        message: 'Bus location updated successfully',
        severity: 'success',
      }));
      setLocationUpdateOpen(false);
      loadBuses();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update bus location',
        severity: 'error',
      }));
    }
  };

  const handleOpenOccupancyUpdate = (bus: Bus) => {
    setSelectedBusForLocation(bus);
    setNewPassengerCount(bus.currentPassengers);
    setOccupancyUpdateOpen(true);
  };

  const handleOccupancyUpdate = async () => {
    if (!selectedBusForLocation) return;

    try {
      await busService.updateOccupancy(selectedBusForLocation.id, newPassengerCount);
      dispatch(showNotification({
        message: 'Bus occupancy updated successfully',
        severity: 'success',
      }));
      setOccupancyUpdateOpen(false);
      loadBuses();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to update bus occupancy',
        severity: 'error',
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'default';
      case 'MAINTENANCE':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Bus Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Bus
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bus Number</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Occupancy</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : buses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No buses found
                </TableCell>
              </TableRow>
            ) : (
              buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>
                    <Chip label={bus.busNumber} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{bus.routeName || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip
                      label={bus.status}
                      size="small"
                      color={getStatusColor(bus.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">
                      Lat: {bus.latitude.toFixed(6)}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Lng: {bus.longitude.toFixed(6)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">
                          {bus.currentPassengers}/{bus.capacity}
                        </Typography>
                        <Chip
                          label={bus.occupancyStatus}
                          size="small"
                          sx={{
                            backgroundColor: getOccupancyColor(
                              bus.occupancyStatus,
                              bus.currentPassengers,
                              bus.capacity
                            ),
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(bus.currentPassengers / bus.capacity) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getOccupancyColor(
                              bus.occupancyStatus,
                              bus.currentPassengers,
                              bus.capacity
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenLocationUpdate(bus)} size="small" title="Update Location">
                      <LocationIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenOccupancyUpdate(bus)} size="small" title="Update Occupancy">
                      <PeopleIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(bus)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(bus.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBus ? 'Edit Bus' : 'Create New Bus'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Bus Number"
              value={formData.busNumber}
              onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Route</InputLabel>
              <Select
                value={formData.routeId || ''}
                label="Route"
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value as number })}
              >
                <MenuItem value="">None</MenuItem>
                {routes.map((route) => (
                  <MenuItem key={route.id} value={route.id}>
                    {route.routeNumber} - {route.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="MAINTENANCE">Maintenance</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Latitude"
                type="number"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                fullWidth
                required
                inputProps={{ step: 0.000001 }}
              />
              <TextField
                label="Longitude"
                type="number"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                fullWidth
                required
                inputProps={{ step: 0.000001 }}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Occupancy Status</InputLabel>
              <Select
                value={formData.occupancyStatus}
                label="Occupancy Status"
                onChange={(e) => setFormData({ ...formData, occupancyStatus: e.target.value as any })}
              >
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="LIMITED">Limited</MenuItem>
                <MenuItem value="FULL">Full</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Current Passengers"
                type="number"
                value={formData.currentPassengers}
                onChange={(e) => setFormData({ ...formData, currentPassengers: parseInt(e.target.value) })}
                fullWidth
                required
                inputProps={{ min: 0, max: formData.capacity }}
              />
              <TextField
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBus ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location Update Dialog */}
      <Dialog open={locationUpdateOpen} onClose={() => setLocationUpdateOpen(false)}>
        <DialogTitle>Update Bus Location</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Latitude"
              type="number"
              value={newLocation.lat}
              onChange={(e) => setNewLocation({ ...newLocation, lat: parseFloat(e.target.value) })}
              fullWidth
              inputProps={{ step: 0.000001 }}
            />
            <TextField
              label="Longitude"
              type="number"
              value={newLocation.lng}
              onChange={(e) => setNewLocation({ ...newLocation, lng: parseFloat(e.target.value) })}
              fullWidth
              inputProps={{ step: 0.000001 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleLocationUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Occupancy Update Dialog */}
      <Dialog open={occupancyUpdateOpen} onClose={() => setOccupancyUpdateOpen(false)}>
        <DialogTitle>Update Passenger Count</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Passenger Count"
              type="number"
              value={newPassengerCount}
              onChange={(e) => setNewPassengerCount(parseInt(e.target.value))}
              fullWidth
              inputProps={{ min: 0, max: selectedBusForLocation?.capacity }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOccupancyUpdateOpen(false)}>Cancel</Button>
          <Button onClick={handleOccupancyUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this bus? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusManager;