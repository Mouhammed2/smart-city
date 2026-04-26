import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar, setTheme } from "../../store/slices/uiSlice";
import { logout } from "../../../auth/store/authSlice";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.ui.theme);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(currentTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/login", { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/busway" || path === "/busway/dashboard") return "Dashboard";
    if (path === "/busway/routes") return "Routes";
    if (path === "/busway/stops") return "Bus Stops";
    if (path === "/busway/buses") return "Live Buses";
    if (path === "/busway/schedules") return "Schedules";
    if (path === "/busway/admin") return "Administration";
    return "BusWay GIS";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: "blur(20px)",
        backgroundImage: "none",
      }}
    >
      <Toolbar sx={{ minHeight: 72 }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => dispatch(toggleSidebar())}
          sx={{
            mr: 2,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {getPageTitle()}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Theme Toggle */}
          <Tooltip
            title={`Switch to ${currentTheme === "light" ? "dark" : "light"} mode`}
          >
            <IconButton
              onClick={handleThemeToggle}
              sx={{
                transition: "transform 0.3s",
                "&:hover": { transform: "rotate(180deg)" },
              }}
            >
              <Fade in key={currentTheme}>
                {currentTheme === "light" ? (
                  <DarkModeIcon />
                ) : (
                  <LightModeIcon />
                )}
              </Fade>
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 2,
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ color: theme.palette.error.main }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
