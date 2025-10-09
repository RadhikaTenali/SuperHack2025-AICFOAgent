import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Badge
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  TrendingDown,
  Security,
  AttachMoney,
  Support,
  AutoFixHigh,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';

const AnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/anomalies/detect');
      setAnomalies(response.data.anomalies);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
      setError('Failed to fetch anomaly data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Error />;
      case 'medium': return <Warning />;
      case 'low': return <Info />;
      default: return <Info />;
    }
  };

  const getAnomalyIcon = (type) => {
    switch (type) {
      case 'low_margin': return <TrendingDown color="error" />;
      case 'high_support_load': return <Support color="warning" />;
      case 'license_waste': return <AttachMoney color="info" />;
      case 'security_risk': return <Security color="error" />;
      default: return <Warning />;
    }
  };

  const getAnomalyTypeLabel = (type) => {
    switch (type) {
      case 'low_margin': return 'Low Margin';
      case 'high_support_load': return 'High Support Load';
      case 'license_waste': return 'License Waste';
      case 'security_risk': return 'Security Risk';
      default: return 'Unknown';
    }
  };

  const handleResolveAnomaly = (anomaly) => {
    // In real implementation, this would trigger automated resolution or create a task
    alert(`Initiating resolution for: ${anomaly.description}`);
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

  const highSeverityAnomalies = anomalies.filter(a => a.severity === 'high');
  const mediumSeverityAnomalies = anomalies.filter(a => a.severity === 'medium');
  const lowSeverityAnomalies = anomalies.filter(a => a.severity === 'low');

  const anomaliesByType = anomalies.reduce((acc, anomaly) => {
    acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Badge badgeContent={highSeverityAnomalies.length} color="error">
                <Error color="error" />
              </Badge>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Critical Issues
              </Typography>
            </Box>
            <Typography variant="h3" color="error.main" gutterBottom>
              {highSeverityAnomalies.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Require immediate attention
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Badge badgeContent={mediumSeverityAnomalies.length} color="warning">
                <Warning color="warning" />
              </Badge>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Medium Priority
              </Typography>
            </Box>
            <Typography variant="h3" color="warning.main" gutterBottom>
              {mediumSeverityAnomalies.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Should be addressed soon
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Badge badgeContent={lowSeverityAnomalies.length} color="info">
                <Info color="info" />
              </Badge>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Low Priority
              </Typography>
            </Box>
            <Typography variant="h3" color="info.main" gutterBottom>
              {lowSeverityAnomalies.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Monitor and optimize
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Refresh color="primary" />
              <Typography variant="h6" sx={{ ml: 2 }}>
                Last Scan
              </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchAnomalies}
              disabled={loading}
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Anomaly Type Breakdown */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Anomaly Type Breakdown
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(anomaliesByType).map(([type, count]) => (
                <Grid item key={type}>
                  <Chip
                    icon={getAnomalyIcon(type)}
                    label={`${getAnomalyTypeLabel(type)}: ${count}`}
                    variant="outlined"
                    color={count > 2 ? 'error' : count > 1 ? 'warning' : 'default'}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Anomaly List */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Detected Anomalies ({anomalies.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AutoFixHigh />}
                onClick={() => alert('Bulk auto-resolution would be implemented here')}
                disabled={anomalies.length === 0}
              >
                Auto-Resolve All
              </Button>
            </Box>

            {anomalies.length === 0 ? (
              <Box textAlign="center" py={4}>
                <AutoFixHigh sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" color="success.main">
                  No Anomalies Detected!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  All systems are operating within normal parameters.
                </Typography>
              </Box>
            ) : (
              <List>
                {anomalies.map((anomaly, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {getAnomalyIcon(anomaly.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="body1" fontWeight="bold">
                              {anomaly.client_name}
                            </Typography>
                            <Chip
                              icon={getSeverityIcon(anomaly.severity)}
                              label={anomaly.severity.toUpperCase()}
                              color={getSeverityColor(anomaly.severity)}
                              size="small"
                            />
                            <Chip
                              label={getAnomalyTypeLabel(anomaly.type)}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              {anomaly.description}
                            </Typography>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                              <Box>
                                <Typography variant="body2" color="error.main" fontWeight="bold">
                                  Impact: {anomaly.impact}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  Recommendation: {anomaly.recommendation}
                                </Typography>
                              </Box>
                              <Button
                                size="small"
                                variant="contained"
                                color={anomaly.severity === 'high' ? 'error' : 'primary'}
                                startIcon={<AutoFixHigh />}
                                onClick={() => handleResolveAnomaly(anomaly)}
                              >
                                {anomaly.severity === 'high' ? 'Urgent Fix' : 'Resolve'}
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < anomalies.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* AI Insights */}
      <Grid item xs={12}>
        <Alert severity="info" icon={<AutoFixHigh />}>
          <Typography variant="body2">
            <strong>AI-Powered Detection:</strong> The AI CFO Agent continuously monitors your MSP operations 
            using machine learning algorithms to detect patterns and anomalies. Automated resolution capabilities 
            can address many issues without manual intervention, reducing operational overhead by up to 90%.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
};

export default AnomalyDetection;