import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getPendingEvents,
  getAllAdminEvents,
  getAllCompanies,
  getAllUsers,
  getDashboardStats,
  validateEvent,
  updateCompanyStatus,
  updateUserRole,
  deleteAdminEvent,
  deleteCompany,
  deleteUser,
  selectPendingEvents,
  selectAllAdminEvents,
  selectCompanies,
  selectUsers,
  selectDashboardStats,
  selectAdminLoading,
} from "../../store/slices/adminSlice";
import {
  Event,
  AdminCompany,
  AdminUser,
  EventStatus,
  CompanyStatus,
} from "../../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState<
    Event | AdminCompany | AdminUser | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<
    "validate" | "status" | "role" | "delete" | null
  >(null);
  const [reason, setReason] = useState("");

  const pendingEvents = useAppSelector(selectPendingEvents);
  const allEvents = useAppSelector(selectAllAdminEvents);
  const companies = useAppSelector(selectCompanies);
  const users = useAppSelector(selectUsers);
  const dashboardStats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectAdminLoading);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getPendingEvents());
    dispatch(getAllAdminEvents({ page: 0, size: 10 }));
    dispatch(getAllCompanies({ page: 0, size: 10 }));
    dispatch(getAllUsers({ page: 0, size: 10 }));
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const openDialog = (
    item: Event | AdminCompany | AdminUser,
    action: typeof dialogAction,
  ) => {
    setSelectedItem(item);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setDialogAction(null);
    setReason("");
  };

  const handleConfirm = () => {
    if (!selectedItem) return;

    switch (dialogAction) {
      case "validate":
        if ("status" in selectedItem) {
          dispatch(
            validateEvent({
              id: selectedItem.id,
              data: { Status: "APPROVED", RejectionReason: reason },
            }),
          );
        }
        break;
      case "status":
        if ("companyId" in selectedItem) {
          dispatch(
            updateCompanyStatus({
              id: selectedItem.id,
              data: { IsActive: true },
            }),
          );
        }
        break;
      case "role":
        if ("role" in selectedItem) {
          dispatch(
            updateUserRole({ id: selectedItem.id, data: { Role: "ADMIN" } }),
          );
        }
        break;
      case "delete":
        if ("status" in selectedItem && "category" in selectedItem) {
          dispatch(deleteAdminEvent(selectedItem.id));
        } else if ("companyId" in selectedItem) {
          dispatch(deleteCompany(selectedItem.id));
        } else if ("username" in selectedItem) {
          dispatch(deleteUser(selectedItem.id));
        }
        break;
    }
    closeDialog();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<
      string,
      "success" | "warning" | "error" | "default" | "info"
    > = {
      APPROVED: "success",
      PENDING: "warning",
      REJECTED: "error",
      ACTIVE: "success",
      INACTIVE: "default",
      SUSPENDED: "error",
      USER: "info",
      ADMIN: "success",
    };
    return colors[status] || "default";
  };

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Admin Dashboard
      </Typography>

      {/* Stats Overview */}
      {dashboardStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700} color="primary">
                {dashboardStats.totalEvents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Events
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {dashboardStats.pendingEvents}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Events
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {dashboardStats.totalCompanies}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Companies
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" fontWeight={700} color="info.main">
                {dashboardStats.totalUsers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Users
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label={`Pending Events (${pendingEvents.length})`} />
          <Tab label="All Events" />
          <Tab label="Companies" />
          <Tab label="Users" />
        </Tabs>

        {/* Pending Events Tab */}
        <TabPanel value={activeTab} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>
                      <Chip label={event.category} size="small" />
                    </TableCell>
                    <TableCell>{event.companyName}</TableCell>
                    <TableCell>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="success"
                        onClick={() => openDialog(event, "validate")}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDialog(event, "delete")}
                      >
                        <RejectIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* All Events Tab */}
        <TabPanel value={activeTab} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allEvents?.items.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        color={getStatusColor(event.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{event.category}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <IconButton>
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDialog(event, "delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Companies Tab */}
        <TabPanel value={activeTab} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Events</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies?.items.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.status}
                        color={getStatusColor(company.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{company.email}</TableCell>
                    <TableCell>{company.eventCount}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openDialog(company, "status")}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDialog(company, "delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Users Tab */}
        <TabPanel value={activeTab} index={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.items.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getStatusColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Yes" : "No"}
                        color={user.isActive ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openDialog(user, "role")}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => openDialog(user, "delete")}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogAction === "validate" && "Validate Event"}
          {dialogAction === "status" && "Update Company Status"}
          {dialogAction === "role" && "Update User Role"}
          {dialogAction === "delete" && "Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to {dialogAction} this item?
          </Typography>
          {(dialogAction === "validate" || dialogAction === "status") && (
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
