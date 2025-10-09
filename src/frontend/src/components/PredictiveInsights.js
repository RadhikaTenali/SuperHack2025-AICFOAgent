import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, Alert } from '@mui/material';
import axios from 'axios';

const PredictiveInsights = ({ clientId }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/predictive-insights/${clientId}`);
        setInsights(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching predictive insights:", error);
        setError("Failed to fetch predictive insights. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchInsights();
    }
  }, [clientId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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

  if (!insights) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No insights available for this client.
      </Alert>
    );
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Predictive Insights for Client {clientId}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Current Margin:</strong> {insights.current_margin}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Cashflow Risk:</strong> {insights.cashflow_risk}
          </Typography>
          <Typography variant="body1">
            <strong>Recommendation:</strong> {insights.recommendation}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights;