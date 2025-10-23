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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import axios from 'axios';

const ServiceConfiguration = () => {
  const [services, setServices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    base_price: '',
    pricing_model: 'fixed',
    billing_frequency: 'monthly',
    is_active: true,
    features: [],
    requirements: [],
    sla_hours: '',
    setup_fee: '',
    minimum_contract_months: '',
    auto_renewal: true,
    tier: 'standard'
  });

  const serviceCategories = [
    'IT Support',
    'Cloud Services',
    'Security',
    'Backup & Recovery',
    'Network Management',
    'Compliance',
    'Monitoring',
    'Consulting',
    'Training',
    'Other'
  ];

  const pricingModels = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'per_user', label: 'Per User' },
    { value: 'per_device', label: 'Per Device' },
    { value: 'per_incident', label: 'Per Incident' },
    { value: 'tiered', label: 'Tiered Pricing' },
    { value: 'usage_based', label: 'Usage Based' }
  ];

  const billingFrequencies = [
    'monthly',
    'quarterly',
    'annually',
    'one_time'
  ];

  const serviceTiers = [
    'basic',
    'standard',
    'premium',
    'enterprise'
  ];

  const commonFeatures = [
    '24/7 Support',
    'Remote Monitoring',
    'Automated Backups',
    'Security Scanning',
    'Performance Monitoring',
    'Compliance Reporting',
    'Incident Response',
    'Preventive Maintenance',
    'Documentation',
    'Training Included'
  ];

  const commonRequirements = [
    'Minimum 10 Users',
    'Windows Environment',
    'Cloud Infrastructure',
    'Network Access',
    'Admin Credentials',
    'Compliance Certification',
    'Insurance Coverage',
    'Service Level Agreement'
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8000/services');
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      const errorMessage = error.response?.status === 404 ? 'Services data not found' : 'Failed to fetch services';
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleRequirementToggle = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        ...formData,
        base_price: parseFloat(formData.base_price) || 0,
        setup_fee: parseFloat(formData.setup_fee) || 0,
        sla_hours: parseInt(formData.sla_hours) || 24,
        minimum_contract_months: parseInt(formData.minimum_contract_months) || 1
      };

      if (editingService) {
        await axios.put(`http://localhost:8000/services/${editingService.id}`, serviceData);
        setSnackbar({
          open: true,
          message: 'Service updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('http://localhost:8000/services', serviceData);
        setSnackbar({
          open: true,
          message: 'Service added successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save service',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      category: service.category || '',
      base_price: service.base_price?.toString() || '',
      pricing_model: service.pricing_model || 'fixed',
      billing_frequency: service.billing_frequency || 'monthly',
      is_active: service.is_active !== false,
      features: service.features || [],
      requirements: service.requirements || [],
      sla_hours: service.sla_hours?.toString() || '24',
      setup_fee: service.setup_fee?.toString() || '',
      minimum_contract_months: service.minimum_contract_months?.toString() || '1',
      auto_renewal: service.auto_renewal !== false,
      tier: service.tier || 'standard'
    });
    setOpenDialog(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`http://localhost:8000/services/${serviceId}`);
        setSnackbar({
          open: true,
          message: 'Service deleted successfully',
          severity: 'success'
        });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete service',
          severity: 'error'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      base_price: '',
      pricing_model: 'fixed',
      billing_frequency: 'monthly',
      is_active: true,
      features: [],
      requirements: [],
      sla_hours: '24',
      setup_fee: '',
      minimum_contract_months: '1',
      auto_renewal: true,
      tier: 'standard'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    resetForm();
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'basic': return 'default';
      case 'standard': return 'primary';
      case 'premium': return 'secondary';
      case 'enterprise': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Service Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Service
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Pricing Model</TableCell>
                  <TableCell>Base Price</TableCell>
                  <TableCell>Billing</TableCell>
                  <TableCell>Tier</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{service.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {service.description?.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.pricing_model?.replace('_', ' ').toUpperCase()}</TableCell>
                    <TableCell>${service.base_price?.toLocaleString() || 0}</TableCell>
                    <TableCell>{service.billing_frequency?.toUpperCase()}</TableCell>
                    <TableCell>
                      <Chip
                        label={service.tier?.toUpperCase()}
                        color={getTierColor(service.tier)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={service.is_active ? 'Active' : 'Inactive'}
                        color={service.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(service)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(service.id)} size="small" color="error">
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

      {/* Add/Edit Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            {editingService ? 'Edit Service' : 'Add New Service'}
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
                  label="Service Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {serviceCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
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
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              {/* Pricing Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Pricing Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Base Price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => handleInputChange('base_price', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Pricing Model</InputLabel>
                  <Select
                    value={formData.pricing_model}
                    onChange={(e) => handleInputChange('pricing_model', e.target.value)}
                  >
                    {pricingModels.map((model) => (
                      <MenuItem key={model.value} value={model.value}>
                        {model.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Billing Frequency</InputLabel>
                  <Select
                    value={formData.billing_frequency}
                    onChange={(e) => handleInputChange('billing_frequency', e.target.value)}
                  >
                    {billingFrequencies.map((freq) => (
                      <MenuItem key={freq} value={freq}>
                        {freq.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Setup Fee"
                  type="number"
                  value={formData.setup_fee}
                  onChange={(e) => handleInputChange('setup_fee', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Contract (Months)"
                  type="number"
                  value={formData.minimum_contract_months}
                  onChange={(e) => handleInputChange('minimum_contract_months', e.target.value)}
                />
              </Grid>

              {/* Service Configuration */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Service Configuration</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Tier</InputLabel>
                  <Select
                    value={formData.tier}
                    onChange={(e) => handleInputChange('tier', e.target.value)}
                  >
                    {serviceTiers.map((tier) => (
                      <MenuItem key={tier} value={tier}>
                        {tier.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SLA Response Time (Hours)"
                  type="number"
                  value={formData.sla_hours}
                  onChange={(e) => handleInputChange('sla_hours', e.target.value)}
                />
              </Grid>

              {/* Features and Requirements */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Features & Requirements</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Service Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonFeatures.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      color={formData.features.includes(feature) ? 'primary' : 'default'}
                      variant={formData.features.includes(feature) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Client Requirements
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonRequirements.map((requirement) => (
                    <Chip
                      key={requirement}
                      label={requirement}
                      onClick={() => handleRequirementToggle(requirement)}
                      color={formData.requirements.includes(requirement) ? 'secondary' : 'default'}
                      variant={formData.requirements.includes(requirement) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Settings */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Settings</Typography>
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
                  label="Service Active"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.auto_renewal}
                      onChange={(e) => handleInputChange('auto_renewal', e.target.checked)}
                    />
                  }
                  label="Auto Renewal"
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
              {loading ? 'Saving...' : editingService ? 'Update' : 'Add'} Service
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

export default ServiceConfiguration;

