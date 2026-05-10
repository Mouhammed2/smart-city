import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import {
  Notifications as NotificationIcon,
  Event as EventIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
  Info as InfoIcon,
  CheckCircle as ReadIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkAllReadIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  selectNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
} from "../../store/slices/notificationsSlice";
import { useAuth } from "../../../auth/store/useAuth";
import { Notification, NotificationType } from "../../types";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "EVENT_REMINDER":
    case "EVENT_UPDATE":
      return <EventIcon color="primary" />;
    case "NEW_COMMENT":
      return <CommentIcon color="info" />;
    case "FAVORITE_EVENT":
      return <FavoriteIcon color="error" />;
    case "PROMOTION":
      return <InfoIcon color="warning" />;
    default:
      return <NotificationIcon color="action" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "EVENT_REMINDER":
    case "EVENT_UPDATE":
      return "primary";
    case "NEW_COMMENT":
      return "info";
    case "FAVORITE_EVENT":
      return "error";
    case "PROMOTION":
      return "warning";
    default:
      return "default";
  }
};

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const loading = useAppSelector(selectNotificationsLoading);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      dispatch(getUserNotifications(user.id.toString()));
      dispatch(getUnreadCount(user.id.toString()));
    }
  }, [dispatch, user?.id]);

  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    if (user?.id) {
      dispatch(markAllNotificationsAsRead(user.id.toString()));
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
        <Typography>Loading notifications...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error">
              <NotificationIcon />
            </Badge>
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<MarkAllReadIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <NotificationIcon
            sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            No notifications yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We'll notify you when something important happens
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor:
                      notification.status === "UNREAD"
                        ? "action.hover"
                        : "transparent",
                    transition: "background-color 0.2s",
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {notification.status === "UNREAD" && (
                        <IconButton
                          edge="end"
                          onClick={() => handleMarkAsRead(notification.id)}
                          color="primary"
                        >
                          <ReadIcon />
                        </IconButton>
                      )}
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={
                            notification.status === "UNREAD" ? 600 : 400
                          }
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.type}
                          size="small"
                          color={
                            getNotificationColor(notification.type) as
                              | "default"
                              | "primary"
                              | "info"
                              | "error"
                              | "warning"
                          }
                        />
                        {notification.status === "UNREAD" && (
                          <Chip
                            label="New"
                            size="small"
                            color="error"
                            variant="filled"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationsPage;
