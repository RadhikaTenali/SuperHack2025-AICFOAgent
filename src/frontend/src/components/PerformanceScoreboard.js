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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  TrendingDown,
  Speed,
  Timeline
} from '@mui/icons-material';
import axios from 'axios';

const PerformanceScoreboard = () => {
  const [scoreboard, setScoreboard] = useState({
    portfolio_summary: {
      total_clients: 3,
      average_score: 72.5,
      rankings_distribution: { Platinum: 1, Gold: 1, Silver: 1, Bronze: 0 },
      portfolio_health: "Good",
      top_performer: "HealthFirst Medical"
    },
    performance_trends: {
      overall_trend: "improving",
      trend_percentage: 8.5,
      key_improvements: ["Customer satisfaction up 12%", "Resolution time down 15%"],
      areas_of_concern: ["Security incidents increased", "License utilization plateaued"]
    },
    scoreboard: [
      { 
        client_id: "client_z",
        name: "HealthFirst Medical", 
        overall_score: 85, 
        ranking: "Platinum", 
        position: 1,
        key_strengths: ["Customer Satisfaction", "Security"],
        trend: "improving"
      },
      { 
        client_id: "client_y",
        name: "RetailMax Inc", 
        overall_score: 72, 
        ranking: "Gold", 
        position: 2,
        key_strengths: ["Efficiency"],
        trend: "stable"
      },
      { 
        client_id: "client_x",
        name: "TechCorp Solutions", 
        overall_score: 61, 
        ranking: "Silver", 
        position: 3,
        key_strengths: ["Operational"],
        trend: "declining"
      }
    ],
    recommendations: [
      "Focus on improving bottom 40% of clients through targeted service optimization",
      "Leverage best practices from HealthFirst Medical across other clients",
      "Implement automated monitoring to improve resolution times"
    ]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScoreboardData();
  }, []);

  const fetchScoreboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/performance/scoreboard');
      if (response.data && response.data.portfolio_summary) {
        setScoreboard(response.data);
      }
    } catch (error) {
      console.error('Error fetching scoreboard data:', error);
      // Keep the mock data we initialized with
    } finally {
      setLoading(false);
    }
  };

  const getRankingColor = (ranking) => {
    switch (ranking) {
      case 'Platinum': return '#E5E4E2';
      case 'Gold': return '#FFD700';
      case 'Silver': return '#C0C0C0';
      case 'Bronze': return '#CD7F32';
      default: return '#gray';
    }
  };

  const getRankingIcon = (ranking) => {
    switch (ranking) {
      case 'Platinum': return '🏆';
      case 'Gold': return '🥇';
      case 'Silver': return '🥈';
      case 'Bronze': return '🥉';
      default: return '📊';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 65) return 'warning';
    if (score >= 50) return 'info';
    return 'error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <TrendingUp color="success" />;
      case 'declining': return <TrendingDown color="error" />;
      default: return <Timeline color="info" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <EmojiEvents />
              </Avatar>
              <Box>
                <Typography variant="h5">
                  🏆 Performance Scoreboard
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  MSP benchmark metrics and performance rankings
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Portfolio Summary */}
      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="primary.main">
                    {scoreboard.portfolio_summary.total_clients}
                  </Typography>
                  <Typography variant="caption">Total Clients</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="success.main">
                    {scoreboard.portfolio_summary.average_score}
                  </Typography>
                  <Typography variant="caption">Avg Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="warning.main">
                    {scoreboard.portfolio_summary.rankings_distribution.Platinum}
                  </Typography>
                  <Typography variant="caption">Platinum Clients</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center" p={2}>
                  <Typography variant="h4" color="info.main">
                    {scoreboard.portfolio_summary.rankings_distribution.Gold}
                  </Typography>
                  <Typography variant="caption">Gold Clients</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box mt={2}>
              <Alert 
                severity={
                  scoreboard.portfolio_summary.portfolio_health === 'Excellent' ? 'success' :
                  scoreboard.portfolio_summary.portfolio_health === 'Good' ? 'info' : 'warning'
                }
                icon={<Speed />}
              >
                <strong>Portfolio Health: {scoreboard.portfolio_summary.portfolio_health}</strong>
                <br />
                Top Performer: {scoreboard.portfolio_summary.top_performer}
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Trends */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Trends
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              {getTrendIcon(scoreboard.performance_trends.overall_trend)}
              <Typography variant="body1" color="success.main">
                Portfolio {scoreboard.performance_trends.overall_trend}
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main" gutterBottom>
              +{scoreboard.performance_trends.trend_percentage}%
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              vs previous quarter
            </Typography>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Key Improvements
            </Typography>
            {scoreboard.performance_trends.key_improvements.map((improvement, index) => (
              <Chip
                key={index}
                label={improvement}
                color="success"
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Areas of Concern
            </Typography>
            {scoreboard.performance_trends.areas_of_concern.map((concern, index) => (
              <Chip
                key={index}
                label={concern}
                color="warning"
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Rankings */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Client Performance Rankings
            </Typography>
            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Rank</strong></TableCell>
                    <TableCell><strong>Client</strong></TableCell>
                    <TableCell><strong>Score</strong></TableCell>
                    <TableCell><strong>Ranking</strong></TableCell>
                    <TableCell><strong>Strengths</strong></TableCell>
                    <TableCell><strong>Trend</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scoreboard.scoreboard.map((client) => (
                    <TableRow key={client.client_id}>
                      <TableCell>
                        <Avatar 
                          sx={{ 
                            bgcolor: getRankingColor(client.ranking),
                            color: 'black',
                            width: 32, 
                            height: 32,
                            fontWeight: 'bold'
                          }}
                        >
                          {client.position}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span style={{ fontSize: '1.2em' }}>
                            {getRankingIcon(client.ranking)}
                          </span>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {client.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {client.ranking} Tier
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={client.overall_score}
                            color={getScoreColor(client.overall_score)}
                            sx={{ width: 80, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="h6" color={getScoreColor(client.overall_score) + '.main'}>
                            {client.overall_score}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={client.ranking}
                          sx={{ 
                            bgcolor: getRankingColor(client.ranking),
                            color: 'black',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {client.key_strengths.slice(0, 2).map((strength, index) => (
                            <Chip
                              key={index}
                              label={strength}
                              color="success"
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getTrendIcon(client.trend)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Portfolio Recommendations */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Portfolio Recommendations
            </Typography>
            {scoreboard.recommendations.map((recommendation, index) => (
              <Alert key={index} severity="info" sx={{ mb: 1 }}>
                {recommendation}
              </Alert>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Demo Message */}
      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>🏆 Performance Demo:</strong> This module tracks MSP performance metrics, 
            client rankings, and industry benchmarks. The data shown is simulated for demonstration purposes.
          </Typography>
        </Alert>
      </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceScoreboard;
