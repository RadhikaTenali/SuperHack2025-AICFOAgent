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
  Chip,
  LinearProgress,
  Alert,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

const ProfitabilityDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfitabilityData();
  }, []);

  const fetchProfitabilityData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/profitability/clients');
      setClients(response.data.clients);
      setError(null);
    } catch (error) {
      console.error('Error fetching profitability data:', error);
      setError('Failed to fetch profitability data');
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

  const getRiskChip = (riskLevel, margin) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };

    const icons = {
      high: <Warning />,
      medium: <TrendingDown />,
      low: <CheckCircle />
    };

    return (
      <Chip
        icon={icons[riskLevel]}
        label={riskLevel.toUpperCase()}
        color={colors[riskLevel]}
        size="small"
      />
    );
  };

  const getMarginIcon = (margin) => {
    return margin >= 0 ? (
      <TrendingUp color="success" />
    ) : (
      <TrendingDown color="error" />
    );
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

  const profitableClients = clients.filter(c => c.margin > 0);
  const unprofitableClients = clients.filter(c => c.margin <= 0);
  const totalRevenue = clients.reduce((sum, c) => sum + c.monthly_revenue, 0);
  const totalMargin = clients.reduce((sum, c) => sum + c.margin, 0);

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Profitable Clients</Typography>
            </Box>
            <Typography variant="h3" color="success.main" gutterBottom>
              {profitableClients.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {((profitableClients.length / clients.length) * 100).toFixed(1)}% of total clients
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Warning color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">At-Risk Clients</Typography>
            </Box>
            <Typography variant="h3" color="error.main" gutterBottom>
              {unprofitableClients.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Immediate attention required
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Margin</Typography>
            </Box>
            <Typography variant="h3" color={totalMargin >= 0 ? 'success.main' : 'error.main'} gutterBottom>
              {formatCurrency(totalMargin)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {((totalMargin / totalRevenue) * 100).toFixed(1)}% margin rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Client Profitability Table */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Client Profitability Analysis
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell align="right">Monthly Revenue</TableCell>
                    <TableCell align="right">Monthly Cost</TableCell>
                    <TableCell align="right">Margin</TableCell>
                    <TableCell align="right">Margin %</TableCell>
                    <TableCell align="center">Risk Level</TableCell>
                    <TableCell>Recommendation</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getMarginIcon(client.margin)}
                          <Box ml={1}>
                            <Typography variant="body2" fontWeight="bold">
                              {client.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Contract: {formatCurrency(client.contract_value)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(client.monthly_revenue)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(client.monthly_cost)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={client.margin >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {formatCurrency(client.margin)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={client.margin_percentage >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {client.margin_percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getRiskChip(client.risk_level, client.margin)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {client.recommendation}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant={client.risk_level === 'high' ? 'contained' : 'outlined'}
                          color={client.risk_level === 'high' ? 'error' : 'primary'}
                        >
                          {client.risk_level === 'high' ? 'Urgent' : 'Review'}
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
    </Grid>
  );
};

export default ProfitabilityDashboard;