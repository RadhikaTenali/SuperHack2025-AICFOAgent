import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Avatar,
  Chip
} from '@mui/material';
import {
  Nature,
  TrendingDown,
  CheckCircle,
  Warning,
  Speed
} from '@mui/icons-material';
import axios from 'axios';

const SustainabilityInsights = () => {
  const [overview, setOverview] = useState({
    portfolio_footprint: {
      net_emissions: 1200,
      total_carbon_credits: 150
    },
    portfolio_score: 75,
    environmental_impact: {
      impact_level: "Medium",
      trees_to_offset: 55,
      car_miles_equivalent: 3000
    },
    sustainability_trends: {
      emission_trend: "decreasing",
      trend_percentage: -8.5,
      green_initiative_adoption: 73,
      industry_ranking: "Top 25%"
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/sustainability/overview');
      if (response.data && response.data.portfolio_footprint) {
        setOverview(response.data);
      }
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
      // Keep the mock data we initialized with
    } finally {
      setLoading(false);
    }
  };

  const formatCO2 = (kg) => {
    const value = Number(kg) || 0;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}t`;
    return `${value.toFixed(1)}kg`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: 'green.main' }}>
                <Nature />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  🌱 Sustainability Insights
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Environmental impact tracking and carbon footprint analysis
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Portfolio Overview */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio Carbon Footprint
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="error.main">
                    {formatCO2(overview.portfolio_footprint.net_emissions)}
                  </Typography>
                  <Typography variant="caption">CO2e/month</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="success.main">
                    {overview.portfolio_footprint.total_carbon_credits}
                  </Typography>
                  <Typography variant="caption">Carbon Credits</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="primary.main">
                    {overview.portfolio_score}
                  </Typography>
                  <Typography variant="caption">Sustainability Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="warning.main">
                    {overview.environmental_impact.trees_to_offset}
                  </Typography>
                  <Typography variant="caption">Trees Needed</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Alert 
                severity={
                  overview.environmental_impact.impact_level === 'High' ? 'error' : 
                  overview.environmental_impact.impact_level === 'Medium' ? 'warning' : 'info'
                }
                icon={overview.environmental_impact.impact_level === 'Low' ? <CheckCircle /> : <Warning />}
              >
                <strong>Environmental Impact: {overview.environmental_impact.impact_level}</strong>
                <br />
                Equivalent to {overview.environmental_impact.car_miles_equivalent.toLocaleString()} miles 
                driven by an average car
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Trends */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sustainability Trends
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingDown color="success" />
              <Typography variant="body1" color="success.main">
                Emissions {overview.sustainability_trends.emission_trend}
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              {overview.sustainability_trends.trend_percentage}%
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Reduction vs last quarter
            </Typography>

            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Green Initiative Adoption
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={overview.sustainability_trends.green_initiative_adoption}
                color="success"
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary">
                {overview.sustainability_trends.green_initiative_adoption}% of clients
              </Typography>
            </Box>

            <Chip 
              icon={<Speed />}
              label={`Industry Ranking: ${overview.sustainability_trends.industry_ranking}`}
              color="success"
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Green Initiatives */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recommended Green Initiatives
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Solar Panel Installation
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Energy Category
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip label="-300kg CO2" color="success" size="small" />
                      <Chip label="$15,000" color="primary" size="small" />
                      <Chip label="36mo ROI" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Server Virtualization
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Infrastructure Category
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip label="-120kg CO2" color="success" size="small" />
                      <Chip label="$5,000" color="primary" size="small" />
                      <Chip label="18mo ROI" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      LED Lighting Upgrade
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Energy Category
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip label="-80kg CO2" color="success" size="small" />
                      <Chip label="$2,000" color="primary" size="small" />
                      <Chip label="12mo ROI" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Paperless Operations
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Operations Category
                    </Typography>
                    <Box display="flex" gap={1} mb={2}>
                      <Chip label="-50kg CO2" color="success" size="small" />
                      <Chip label="$1,000" color="primary" size="small" />
                      <Chip label="6mo ROI" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Demo Message */}
      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>🌱 Sustainability Demo:</strong> This module tracks your MSP's environmental impact, 
            carbon footprint, and green initiatives. The data shown is simulated for demonstration purposes.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
};

export default SustainabilityInsights;
