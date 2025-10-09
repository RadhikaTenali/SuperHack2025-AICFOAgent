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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import {
  Assessment,
  GetApp,
  Email,
  TrendingUp,
  Warning,
  CheckCircle,
  AttachMoney,
  Schedule
} from '@mui/icons-material';
import axios from 'axios';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const fetchWeeklyReport = async () => {
    try {
      const response = await axios.get('http://localhost:8000/reports/weekly');
      setReport(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weekly report:', error);
      setError('Failed to fetch weekly report');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Warning />;
      case 'medium': return <Schedule />;
      case 'low': return <CheckCircle />;
      default: return <CheckCircle />;
    }
  };

  const handleDownloadReport = () => {
    // In real implementation, this would generate and download a PDF report
    const reportContent = `
AI CFO Agent - Weekly Financial Report
Generated: ${formatDate(report.report_date)}

EXECUTIVE SUMMARY
================
Total Monthly Revenue: ${formatCurrency(report.key_metrics.total_revenue)}
Total Margin: ${formatCurrency(report.key_metrics.total_margin)} (${report.key_metrics.margin_percentage}%)
At-Risk Clients: ${report.key_metrics.at_risk_clients}
Potential Annual Savings: ${formatCurrency(report.key_metrics.potential_savings)}
Upsell Potential: ${formatCurrency(report.key_metrics.upsell_potential)}

ACTION ITEMS
============
${report.action_items.map(item => `
${item.priority.toUpperCase()}: ${item.action}
Client: ${item.client}
Impact: ${item.impact}
`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-CFO-Weekly-Report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailReport = () => {
    // In real implementation, this would send the report via email
    alert('Weekly report would be sent to configured recipients');
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
      {/* Report Header */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  Weekly Financial Report
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Generated: {formatDate(report.report_date)}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                  onClick={handleDownloadReport}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Email />}
                  onClick={handleEmailReport}
                >
                  Email Report
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Key Metrics */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Executive Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={2.4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <AttachMoney color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" color="primary.main">
                    {formatCurrency(report.key_metrics.total_revenue)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monthly Revenue
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(report.key_metrics.total_margin)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Net Margin ({report.key_metrics.margin_percentage}%)
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Warning color="error" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" color="error.main">
                    {report.key_metrics.at_risk_clients}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    At-Risk Clients
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <Assessment color="info" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" color="info.main">
                    {formatCurrency(report.key_metrics.potential_savings)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Potential Savings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                  <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" color="success.main">
                    {formatCurrency(report.key_metrics.upsell_potential)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Upsell Potential
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Action Items */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Priority Action Items
            </Typography>
            <List>
              {report.action_items.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {getPriorityIcon(item.priority)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            {item.action}
                          </Typography>
                          <Chip
                            label={item.priority.toUpperCase()}
                            color={getPriorityColor(item.priority)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Client: {item.client}
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            Impact: {item.impact}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < report.action_items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2">Total Clients</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {report.overview.client_count}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2">Revenue per Client</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(report.key_metrics.total_revenue / report.overview.client_count)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2">Profitable Clients</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {report.overview.client_count - report.key_metrics.at_risk_clients}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2">Annual Revenue Projection</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(report.key_metrics.total_revenue * 12)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Report Frequency</Typography>
                <Chip label="Weekly" color="primary" size="small" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Insights and Recommendations */}
      <Grid item xs={12}>
        <Alert severity="success" icon={<Assessment />}>
          <Typography variant="body2">
            <strong>AI Insights:</strong> Based on this week's analysis, your MSP is performing well with a 
            {report.key_metrics.margin_percentage}% margin rate. Focus on the {report.key_metrics.at_risk_clients} at-risk 
            clients to prevent revenue loss, and pursue the ${formatCurrency(report.key_metrics.upsell_potential)} in 
            identified upsell opportunities to boost growth.
          </Typography>
        </Alert>
      </Grid>

      {/* Automation Notice */}
      <Grid item xs={12}>
        <Alert severity="info" icon={<Schedule />}>
          <Typography variant="body2">
            <strong>Automated Reporting:</strong> This report is automatically generated every week and can be 
            delivered to stakeholders via email or Slack. The AI CFO Agent continuously monitors your MSP's 
            financial health and provides actionable insights to drive growth and profitability.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
};

export default WeeklyReport;