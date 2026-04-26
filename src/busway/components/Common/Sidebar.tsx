import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Home as HomeIcon,
  DirectionsBus as BusIcon,
  Place as StopIcon,
  Route as RouteIcon,
  Schedule as ScheduleIcon,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  toggleSidebar,
  setSidebarCollapsed,
  selectSidebarOpen,
  selectSidebarCollapsed,
} from "../../store/slices/uiSlice";
import { useAuth } from "../../../auth/store/useAuth";

const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 72;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const collapsed = useAppSelector(selectSidebarCollapsed);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // Public menu items - available to everyone
  const publicMenuItems: MenuItem[] = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/busway/dashboard" },
    { text: "Routes", icon: <RouteIcon />, path: "/busway/routes" },
    { text: "Stops", icon: <StopIcon />, path: "/busway/stops" },
    { text: "Live Buses", icon: <BusIcon />, path: "/busway/buses", badge: 12 },
    { text: "Schedules", icon: <ScheduleIcon />, path: "/busway/schedules" },
  ];

  const adminMenuItems: MenuItem[] = isAdmin
    ? [{ text: "Administration", icon: <AdminIcon />, path: "/busway/admin" }]
    : [];

  const drawerWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 600) {
      dispatch(toggleSidebar());
    }
  };

  const handleCollapseToggle = () => {
    dispatch(setSidebarCollapsed(!collapsed));
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive =
      item.path === "/busway"
        ? location.pathname === "/busway"
        : location.pathname.startsWith(item.path);

    const button = (
      <ListItemButton
        selected={isActive}
        onClick={() => handleNavigation(item.path)}
        sx={{
          minHeight: 48,
          px: collapsed ? 2 : 3,
          mx: 1,
          borderRadius: 2,
          mb: 0.5,
          justifyContent: collapsed ? "center" : "initial",
          transition: "all 0.2s ease",
          "&.Mui-selected": {
            backgroundColor: `${theme.palette.primary.main}15`,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: `${theme.palette.primary.main}25`,
            },
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            transform: "translateX(4px)",
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 0 : 40,
            mr: collapsed ? 0 : 2,
            justifyContent: "center",
            color: isActive ? theme.palette.primary.main : "inherit",
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive ? 600 : 500,
              fontSize: "0.9rem",
            }}
          />
        )}
      </ListItemButton>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.text} title={item.text} placement="right" arrow>
          <ListItem disablePadding sx={{ display: "block" }}>
            {button}
          </ListItem>
        </Tooltip>
      );
    }

    return (
      <Fade in key={item.text} style={{ transitionDelay: `${index * 50}ms` }}>
        <ListItem disablePadding sx={{ display: "block" }}>
          {button}
        </ListItem>
      </Fade>
    );
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          mt: "72px",
          height: "calc(100% - 72px)",
          borderRight: "none",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      <Box sx={{ overflow: "auto", py: 2 }}>
        {/* Collapse Toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            px: collapsed ? 0 : 2,
            mb: 2,
          }}
        >
          <IconButton
            onClick={handleCollapseToggle}
            size="small"
            sx={{
              transition: "transform 0.3s",
              transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* Main Menu */}
        <List sx={{ px: collapsed ? 0 : 1 }}>
          {publicMenuItems.map((item, index) => renderMenuItem(item, index))}
        </List>

        <>
          <Divider sx={{ my: 2, mx: collapsed ? 2 : 3 }} />
          <List sx={{ px: collapsed ? 0 : 1 }}>
            {adminMenuItems.map((item, index) =>
              renderMenuItem(item, index + publicMenuItems.length),
            )}
          </List>
        </>

        {/* Footer Info */}
        {!collapsed && (
          <Fade in>
            <Box sx={{ px: 3, py: 2, mt: "auto" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                BusWay GIS v2.0
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Real-time transit tracking
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
