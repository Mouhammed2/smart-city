import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { clearError, login, logout } from '../store/authSlice';
import { useAuth } from '../store/useAuth';
import { showNotification } from '../../store/slices/uiSlice';

const LoginDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAuth();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleOpen = () => {
    setOpen(true);
    clearError();
  };

  const handleClose = () => {
    setOpen(false);
    setUsername('');
    setPassword('');
    clearError();
  };

  const handleLogin = async () => {
    if (!username || !password) {
      dispatch(showNotification({ message: 'Please enter username and password', severity: 'warning' }));
      return;
    }

    try {
      await login({ email: username, password });
      dispatch(showNotification({ message: `Welcome back, ${username}!`, severity: 'success' }));
      handleClose();
    } catch (caughtError) {
      dispatch(showNotification({ message: caughtError instanceof Error ? caughtError.message : 'Login failed', severity: 'error' }));
    }
  };

  const handleLogout = async () => {
    await logout();
    dispatch(showNotification({ message: 'Logged out successfully', severity: 'info' }));
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin');
    } else {
      setUsername('user');
      setPassword('user');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000, boxShadow: 3 }}
        >
          Login
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                For testing, use one of these accounts:
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip
                  label="Admin (admin/admin)"
                  onClick={() => handleQuickLogin('admin')}
                  color="primary"
                  variant="outlined"
                  clickable
                />
                <Chip
                  label="User (user/user)"
                  onClick={() => handleQuickLogin('user')}
                  color="secondary"
                  variant="outlined"
                  clickable
                />
              </Box>

              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLogin} variant="contained" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          bgcolor: 'background.paper',
          px: 2,
          py: 1,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Chip label={user?.role} color={user?.role === 'ADMIN' ? 'primary' : 'default'} size="small" />
        <Typography variant="body2">{user?.username}</Typography>
        <Button size="small" onClick={handleLogout} variant="outlined">
          Logout
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1">
              <strong>Username:</strong> {user?.username}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginDialog;

