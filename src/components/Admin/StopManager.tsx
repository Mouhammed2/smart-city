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
  Checkbox,
  FormControlLabel,
  Alert,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { stopService } from '../../services/BusWay/stopService';
import { Stop } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { showNotification } from '../../store/slices/uiSlice';

interface StopFormData {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  hasShelter: boolean;
  wheelchairAccessible: boolean;
  bench: boolean;
  city?: string;
}

const initialFormData: StopFormData = {
  code: '',
  name: '',
  latitude: 40.7484,
  longitude: -73.9857,
  address: '',
  hasShelter: false,
  wheelchairAccessible: false,
  bench: false,
  city: '',
};

const StopManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<Stop | null>(null);
  const [formData, setFormData] = useState<StopFormData>(initialFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [stopToDelete, setStopToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadStops();
  }, []);

  const loadStops = async () => {
    setLoading(true);
    try {
      const data = await stopService.getAll();
      setStops(data || []);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to load stops',
        severity: 'error',
      }));
      setStops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (stop?: Stop) => {
    if (stop) {
      setEditingStop(stop);
      setFormData({
        code: stop.code,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
        address: stop.address,
        hasShelter: stop.hasShelter,
        wheelchairAccessible: stop.wheelchairAccessible,
        bench: stop.bench || false,
        city: stop.city,
      });
    } else {
      setEditingStop(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStop(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      if (editingStop) {
        await stopService.update(editingStop.id, formData);
        dispatch(showNotification({
          message: 'Stop updated successfully',
          severity: 'success',
        }));
      } else {
        await stopService.create(formData);
        dispatch(showNotification({
          message: 'Stop created successfully',
          severity: 'success',
        }));
      }
      handleCloseDialog();
      loadStops();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to save stop',
        severity: 'error',
      }));
    }
  };

  const handleDeleteClick = (id: number) => {
    setStopToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!stopToDelete) return;

    try {
      await stopService.delete(stopToDelete);
      dispatch(showNotification({
        message: 'Stop deleted successfully',
        severity: 'success',
      }));
      loadStops();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to delete stop',
        severity: 'error',
      }));
    } finally {
      setDeleteConfirmOpen(false);
      setStopToDelete(null);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Stop Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Stop
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Amenities</TableCell>
              <TableCell>Address</TableCell>
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
            ) : stops.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No stops found
                </TableCell>
              </TableRow>
            ) : (
              stops.map((stop) => (
                <TableRow key={stop.id}>
                  <TableCell>
                    <Chip label={stop.code} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{stop.name}</TableCell>
                  <TableCell>
                    <Typography variant="caption" display="block">
                      Lat: {stop.latitude?.toFixed(6) ?? 'N/A'}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Lng: {stop.longitude?.toFixed(6) ?? 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {stop.hasShelter && (
                        <Chip label="Shelter" size="small" color="primary" />
                      )}
                      {stop.wheelchairAccessible && (
                        <Chip label="♿" size="small" color="success" />
                      )}
                      {stop.bench && (
                        <Chip label="Bench" size="small" color="secondary" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{stop.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(stop)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(stop.id)} size="small" color="error">
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
          {editingStop ? 'Edit Stop' : 'Create New Stop'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Stop Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Stop Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
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
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              fullWidth
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasShelter}
                    onChange={(e) => setFormData({ ...formData, hasShelter: e.target.checked })}
                  />
                }
                label="Has Shelter"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.wheelchairAccessible}
                    onChange={(e) => setFormData({ ...formData, wheelchairAccessible: e.target.checked })}
                  />
                }
                label="Wheelchair Accessible"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.bench}
                    onChange={(e) => setFormData({ ...formData, bench: e.target.checked })}
                  />
                }
                label="Has Bench"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingStop ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this stop? This action cannot be undone.</Typography>
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

export default StopManager;