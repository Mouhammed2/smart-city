import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getUserProfile,
  updateProfile,
  completeProfile,
  checkProfileExists,
  selectUserProfile,
  selectUserProfileLoading,
} from "../../store/slices/userProfileSlice";
import { UserPreferences } from "../../types";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectUserProfile);
  const loading = useAppSelector(selectUserProfileLoading);

  const [editMode, setEditMode] = useState(false);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    city: "",
    country: "",
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newsletter: true,
    eventReminders: true,
    newEventAlerts: true,
    favoriteEventUpdates: true,
    preferredCategories: [],
    preferredCities: [],
    language: "en",
    theme: "light",
    profileVisible: true,
    allowComments: true,
  });

  useEffect(() => {
    // Check if profile exists first
    dispatch(checkProfileExists())
      .unwrap()
      .then((exists) => {
        setProfileExists(exists);
        if (exists) {
          dispatch(getUserProfile());
        }
      })
      .catch(() => setProfileExists(false));
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
      });
      if (profile.preferences) {
        setPreferences(profile.preferences);
      }
    }
  }, [profile]);

  const handleSave = () => {
    if (profile) {
      // Update existing profile
      dispatch(updateProfile(editedProfile));
    } else {
      // Create new profile
      dispatch(
        completeProfile({
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          phone: editedProfile.phone,
          bio: editedProfile.bio,
          city: editedProfile.city,
          country: editedProfile.country,
        }),
      );
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
              }}
            >
              <PersonIcon sx={{ fontSize: 64 }} />
            </Avatar>
            {profile ? (
              <>
                <Typography variant="h6" fontWeight={600}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  @{profile.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.email}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={
                      profile.isProfileComplete ? "Complete" : "Incomplete"
                    }
                    color={profile.isProfileComplete ? "success" : "warning"}
                    size="small"
                  />
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" color="text.secondary">
                  No Profile Found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Create your profile to get started
                </Typography>
                <Button variant="contained" onClick={() => setEditMode(true)}>
                  Create Profile
                </Button>
              </>
            )}
          </Paper>

          {/* Preferences */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      pushNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.smsNotifications}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      smsNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="SMS Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.newsletter}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      newsletter: e.target.checked,
                    })
                  }
                />
              }
              label="Newsletter"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.eventReminders}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      eventReminders: e.target.checked,
                    })
                  }
                />
              }
              label="Event Reminders"
            />
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Profile Information
              </Typography>
              <Box>
                {editMode ? (
                  <>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={
                        !editedProfile.firstName || !editedProfile.lastName
                      }
                    >
                      {profile ? "Save" : "Create"}
                    </Button>
                  </>
                ) : profile ? (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </Button>
                ) : null}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={profile ? "First Name" : "First Name *"}
                  value={
                    editMode
                      ? editedProfile.firstName
                      : profile?.firstName || ""
                  }
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      firstName: e.target.value,
                    })
                  }
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label={profile ? "Last Name" : "Last Name *"}
                  value={
                    editMode ? editedProfile.lastName : profile?.lastName || ""
                  }
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      lastName: e.target.value,
                    })
                  }
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={editMode ? editedProfile.phone : profile?.phone || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={editMode ? editedProfile.city : profile?.city || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, city: e.target.value })
                  }
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={
                    editMode ? editedProfile.country : profile?.country || ""
                  }
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      country: e.target.value,
                    })
                  }
                  disabled={!editMode}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  value={editMode ? editedProfile.bio : profile?.bio || ""}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, bio: e.target.value })
                  }
                  disabled={!editMode}
                  placeholder="Tell us about yourself..."
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
