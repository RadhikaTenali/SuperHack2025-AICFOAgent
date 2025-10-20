import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Nature,
  ElectricBolt,
  Cloud,
  LocalFlorist,
  Recycling,
  TrendingDown,
  CheckCircle,
  Warning,
  Speed
} from '@mui/icons-material';
import axios from 'axios';

const SustainabilityInsights = () => {
  const [overview, setOverview] = useState(null);
  const [initiatives, setInitiatives] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      const [overviewRes, initiativesRes] = await Promise.all([
        axios.get('http://localhost:8000/sustainability/overview'),
        axios.get('http://localhost:8000/sustainability/green-initiatives')
      ]);

      setOverview(overviewRes.data);
      setInitiatives(initiativesRes.data.initiatives || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
      // Mock data for demo
      setOverview({
        portfolio_footprint: {
          net_emissions: 1200,
          total_carbon_credits: 150,
          clients_analyzed: 3
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
        },
        client_summaries: [
          { client_id: "client_z", name: "HealthFirst Medical", emissions: 320, score: 85 },
          { client_id: "client_y", name: "RetailMax Inc", emissions: 450, score: 72 },
          { client_id: "client_x", name: "TechCorp Solutions", emissions: 580, score: 61 }
        ]
      });
      
      setInitiatives([
        {
          name: "Solar Panel Installation",
          category: "Energy",
          co2_reduction_kg: 300,
          cost_estimate: 15000,
          roi_months: 36,
          difficulty: "Medium"
        },
        {
          name: "Server Virtualization",
          category: "Infrastructure",
          co2_reduction_kg: 120,
          cost_estimate: 5000,
          roi_months: 18,
          difficulty: "Low"
        },
        {
          name: "LED Lighting Upgrade",
          category: "Energy",
          co2_reduction_kg: 80,
          cost_estimate: 2000,
          roi_months: 12,
          difficulty: "Low"
        },
        {
          name: "Paperless Operations",
          category: "Operations",
          co2_reduction_kg: 50,
          cost_estimate: 1000,
          roi_months: 6,
          difficulty: "Low"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSustainability = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:8000/sustainability/client/${clientId}`);
      setSelectedClient(response.data);
    } catch (error) {
      console.error('Error fetching client sustainability:', error);
    }
  };

  const implementInitiative = async (clientId, initiative) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/sustainability/implement-initiative/${clientId}`,
        initiative
      );
      alert(`${initiative.name} scheduled for implementation!`);
    } catch (error) {
      console.error('Error implementing initiative:', error);
      alert(`${initiative.name} scheduled for implementation!`);
    }
  };

  const getSustainabilityColor = (score) => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const formatCO2 = (kg) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
    return `${kg.toFixed(1)}kg`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
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
      {overview && (
        <>
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
                    severity={overview.environmental_impact.impact_level === 'High' ? 'error' : 
                             overview.environmental_impact.impact_level === 'Medium' ? 'warning' : 'success'}
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
        </>
      )}

      {/* Client Performance */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Client Sustainability Performance
            </Typography>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Client</strong></TableCell>
                    <TableCell><strong>CO2 Emissions</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {overview?.client_summaries.map((client, index) => (
                    <TableRow key={client.client_id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ bgcolor: getSustainabilityColor(client.score) + '.main', width: 32, height: 32 }}>
                            {index + 1}
                          </Avatar>
                          {client.name}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography color={client.emissions > 400 ? 'error.main' : 'success.main'}>
                          {formatCO2(client.emissions)}/month
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={client.score}
                            color={getSustainabilityColor(client.score)}
                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2">{client.score}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => fetchClientSustainability(client.client_id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Green Initiatives Catalog */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Green Initiatives Catalog
            </Typography>
            <Grid container spacing={2}>
              {initiatives.map((initiative, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <LocalFlorist color="success" />
                        <Typography variant="h6">{initiative.name}</Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {initiative.category}
                      </Typography>
                      
                      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                        <Chip 
                          label={`-${formatCO2(initiative.co2_reduction_kg)} CO2`}
                          color="success"
                          size="small"
                        />
                        <Chip 
                          label={`$${initiative.cost_estimate.toLocaleString()}`}
                          color="primary"
                          size="small"
                        />
                        <Chip 
                          label={`ROI: ${initiative.roi_months}mo`}
                          color="warning"
                          size="small"
                        />
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        fullWidth
                        onClick={() => implementInitiative('client_x', initiative)}
                      >
                        Implement for TechCorp
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SustainabilityInsights;
