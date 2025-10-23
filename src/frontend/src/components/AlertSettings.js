import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const AlertSettings = () => {
  const [alerts, setAlerts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [testResult, setTestResult] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    alert_type: '',
    condition: '',
    threshold_value: '',
    comparison_operator: 'greater_than',
    notification_channels: [],
    is_active: true,
    priority: 'medium',
    frequency: 'immediate',
    escalation_enabled: false,
    escalation_delay_minutes: '30',
    recipients: [],
    custom_message: ''
  });

  const alertTypes = [
    { value: 'financial', label: 'Financial Alert', icon: <ErrorIcon />, color: 'error' },
    { value: 'performance', label: 'Performance Alert', icon: <WarningIcon />, color: 'warning' },
    { value: 'security', label: 'Security Alert', icon: <ErrorIcon />, color: 'error' },
    { value: 'license', label: 'License Alert', icon: <InfoIcon />, color: 'info' },
    { value: 'client', label: 'Client Alert', icon: <CheckCircleIcon />, color: 'success' },
    { value: 'system', label: 'System Alert', icon: <WarningIcon />, color: 'warning' }
  ];

  const conditions = [
    { value: 'revenue_below', label: 'Revenue Below Threshold' },
    { value: 'margin_below', label: 'Margin Below Threshold' },
    { value: 'cost_above', label: 'Cost Above Threshold' },
    { value: 'client_churn_risk', label: 'Client Churn Risk' },
    { value: 'license_utilization_low', label: 'License Utilization Low' },
    { value: 'support_tickets_high', label: 'Support Tickets High' },
    { value: 'security_incidents', label: 'Security Incidents Detected' },
    { value: 'budget_exceeded', label: 'Budget Exceeded' },
    { value: 'contract_expiring', label: 'Contract Expiring Soon' },
    { value: 'payment_overdue', label: 'Payment Overdue' }
  ];

  const comparisonOperators = [
    { value: 'greater_than', label: 'Greater Than (>)' },
    { value: 'less_than', label: 'Less Than (<)' },
    { value: 'equal_to', label: 'Equal To (=)' },
    { value: 'greater_equal', label: 'Greater Than or Equal (>=)' },
    { value: 'less_equal', label: 'Less Than or Equal (<=)' },
    { value: 'not_equal', label: 'Not Equal (!=)' }
  ];

  const notificationChannels = [
    { value: 'email', label: 'Email' },
    { value: 'slack', label: 'Slack' },
    { value: 'teams', label: 'Microsoft Teams' },
    { value: 'sms', label: 'SMS' },
    { value: 'dashboard', label: 'Dashboard Notification' },
    { value: 'webhook', label: 'Webhook' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'critical', label: 'Critical', color: 'error' }
  ];

  const frequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const commonRecipients = [
    'admin@company.com',
    'finance@company.com',
    'operations@company.com',
    'management@company.com'
  ];

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/alerts/settings');
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      const errorMessage = error.response?.status === 404 ? 'Alert settings data not found' : 'Failed to fetch alert settings';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      notification_channels: prev.notification_channels.includes(channel)
        ? prev.notification_channels.filter(c => c !== channel)
        : [...prev.notification_channels, channel]
    }));
  };

  const handleRecipientAdd = (recipient) => {
    if (recipient && !formData.recipients.includes(recipient)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipient]
      }));
    }
  };

  const handleRecipientRemove = (recipient) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== recipient)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const alertData = {
        ...formData,
        threshold_value: parseFloat(formData.threshold_value) || 0,
        escalation_delay_minutes: parseInt(formData.escalation_delay_minutes) || 30
      };

      if (editingAlert) {
        await axios.put(`http://localhost:8000/alerts/settings/${editingAlert.id}`, alertData);
        setSnackbar({
          open: true,
          message: 'Alert updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('http://localhost:8000/alerts/settings', alertData);
        setSnackbar({
          open: true,
          message: 'Alert added successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      setEditingAlert(null);
      resetForm();
      fetchAlerts();
    } catch (error) {
      console.error('Error saving alert:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save alert',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name || '',
      description: alert.description || '',
      alert_type: alert.alert_type || '',
      condition: alert.condition || '',
      threshold_value: alert.threshold_value?.toString() || '',
      comparison_operator: alert.comparison_operator || 'greater_than',
      notification_channels: alert.notification_channels || [],
      is_active: alert.is_active !== false,
      priority: alert.priority || 'medium',
      frequency: alert.frequency || 'immediate',
      escalation_enabled: alert.escalation_enabled || false,
      escalation_delay_minutes: alert.escalation_delay_minutes?.toString() || '30',
      recipients: alert.recipients || [],
      custom_message: alert.custom_message || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`http://localhost:8000/alerts/settings/${alertId}`);
        setSnackbar({
          open: true,
          message: 'Alert deleted successfully',
          severity: 'success'
        });
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete alert',
          severity: 'error'
        });
      }
    }
  };

  const handleTestAlert = async (alertId) => {
    try {
      const response = await axios.post(`http://localhost:8000/alerts/test/${alertId}`);
      setTestResult(response.data);
      setSnackbar({
        open: true,
        message: 'Test alert sent successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error testing alert:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send test alert',
        severity: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      alert_type: '',
      condition: '',
      threshold_value: '',
      comparison_operator: 'greater_than',
      notification_channels: [],
      is_active: true,
      priority: 'medium',
      frequency: 'immediate',
      escalation_enabled: false,
      escalation_delay_minutes: '30',
      recipients: [],
      custom_message: ''
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAlert(null);
    resetForm();
  };

  const getAlertTypeIcon = (type) => {
    const alertType = alertTypes.find(t => t.value === type);
    return alertType?.icon || <InfoIcon />;
  };


  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Alert Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Alert
        </Button>
      </Box>

      {/* Test Result Alert */}
      {testResult && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setTestResult(null)}>
          Test alert sent successfully! Check your notification channels.
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Alert Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Threshold</TableCell>
                  <TableCell>Channels</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{alert.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alert.description?.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getAlertTypeIcon(alert.alert_type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {alert.alert_type?.replace('_', ' ').toUpperCase()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{alert.condition?.replace('_', ' ').toUpperCase()}</TableCell>
                    <TableCell>
                      {alert.comparison_operator?.replace('_', ' ')} {alert.threshold_value}
                    </TableCell>
                    <TableCell>
                      {alert.notification_channels?.slice(0, 2).map((channel, index) => (
                        <Chip key={index} label={channel} size="small" sx={{ mr: 0.5 }} />
                      ))}
                      {alert.notification_channels?.length > 2 && (
                        <Chip label={`+${alert.notification_channels.length - 2}`} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.priority?.toUpperCase()}
                        color={getPriorityColor(alert.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.is_active ? 'Active' : 'Inactive'}
                        color={alert.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(alert)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleTestAlert(alert.id)} size="small" color="info">
                        <NotificationsIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(alert.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Alert Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1 }} />
            {editingAlert ? 'Edit Alert' : 'Add New Alert'}
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>Basic Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alert Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Type</InputLabel>
                  <Select
                    value={formData.alert_type}
                    onChange={(e) => handleInputChange('alert_type', e.target.value)}
                  >
                    {alertTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {type.icon}
                          <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              {/* Alert Conditions */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Alert Conditions</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={formData.comparison_operator}
                    onChange={(e) => handleInputChange('comparison_operator', e.target.value)}
                  >
                    {comparisonOperators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Threshold Value"
                  type="number"
                  value={formData.threshold_value}
                  onChange={(e) => handleInputChange('threshold_value', e.target.value)}
                  required
                />
              </Grid>

              {/* Notification Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Notification Settings</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Notification Channels
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {notificationChannels.map((channel) => (
                    <Chip
                      key={channel.value}
                      label={channel.label}
                      onClick={() => handleChannelToggle(channel.value)}
                      color={formData.notification_channels.includes(channel.value) ? 'primary' : 'default'}
                      variant={formData.notification_channels.includes(channel.value) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                  >
                    {frequencies.map((freq) => (
                      <MenuItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Recipients */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Recipients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.recipients.map((recipient, index) => (
                    <Chip
                      key={index}
                      label={recipient}
                      onDelete={() => handleRecipientRemove(recipient)}
                      color="primary"
                    />
                  ))}
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Add Recipient</InputLabel>
                  <Select
                    value=""
                    onChange={(e) => handleRecipientAdd(e.target.value)}
                  >
                    {commonRecipients.map((recipient) => (
                      <MenuItem key={recipient} value={recipient}>
                        {recipient}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Advanced Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Advanced Settings</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                  }
                  label="Alert Active"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.escalation_enabled}
                      onChange={(e) => handleInputChange('escalation_enabled', e.target.checked)}
                    />
                  }
                  label="Enable Escalation"
                />
              </Grid>

              {formData.escalation_enabled && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Escalation Delay (Minutes)"
                    type="number"
                    value={formData.escalation_delay_minutes}
                    onChange={(e) => handleInputChange('escalation_delay_minutes', e.target.value)}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Message"
                  multiline
                  rows={3}
                  value={formData.custom_message}
                  onChange={(e) => handleInputChange('custom_message', e.target.value)}
                  helperText="Custom message to include in alerts (optional)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : editingAlert ? 'Update' : 'Add'} Alert
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlertSettings;

