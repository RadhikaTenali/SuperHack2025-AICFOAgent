import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import PredictiveInsights from './PredictiveInsights';

const Dashboard = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          AI CFO Agent Dashboard
        </Typography>
        <PredictiveInsights clientId="X" />
      </Box>
    </Container>
  );
};

export default Dashboard;