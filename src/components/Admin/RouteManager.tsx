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
  Chip,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';
import { routeService } from '../../services/BusWay/routeService';
import { Route } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { showNotification } from '../../store/slices/uiSlice';

interface RouteFormData {
  routeNumber: string;
  name: string;
  color: string;
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
}

const initialFormData: RouteFormData = {
  routeNumber: '',
  name: '',
  color: '#3366CC',
  geometry: {
    type: 'LineString',
    coordinates: [],
  },
};

const RouteManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState<RouteFormData>(initialFormData);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const data = await routeService.getAll();
      setRoutes(data || []);
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to load routes',
        severity: 'error',
      }));
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (route?: Route) => {
    if (route) {
      setEditingRoute(route);
      setFormData({
        routeNumber: route.routeNumber,
        name: route.name,
        color: route.color,
        geometry: route.geometry,
      });
    } else {
      setEditingRoute(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRoute(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      // Convert GeoJSON coordinates to WKT format for backend
      const coords = formData.geometry.coordinates;
      const wktString = coords.length > 0 
        ? `LINESTRING (${coords.map((c: number[]) => `${c[0]} ${c[1]}`).join(', ')})`
        : '';
      
      const submitData = {
        ...formData,
        geometry: wktString  // Send as WKT string instead of GeoJSON object
      };
      
      console.log('Creating route with data:', submitData);
      if (editingRoute) {
        await routeService.update(editingRoute.id, submitData as any);
        dispatch(showNotification({
          message: 'Route updated successfully',
          severity: 'success',
        }));
      } else {
        await routeService.create(submitData as any);
        dispatch(showNotification({
          message: 'Route created successfully',
          severity: 'success',
        }));
      }
      handleCloseDialog();
      loadRoutes();
    } catch (error: any) {
      console.error('Failed to save route:', error);
      console.error('Error response:', error.response?.data);
      dispatch(showNotification({
        message: `Failed to save route: ${error.response?.data?.message || error.message}`,
        severity: 'error',
      }));
    }
  };

  const handleDeleteClick = (id: number) => {
    setRouteToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routeToDelete) return;

    try {
      await routeService.delete(routeToDelete);
      dispatch(showNotification({
        message: 'Route deleted successfully',
        severity: 'success',
      }));
      loadRoutes();
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to delete route',
        severity: 'error',
      }));
    } finally {
      setDeleteConfirmOpen(false);
      setRouteToDelete(null);
    }
  };

  // Simple coordinate input for demo - in production, use a map drawing tool
  const handleCoordinatesChange = (value: string) => {
    try {
      // Parse coordinates from string format: "[[lng,lat], [lng,lat]]"
      const coordinates = JSON.parse(value);
      setFormData({
        ...formData,
        geometry: {
          ...formData.geometry,
          coordinates,
        },
      });
    } catch (e) {
      // Invalid JSON, ignore
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Route Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Route
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Route Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Stops Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No routes found
                </TableCell>
              </TableRow>
            ) : (
              routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <Chip
                      label={route.routeNumber}
                      size="small"
                      sx={{ backgroundColor: route.color, color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: route.color,
                        borderRadius: 1,
                        border: '1px solid #ccc',
                      }}
                    />
                  </TableCell>
                  <TableCell>{route.geometry?.coordinates?.length ?? 0}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(route)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(route.id)} size="small" color="error">
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
          {editingRoute ? 'Edit Route' : 'Create New Route'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Route Number"
              value={formData.routeNumber}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Route Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="Color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                fullWidth
              />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: formData.color,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                }}
              />
            </Box>
            <TextField
              label="Coordinates (JSON format)"
              value={JSON.stringify(formData.geometry.coordinates)}
              onChange={(e) => handleCoordinatesChange(e.target.value)}
              fullWidth
              multiline
              rows={4}
              helperText="Format: [[lng,lat], [lng,lat], ...]"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingRoute ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this route? This action cannot be undone.</Typography>
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

export default RouteManager;