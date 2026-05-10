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
  InputBase,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  Notifications as NotificationIcon,
  Logout as LogoutIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  toggleSidebar,
  selectSidebarOpen,
  selectTheme,
  setTheme,
} from "../../store/slices/uiSlice";
import { selectUnreadCount } from "../../store/slices/notificationsSlice";
import { useAuth } from "../../../auth/store/useAuth";
import { logout } from "../../../auth/store/authSlice";

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const currentTheme = useAppSelector(selectTheme);
  const unreadCount = useAppSelector(selectUnreadCount);
  const { user, isAuthenticated } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(setTheme(currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ minHeight: "72px !important" }}>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
          edge="start"
          sx={{
            mr: 2,
            transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 0,
            mr: 4,
            fontWeight: 700,
            color: theme.palette.primary.main,
            cursor: "pointer",
          }}
          onClick={() => navigate("/events")}
        >
          EventsHandler
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.08),
            },
            marginRight: 2,
            marginLeft: 0,
            width: "100%",
            maxWidth: 400,
            display: { xs: "none", sm: "flex" },
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search events..."
            sx={{
              color: "inherit",
              "& .MuiInputBase-input": {
                padding: theme.spacing(1.5, 1, 1.5, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create("width"),
                width: "100%",
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.target as HTMLInputElement).value;
                if (query) {
                  navigate(
                    `/events/events?search=${encodeURIComponent(query)}`,
                  );
                }
              }
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Quick Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="View Map">
            <IconButton color="inherit" onClick={() => navigate("/events/map")}>
              <MapIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={() => navigate("/events/notifications")}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Theme">
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {currentTheme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          {isAuthenticated && user ? (
            <>
              <Tooltip title="Account">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {(user as unknown as { avatar?: string }).avatar ? (
                    <Avatar
                      src={(user as unknown as { avatar?: string }).avatar}
                      alt={user.username}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    minWidth: 200,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/events/profile");
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} fontSize="small" />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton color="inherit" onClick={() => navigate("/login")}>
              <AccountCircle />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
