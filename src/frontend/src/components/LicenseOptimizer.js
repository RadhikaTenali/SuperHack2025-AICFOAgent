import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  CloudQueue,
  Savings,
  TrendingDown,
  AutoFixHigh,
  Warning
} from '@mui/icons-material';
import axios from 'axios';

const LicenseOptimizer = () => {
  const [optimizations, setOptimizations] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingOptimization, setProcessingOptimization] = useState(null);

  useEffect(() => {
    fetchOptimizationData();
  }, []);

  const fetchOptimizationData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/licenses/optimization');
      setOptimizations(response.data.optimizations);
      setTotalSavings(response.data.total_annual_savings);
      setError(null);
    } catch (error) {
      console.error('Error fetching license optimization data:', error);
      setError('Failed to fetch license optimization data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUtilizationColor = (rate) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  const handleOptimize = async (optimization) => {
    setProcessingOptimization(optimization.client_id + optimization.license_type);
    
    // Simulate API call for optimization
    setTimeout(() => {
      setProcessingOptimization(null);
      // In real implementation, this would trigger the actual license optimization
      alert(`Optimization initiated for ${optimization.client_name} - ${optimization.license_type}`);
    }, 2000);
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

  const highImpactOptimizations = optimizations.filter(opt => opt.annual_savings >= 1000);
  const totalUnusedLicenses = optimizations.reduce((sum, opt) => sum + opt.unused_licenses, 0);

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Savings color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Annual Savings</Typography>
            </Box>
            <Typography variant="h3" color="success.main" gutterBottom>
              {formatCurrency(totalSavings)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatCurrency(totalSavings / 12)}/month potential savings
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingDown color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Unused Licenses</Typography>
            </Box>
            <Typography variant="h3" color="warning.main" gutterBottom>
              {totalUnusedLicenses}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Across {optimizations.length} license types
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AutoFixHigh color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">High Impact Optimizations</Typography>
            </Box>
            <Typography variant="h3" color="primary.main" gutterBottom>
              {highImpactOptimizations.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Savings ≥ $1,000/year each
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Optimization Opportunities Table */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                License Optimization Opportunities
              </Typography>
              <Button
                variant="contained"
                startIcon={<AutoFixHigh />}
                onClick={() => alert('Bulk optimization would be implemented here')}
              >
                Optimize All
              </Button>
            </Box>
            
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client & License Type</TableCell>
                    <TableCell align="center">Total Licenses</TableCell>
                    <TableCell align="center">Used</TableCell>
                    <TableCell align="center">Unused</TableCell>
                    <TableCell align="center">Utilization</TableCell>
                    <TableCell align="right">Monthly Savings</TableCell>
                    <TableCell align="right">Annual Savings</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optimizations.map((opt, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {opt.client_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {opt.license_type}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={opt.total_licenses}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={opt.used_licenses}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={opt.unused_licenses}
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <CircularProgress
                            variant="determinate"
                            value={opt.utilization_rate}
                            size={30}
                            color={getUtilizationColor(opt.utilization_rate)}
                          />
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            {opt.utilization_rate}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="success.main" fontWeight="bold">
                          {formatCurrency(opt.monthly_savings)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="success.main" fontWeight="bold">
                          {formatCurrency(opt.annual_savings)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color={opt.annual_savings >= 1000 ? 'error' : 'primary'}
                          startIcon={
                            processingOptimization === opt.client_id + opt.license_type ? 
                            <CircularProgress size={16} color="inherit" /> : 
                            <AutoFixHigh />
                          }
                          onClick={() => handleOptimize(opt)}
                          disabled={processingOptimization === opt.client_id + opt.license_type}
                        >
                          {processingOptimization === opt.client_id + opt.license_type ? 
                            'Processing...' : 
                            'Optimize'
                          }
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {optimizations.length === 0 && (
              <Box textAlign="center" py={4}>
                <CloudQueue sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  All licenses are optimally utilized!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  No optimization opportunities found at this time.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Optimization Tips */}
      <Grid item xs={12}>
        <Alert severity="info" icon={<AutoFixHigh />}>
          <Typography variant="body2">
            <strong>Nova ACT Integration:</strong> The AI CFO Agent can automatically track license usage 
            across vendor portals (Microsoft 365, Adobe, etc.) and execute optimizations autonomously. 
            Enable auto-optimization to reduce licenses by up to 30% without manual intervention.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
};

export default LicenseOptimizer;