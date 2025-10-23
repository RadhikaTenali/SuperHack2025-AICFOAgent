import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  Warning,
  People,
  AccountBalance
} from '@mui/icons-material';

const OverviewCards = ({ overview }) => {
  if (!overview) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMarginColor = (percentage) => {
    if (percentage < 0) return 'error';
    if (percentage < 20) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Grid container spacing={3}>
      {/* Revenue Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Monthly Revenue
              </Typography>
            </Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {formatCurrency(overview.total_monthly_revenue)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Across {overview.client_count} clients
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Margin Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Net Margin
              </Typography>
            </Box>
            <Typography variant="h4" color={getMarginColor(overview.margin_percentage)} gutterBottom>
              {formatCurrency(overview.total_margin)}
            </Typography>
            <Chip
              label={`${overview.margin_percentage}%`}
              color={getMarginColor(overview.margin_percentage)}
              size="small"
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Costs Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBalance color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Monthly Costs
              </Typography>
            </Box>
            <Typography variant="h4" gutterBottom>
              {formatCurrency(overview.total_monthly_costs)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Operational expenses
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Alerts Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Warning color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" color="textSecondary">
                Risk Alerts
              </Typography>
            </Box>
            <Typography variant="h4" color="error" gutterBottom>
              {overview.risk_alerts}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Clients need attention
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Unprofitable Clients */}
      {overview.unprofitable_clients.length > 0 && (
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Warning color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Unprofitable Clients
                </Typography>
              </Box>
              <List dense>
                {overview.unprofitable_clients.map((client) => (
                  <ListItem key={client.id}>
                    <ListItemIcon>
                      <People color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={client.name}
                      secondary={`Monthly loss: ${formatCurrency(Math.abs(client.margin))}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Key Metrics Summary */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Key Performance Indicators
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Revenue per Client</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(overview.total_monthly_revenue / overview.client_count)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Cost per Client</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(overview.total_monthly_costs / overview.client_count)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Annual Revenue Projection</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(overview.total_monthly_revenue * 12)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Annual Margin Projection</Typography>
                <Typography variant="body2" fontWeight="bold" color={getMarginColor(overview.margin_percentage)}>
                  {formatCurrency(overview.total_margin * 12)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewCards;