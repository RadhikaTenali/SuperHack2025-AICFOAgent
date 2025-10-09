import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Alert,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  AttachMoney,
  Assessment,
  Security,
  CloudQueue
} from '@mui/icons-material';
import axios from 'axios';
import OverviewCards from './OverviewCards';
import ProfitabilityDashboard from './ProfitabilityDashboard';
import LicenseOptimizer from './LicenseOptimizer';
import UpsellFinder from './UpsellFinder';
import ScenarioSimulation from './ScenarioSimulation';
import AnomalyDetection from './AnomalyDetection';
import WeeklyReport from './WeeklyReport';

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

  const tabs = [
    { label: 'Overview', icon: <Assessment /> },
    { label: 'Profitability', icon: <TrendingUp /> },
    { label: 'License Optimizer', icon: <CloudQueue /> },
    { label: 'Upsell Finder', icon: <AttachMoney /> },
    { label: 'Scenario Simulation', icon: <Assessment /> },
    { label: 'Anomaly Detection', icon: <Warning /> },
    { label: 'Weekly Report', icon: <Assessment /> }
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

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {renderTabContent()}
      </Container>
    </Box>
  );
};

export default Dashboard;