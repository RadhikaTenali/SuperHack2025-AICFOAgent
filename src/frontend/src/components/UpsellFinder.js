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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  AttachMoney,
  Security,
  CloudBackup,
  Assessment,
  TrendingUp,
  Send,
  Lightbulb
} from '@mui/icons-material';
import axios from 'axios';

const UpsellFinder = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [proposalDialog, setProposalDialog] = useState(false);
  const [proposalText, setProposalText] = useState('');

  useEffect(() => {
    fetchUpsellData();
  }, []);

  const fetchUpsellData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/upsell/opportunities');
      setOpportunities(response.data.opportunities);
      setError(null);
    } catch (error) {
      console.error('Error fetching upsell data:', error);
      setError('Failed to fetch upsell opportunities');
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

  const getServiceIcon = (service) => {
    if (service.toLowerCase().includes('security') || service.toLowerCase().includes('cybersecurity')) {
      return <Security color="error" />;
    }
    if (service.toLowerCase().includes('backup') || service.toLowerCase().includes('recovery')) {
      return <CloudBackup color="primary" />;
    }
    if (service.toLowerCase().includes('compliance') || service.toLowerCase().includes('hipaa')) {
      return <Assessment color="warning" />;
    }
    return <TrendingUp color="success" />;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'info';
  };

  const handleGenerateProposal = (opportunity, upsell) => {
    const proposal = `Dear ${opportunity.client_name} Team,

Based on our analysis of your recent IT activity, we've identified an opportunity to enhance your infrastructure with our ${upsell.service}.

Key Benefits:
• ${upsell.reason}
• Proactive monitoring and support
• Reduced downtime and security risks
• Compliance with industry standards

Investment: ${formatCurrency(upsell.monthly_value)}/month (${formatCurrency(upsell.annual_value)}/year)

This service will complement your existing ${formatCurrency(opportunity.current_monthly_revenue)}/month package and provide additional value to your organization.

We're confident this solution will address your current challenges and position your business for continued growth.

Best regards,
Your MSP Team`;

    setProposalText(proposal);
    setSelectedOpportunity({ ...opportunity, selectedUpsell: upsell });
    setProposalDialog(true);
  };

  const handleSendProposal = () => {
    // In real implementation, this would integrate with SuperOps to create a quote
    alert(`Proposal sent to ${selectedOpportunity.client_name} for ${selectedOpportunity.selectedUpsell.service}`);
    setProposalDialog(false);
    setProposalText('');
    setSelectedOpportunity(null);
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

  const totalPotentialRevenue = opportunities.reduce((sum, opp) => sum + opp.total_potential_annual, 0);
  const highConfidenceOpportunities = opportunities.reduce((count, opp) => 
    count + opp.upsell_opportunities.filter(u => u.confidence >= 80).length, 0
  );

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <AttachMoney color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Total Upsell Potential</Typography>
            </Box>
            <Typography variant="h3" color="success.main" gutterBottom>
              {formatCurrency(totalPotentialRevenue)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Annual revenue opportunity
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Lightbulb color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Active Opportunities</Typography>
            </Box>
            <Typography variant="h3" color="primary.main" gutterBottom>
              {opportunities.length}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Clients with upsell potential
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">High Confidence</Typography>
            </Box>
            <Typography variant="h3" color="success.main" gutterBottom>
              {highConfidenceOpportunities}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Opportunities with 80%+ confidence
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Upsell Opportunities */}
      {opportunities.map((opportunity) => (
        <Grid item xs={12} key={opportunity.client_id}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {opportunity.client_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current Monthly Revenue: {formatCurrency(opportunity.current_monthly_revenue)}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(opportunity.total_potential_annual)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Annual Potential
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Recommended Services:
              </Typography>

              <List>
                {opportunity.upsell_opportunities.map((upsell, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getServiceIcon(upsell.service)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1" fontWeight="bold">
                            {upsell.service}
                          </Typography>
                          <Chip
                            label={`${upsell.confidence}% confidence`}
                            color={getConfidenceColor(upsell.confidence)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {upsell.reason}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2">
                              <strong>Monthly:</strong> {formatCurrency(upsell.monthly_value)} | 
                              <strong> Annual:</strong> {formatCurrency(upsell.annual_value)}
                            </Typography>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<Send />}
                              onClick={() => handleGenerateProposal(opportunity, upsell)}
                            >
                              Generate Proposal
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {opportunities.length === 0 && (
        <Grid item xs={12}>
          <Box textAlign="center" py={4}>
            <Lightbulb sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              No upsell opportunities identified at this time
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The AI CFO Agent will continue monitoring client activity for new opportunities.
            </Typography>
          </Box>
        </Grid>
      )}

      {/* AI Insights */}
      <Grid item xs={12}>
        <Alert severity="info" icon={<Assessment />}>
          <Typography variant="body2">
            <strong>AI-Powered Analysis:</strong> These upsell opportunities are identified by analyzing 
            ticket patterns, security incidents, and service usage. The AI CFO Agent can automatically 
            generate proposals and integrate with SuperOps to create quotes for high-confidence opportunities.
          </Typography>
        </Alert>
      </Grid>

      {/* Proposal Dialog */}
      <Dialog
        open={proposalDialog}
        onClose={() => setProposalDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Generated Proposal - {selectedOpportunity?.selectedUpsell?.service}
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={15}
            fullWidth
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProposalDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSendProposal}
            variant="contained"
            startIcon={<Send />}
          >
            Send Proposal
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default UpsellFinder;