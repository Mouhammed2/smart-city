import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectNotification,
  clearNotification,
} from "../../store/slices/uiSlice";

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);

  const handleClose = () => {
    dispatch(clearNotification());
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
