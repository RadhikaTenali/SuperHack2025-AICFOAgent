import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Alert,
  Chip,
  Grid,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  AttachMoney,
  Assessment,
  Security,
  CloudQueue,
  Nature,         // For Sustainability
  EmojiEvents,    // For Performance
  Psychology      // For Scenario
} from '@mui/icons-material';
import axios from 'axios';

// Import all components
import OverviewCards from './OverviewCards';
import ProfitabilityDashboard from './ProfitabilityDashboard';
import LicenseOptimizer from './LicenseOptimizer';
import UpsellFinder from './UpsellFinder';
import ScenarioSimulation from './ScenarioSimulation';
import AnomalyDetection from './AnomalyDetection';
import WeeklyReport from './WeeklyReport';
import SustainabilityInsights from './SustainabilityInsights';  // NEW
import PerformanceScoreboard from './PerformanceScoreboard';    // NEW
import ClientManagement from './ClientManagement';              // NEW
import ServiceConfiguration from './ServiceConfiguration';      // NEW
import BudgetPlanning from './BudgetPlanning';                  // NEW
import AlertSettings from './AlertSettings';                    // NEW
import GoalSetting from './GoalSetting';                        // NEW
import UserPreferences from './UserPreferences';                // NEW

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const response = await axios.get('http://localhost:8000/dashboard/overview');
      setOverview(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching overview:', error);
      setError('Failed to fetch dashboard data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Updated tabs array with ALL 15 tabs
  const tabs = [
    { label: 'Overview', icon: <Assessment /> },
    { label: 'Profitability', icon: <TrendingUp /> },
    { label: 'License Optimizer', icon: <CloudQueue /> },
    { label: 'Upsell Finder', icon: <AttachMoney /> },
    { label: 'Scenario Simulation', icon: <Psychology /> },
    { label: 'Anomaly Detection', icon: <Warning /> },
    { label: 'Weekly Report', icon: <Assessment /> },
    { label: 'Sustainability', icon: <Nature /> },        // NEW
    { label: 'Performance', icon: <EmojiEvents /> },     // NEW
    { label: 'Client Management', icon: <Security /> },  // NEW
    { label: 'Service Config', icon: <CloudQueue /> },   // NEW
    { label: 'Budget Planning', icon: <AttachMoney /> }, // NEW
    { label: 'Alert Settings', icon: <Warning /> },      // NEW
    { label: 'Goal Setting', icon: <TrendingUp /> },     // NEW
    { label: 'Preferences', icon: <Security /> }         // NEW
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <OverviewCards overview={overview} />;
      case 1:
        return <ProfitabilityDashboard />;
      case 2:
        return <LicenseOptimizer />;
      case 3:
        return <UpsellFinder />;
      case 4:
        return <ScenarioSimulation />;
      case 5:
        return <AnomalyDetection />;
      case 6:
        return <WeeklyReport />;
      case 7:
        return <SustainabilityInsights />;    // NEW
      case 8:
        return <PerformanceScoreboard />;     // NEW
      case 9:
        return <ClientManagement />;          // NEW
      case 10:
        return <ServiceConfiguration />;      // NEW
      case 11:
        return <BudgetPlanning />;            // NEW
      case 12:
        return <AlertSettings />;             // NEW
      case 13:
        return <GoalSetting />;               // NEW
      case 14:
        return <UserPreferences />;           // NEW
      default:
        return <OverviewCards overview={overview} />;
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI CFO Agent - Autonomous CFO with Digital Twin
          </Typography>
          {overview && overview.risk_alerts > 0 && (
            <Chip
              icon={<Warning />}
              label={`${overview.risk_alerts} Risk Alerts`}
              color="warning"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Side Panel - Fixed Width */}
        <Box sx={{ 
          width: 280, 
          minWidth: 280,
          maxWidth: 280,
          borderRight: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'auto'
        }}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '8px 16px',
                fontSize: '0.875rem',
                minWidth: 'auto',
                width: '100%'
              },
              '& .MuiTabs-indicator': {
                left: 0,
                right: 'auto',
                width: 3
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{
                  minHeight: 48,
                  '& .MuiTab-iconWrapper': {
                    marginRight: 1,
                    fontSize: '1.1rem'
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          p: 3
        }}>
          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
