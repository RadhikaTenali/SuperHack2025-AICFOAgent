import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow,
  Assessment,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';

const ScenarioSimulation = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [scenarioType, setScenarioType] = useState('');
  const [parameters, setParameters] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clients = [
    { id: 'client_x', name: 'TechCorp Solutions' },
    { id: 'client_y', name: 'RetailMax Inc' },
    { id: 'client_z', name: 'HealthFirst Medical' }
  ];

  const scenarioTypes = [
    { value: 'client_churn', label: 'Client Churn Impact' },
    { value: 'service_addition', label: 'New Service Addition' },
    { value: 'price_increase', label: 'Price Increase Impact' }
  ];

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const runSimulation = async () => {
    if (!selectedClient || !scenarioType) {
      setError('Please select a client and scenario type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/scenario/simulate', {
        scenario_type: scenarioType,
        client_id: selectedClient,
        parameters: parameters
      });
      
      setSimulationResult(response.data);
    } catch (error) {
      console.error('Error running simulation:', error);
      setError('Failed to run simulation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSimulation = () => {
    setSelectedClient('');
    setScenarioType('');
    setParameters({});
    setSimulationResult(null);
    setError(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderParameterInputs = () => {
    switch (scenarioType) {
      case 'client_churn':
        return (
          <TextField
            label="Months Ahead"
            type="number"
            value={parameters.months || 3}
            onChange={(e) => handleParameterChange('months', parseInt(e.target.value))}
            fullWidth
            helperText="How many months to project the impact"
          />
        );
      case 'service_addition':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Monthly Revenue"
                type="number"
                value={parameters.monthly_revenue || 1000}
                onChange={(e) => handleParameterChange('monthly_revenue', parseInt(e.target.value))}
                fullWidth
                helperText="Expected monthly revenue"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Monthly Cost"
                type="number"
                value={parameters.monthly_cost || 600}
                onChange={(e) => handleParameterChange('monthly_cost', parseInt(e.target.value))}
                fullWidth
                helperText="Expected monthly cost"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Projection Months"
                type="number"
                value={parameters.months || 12}
                onChange={(e) => handleParameterChange('months', parseInt(e.target.value))}
                fullWidth
                helperText="Projection period"
              />
            </Grid>
          </Grid>
        );
      case 'price_increase':
        return (
          <TextField
            label="Increase Percentage"
            type="number"
            value={parameters.percentage || 10}
            onChange={(e) => handleParameterChange('percentage', parseInt(e.target.value))}
            fullWidth
            helperText="Price increase percentage"
            InputProps={{
              endAdornment: '%'
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderSimulationResult = () => {
    if (!simulationResult) return null;

    const getImpactColor = (value) => {
      if (value > 0) return 'success';
      if (value < 0) return 'error';
      return 'info';
    };

    const getImpactIcon = (value) => {
      if (value > 0) return <TrendingUp />;
      if (value < 0) return <TrendingDown />;
      return <Assessment />;
    };

    return (
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Assessment color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              Simulation Results: {simulationResult.scenario}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {scenarioType === 'client_churn' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {formatCurrency(simulationResult.revenue_loss)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Revenue Loss ({simulationResult.timeframe_months} months)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(simulationResult.cost_savings)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cost Savings
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography 
                    variant="h4" 
                    color={getImpactColor(simulationResult.net_impact)}
                  >
                    {formatCurrency(Math.abs(simulationResult.net_impact))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Net Impact
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Alert 
                  severity={simulationResult.net_impact > 0 ? 'error' : 'success'}
                  icon={getImpactIcon(simulationResult.net_impact)}
                >
                  <Typography variant="body2">
                    <strong>Recommendation:</strong> {simulationResult.recommendation}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          )}

          {scenarioType === 'service_addition' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(simulationResult.new_service_revenue)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Additional Revenue
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {formatCurrency(simulationResult.new_service_cost)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Additional Costs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(simulationResult.annual_margin_improvement)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Margin Improvement
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {simulationResult.roi_percentage}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ROI
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {scenarioType === 'price_increase' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="primary.main">
                    {formatCurrency(simulationResult.new_monthly_revenue)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    New Monthly Revenue
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    (was {formatCurrency(simulationResult.current_monthly_revenue)})
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(simulationResult.annual_margin_improvement)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Annual Margin Improvement
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center">
                  <Chip
                    label={`${simulationResult.churn_risk.toUpperCase()} CHURN RISK`}
                    color={
                      simulationResult.churn_risk === 'low' ? 'success' :
                      simulationResult.churn_risk === 'medium' ? 'warning' : 'error'
                    }
                    icon={
                      simulationResult.churn_risk === 'low' ? <CheckCircle /> : <Warning />
                    }
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {simulationResult.increase_percentage}% increase
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
      {/* Simulation Setup */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Digital Twin Scenario Simulation
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Simulate what-if scenarios to make data-driven decisions
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Client</InputLabel>
                  <Select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    label="Select Client"
                  >
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Scenario Type</InputLabel>
                  <Select
                    value={scenarioType}
                    onChange={(e) => setScenarioType(e.target.value)}
                    label="Scenario Type"
                  >
                    {scenarioTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box display="flex" gap={1} height="100%" alignItems="center">
                  <Button
                    variant="contained"
                    startIcon={loading ? <LinearProgress /> : <PlayArrow />}
                    onClick={runSimulation}
                    disabled={loading || !selectedClient || !scenarioType}
                    fullWidth
                  >
                    {loading ? 'Running...' : 'Run Simulation'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetSimulation}
                    disabled={loading}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>

              {scenarioType && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Scenario Parameters:
                  </Typography>
                  {renderParameterInputs()}
                </Grid>
              )}
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Simulation Results */}
      {simulationResult && (
        <Grid item xs={12}>
          {renderSimulationResult()}
        </Grid>
      )}

      {/* Information Card */}
      <Grid item xs={12}>
        <Alert severity="info" icon={<Assessment />}>
          <Typography variant="body2">
            <strong>Digital Twin Technology:</strong> These simulations use AI-powered digital twin 
            modeling to predict financial impacts with high accuracy. The system considers historical 
            patterns, client behavior, and market conditions to provide reliable forecasts for strategic 
            decision-making.
          </Typography>
        </Alert>
      </Grid>
      </Grid>
    </Box>
  );
};

export default ScenarioSimulation;