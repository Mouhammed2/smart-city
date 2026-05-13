import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import {
  DirectionsBus as BusIcon,
  Place as StopIcon,
  Route as RouteIcon,
} from "@mui/icons-material";
import BusManager from "../../components/Admin/BusManager";
import RouteManager from "../../components/Admin/RouteManager";
import StopManager from "../../components/Admin/StopManager";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    sx={{
      flexGrow: 1,
      overflow: "auto",
      p: 2,
      display: value === index ? "block" : "none",
    }}
  >
    {children}
  </Box>
);

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper sx={{ borderRadius: 0, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ px: 3, pt: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
            Manage your BusWay system
          </Typography>
        </Box>
        <Tabs
          value={tab}
          onChange={(_: any, v: number) => setTab(v)}
          sx={{ px: 3 }}
        >
          <Tab icon={<BusIcon />} iconPosition="start" label="Buses" />
          <Tab icon={<RouteIcon />} iconPosition="start" label="Routes" />
          <Tab icon={<StopIcon />} iconPosition="start" label="Stops" />
        </Tabs>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TabPanel value={tab} index={0}>
          <BusManager />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <RouteManager />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <StopManager />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default AdminPage;
