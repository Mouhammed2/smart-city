import React, { useState, Suspense } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Route as RouteIcon,
  Place as StopIcon,
  DirectionsBus as BusIcon,
} from '@mui/icons-material';

// Lazy load admin components
const RouteManager = React.lazy(() => import('../components/Admin/RouteManager'));
const StopManager = React.lazy(() => import('../components/Admin/StopManager'));
const BusManager = React.lazy(() => import('../components/Admin/BusManager'));

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Fade in={value === index} timeout={300}>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`admin-tabpanel-${index}`}
        aria-labelledby={`admin-tab-${index}`}
        style={{ display: value === index ? 'block' : 'none' }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </div>
    </Fade>
  );
};

interface TabConfig {
  label: string;
  icon: React.ReactElement;
  component: React.ReactNode;
}

const AdminPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const tabs: TabConfig[] = [
    { 
      label: 'Routes', 
      icon: <RouteIcon />, 
      component: <RouteManager /> 
    },
    { 
      label: 'Stops', 
      icon: <StopIcon />, 
      component: <StopManager /> 
    },
    { 
      label: 'Buses', 
      icon: <BusIcon />, 
      component: <BusManager /> 
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        p: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Paper 
        elevation={2}
        sx={{ 
          mb: 3,
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              id={`admin-tab-${index}`}
              aria-controls={`admin-tabpanel-${index}`}
              sx={{
                minHeight: 56,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {tabs.map((tab, index) => (
        <TabPanel key={tab.label} value={tabValue} index={index}>
          <Suspense fallback={
            <Box sx={{ 
              height: 400, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: theme.palette.text.secondary
            }}>
              Loading {tab.label.toLowerCase()}...
            </Box>
          }>
            {tab.component}
          </Suspense>
        </TabPanel>
      ))}
    </Box>
  );
};

export default AdminPage;
