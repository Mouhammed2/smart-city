import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getCompanyProfile,
  getCompanyEvents,
  updateCompanyProfile,
  completeCompanyProfile,
  checkCompanyProfileExists,
  createCompanyEvent,
  selectCompanyProfile,
  selectCompanyEvents,
  selectCompanyLoading,
  selectCompanyError,
} from "../../store/slices/companySlice";
import {
  CompanyProfile,
  Event,
  CreateEventRequest,
  EventCategory,
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

const CompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectCompanyProfile);
  const events = useAppSelector(selectCompanyEvents);
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);

  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<CompanyProfile>>(
    {},
  );
  const [newEvent, setNewEvent] = useState<Partial<CreateEventRequest>>({
    Category: "Other",
  });
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("[DEBUG] CompanyPage mounted, checking profile...");
    // Check if profile exists first
    dispatch(checkCompanyProfileExists())
      .unwrap()
      .then((exists) => {
        console.log("[DEBUG] Profile exists:", exists);
        setProfileExists(exists);
        if (exists) {
          dispatch(getCompanyProfile());
          dispatch(getCompanyEvents({}))
            .unwrap()
            .then((result) => console.log("[DEBUG] Events loaded:", result))
            .catch((err) => console.error("[DEBUG] Events failed:", err));
        }
      })
      .catch((err) => {
        console.error("[DEBUG] Profile check failed:", err);
        setProfileExists(false);
      });
  }, [dispatch]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveProfile = async () => {
    if (profile) {
      // Update existing profile - map to PascalCase for backend
      const updateData = {
        CompanyName: editedProfile.name,
        Description: editedProfile.description,
        Phone: editedProfile.phone,
        Address: editedProfile.address,
        City: editedProfile.city,
        Country: editedProfile.country,
        Website: editedProfile.website,
        LogoUrl: editedProfile.logoUrl,
        ...editedProfile,
      };
      await dispatch(updateCompanyProfile(updateData));
      setEditMode(false);
    } else {
      // Create new profile - need required fields (backend expects PascalCase)
      const completeData = {
        CompanyName: editedProfile.name || "",
        Description: editedProfile.description || "",
        Phone: editedProfile.phone || "",
        Address: editedProfile.address || "",
        City: editedProfile.city || "",
        Country: editedProfile.country || "",
        Website: editedProfile.website || "",
        Siret: (editedProfile as any).registrationNumber || "",
        VatNumber: (editedProfile as any).taxId || "",
        ...editedProfile,
      };
      const result = await dispatch(completeCompanyProfile(completeData));
      if (completeCompanyProfile.fulfilled.match(result)) {
        setProfileExists(true);
        setEditMode(false);
      }
      // If failed, keep form open so user can see the error and retry
    }
  };

  const handleCreateEvent = () => {
    console.log("[DEBUG] handleCreateEvent called");
    console.log("[DEBUG] newEvent state:", newEvent);

    if (
      newEvent.Title &&
      newEvent.EventDate &&
      newEvent.Location &&
      newEvent.Description &&
      newEvent.ExactAddress
    ) {
      // Build complete event data with defaults for required fields (backend expects PascalCase)
      const eventData: CreateEventRequest = {
        Title: newEvent.Title || "",
        Description: newEvent.Description || "",
        Category: newEvent.Category || "Other",
        EventDate: newEvent.EventDate || "",
        EndDate: newEvent.EndDate || newEvent.EventDate || undefined,
        Location: newEvent.Location || "",
        Latitude: newEvent.Latitude || undefined,
        Longitude: newEvent.Longitude || undefined,
        ExactAddress: newEvent.ExactAddress || newEvent.Location || "",
        ImageUrl: newEvent.ImageUrl,
        Price: newEvent.Price,
        MaxParticipants: newEvent.MaxParticipants,
      };
      console.log("[DEBUG] Dispatching createCompanyEvent with:", eventData);
      dispatch(createCompanyEvent(eventData));
      setCreateDialogOpen(false);
      setNewEvent({ Category: "Other" });
    } else {
      console.log("[DEBUG] Missing required fields:");
      console.log("  Title:", !!newEvent.Title);
      console.log("  EventDate:", !!newEvent.EventDate);
      console.log("  Location:", !!newEvent.Location);
      console.log("  Description:", !!newEvent.Description);
      console.log("  ExactAddress:", !!newEvent.ExactAddress);
    }
  };

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
      case "SUSPENDED":
        return "error";
      default:
        return "default";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      case "CANCELLED":
        return "error";
      case "COMPLETED":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Company Management
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Profile" />
          <Tab label={`My Events (${events.length})`} />
        </Tabs>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          {profile ? (
            <Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BusinessIcon sx={{ fontSize: 64, color: "primary.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      {profile.name}
                    </Typography>
                    <Chip
                      label={profile.status}
                      color={
                        getStatusColor(profile.status) as
                          | "success"
                          | "warning"
                          | "error"
                          | "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={<EditIcon />}
                  onClick={() => {
                    if (editMode) {
                      handleSaveProfile();
                    } else {
                      setEditedProfile(profile);
                      setEditMode(true);
                    }
                  }}
                >
                  {editMode ? "Save" : "Edit Profile"}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={editMode ? editedProfile.name : profile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={editMode ? editedProfile.email : profile.email}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={editMode ? editedProfile.phone : profile.phone || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Website"
                    value={
                      editMode ? editedProfile.website : profile.website || ""
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        website: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={
                      editMode
                        ? editedProfile.description
                        : profile.description || ""
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        description: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    value={
                      editMode ? editedProfile.address : profile.address || ""
                    }
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        address: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="City"
                    value={editMode ? editedProfile.city : profile.city || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        city: e.target.value,
                      })
                    }
                    disabled={!editMode}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : profileExists === false || editMode ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {profileExists === false
                  ? "Create Company Profile"
                  : "Edit Profile"}
              </Typography>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name *"
                    value={editedProfile.name || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone *"
                    value={editedProfile.phone || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        phone: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Website"
                    value={editedProfile.website || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        website: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description *"
                    value={editedProfile.description || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        description: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Address *"
                    value={editedProfile.address || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        address: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="City *"
                    value={editedProfile.city || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        city: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Country *"
                    value={editedProfile.country || ""}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        country: e.target.value,
                      })
                    }
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={!editedProfile.name || !editedProfile.description}
                >
                  {profileExists === false ? "Create Profile" : "Save"}
                </Button>
                {profileExists !== false && (
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              {error ? (
                <>
                  <Typography variant="h6" color="error" gutterBottom>
                    Error loading profile
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      dispatch(checkCompanyProfileExists())
                        .unwrap()
                        .then((exists) => {
                          setProfileExists(exists);
                          if (exists) {
                            dispatch(getCompanyProfile());
                            dispatch(getCompanyEvents({}));
                          }
                        })
                        .catch(() => setProfileExists(false));
                    }}
                  >
                    Retry
                  </Button>
                </>
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Loading...
                </Typography>
              )}
            </Box>
          )}
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                My Events ({events.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Event
              </Button>
            </Box>
            {error && (
              <Box
                sx={{ mb: 2, p: 2, bgcolor: "error.light", borderRadius: 1 }}
              >
                <Typography color="error">Error: {error}</Typography>
              </Box>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" py={2}>
                          No events yet. Click "Create Event" to add one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>
                          <Chip label={event.category} size="small" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            color={
                              getEventStatusColor(event.status) as
                                | "success"
                                | "warning"
                                | "error"
                                | "default"
                                | "info"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Paper>

      {/* Create Event Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newEvent.Title || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, Title: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            select
            fullWidth
            label="Category"
            value={newEvent.Category}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                Category: e.target.value as EventCategory,
              })
            }
            sx={{ mb: 2 }}
          >
            {[
              "Music",
              "Sports",
              "Conference",
              "Exhibition",
              "Festival",
              "Workshop",
              "Theater",
              "Comedy",
              "Food",
              "Technology",
              "Art",
              "Other",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Location"
            value={newEvent.Location || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, Location: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Exact Address"
            value={newEvent.ExactAddress || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, ExactAddress: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Event Date"
            InputLabelProps={{ shrink: true }}
            value={newEvent.EventDate || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, EventDate: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={newEvent.EndDate || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, EndDate: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Price"
            value={newEvent.Price || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, Price: Number(e.target.value) })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Max Participants"
            value={newEvent.MaxParticipants || ""}
            onChange={(e) =>
              setNewEvent({
                ...newEvent,
                MaxParticipants: Number(e.target.value),
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description *"
            value={newEvent.Description || ""}
            onChange={(e) =>
              setNewEvent({ ...newEvent, Description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateEvent} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyPage;
