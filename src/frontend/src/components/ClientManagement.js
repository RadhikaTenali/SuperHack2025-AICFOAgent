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
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    monthly_revenue: '',
    monthly_cost: '',
    contract_value: '',
    services: [],
    industry: '',
    contract_start: '',
    contract_end: '',
    billing_cycle: 'monthly',
    payment_terms: 'net_30',
    status: 'active'
  });

  const serviceOptions = [
    'IT Support',
    'Cloud Management',
    'Network Management',
    'Backup Services',
    'Cybersecurity',
    'Compliance Management',
    'Help Desk',
    'Server Maintenance',
    'Software Licensing',
    'Security Monitoring'
  ];

  const industryOptions = [
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Education',
    'Government',
    'Technology',
    'Legal',
    'Real Estate',
    'Other'
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/profitability/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch clients',
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

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clientData = {
        ...formData,
        monthly_revenue: parseFloat(formData.monthly_revenue) || 0,
        monthly_cost: parseFloat(formData.monthly_cost) || 0,
        contract_value: parseFloat(formData.contract_value) || 0,
        margin: parseFloat(formData.monthly_revenue) - parseFloat(formData.monthly_cost)
      };

      if (editingClient) {
        // Update existing client
        await axios.put(`http://localhost:8000/clients/${editingClient.id}`, clientData);
        setSnackbar({
          open: true,
          message: 'Client updated successfully',
          severity: 'success'
        });
      } else {
        // Add new client
        await axios.post('http://localhost:8000/clients', clientData);
        setSnackbar({
          open: true,
          message: 'Client added successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save client',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      monthly_revenue: client.monthly_revenue?.toString() || '',
      monthly_cost: client.monthly_cost?.toString() || '',
      contract_value: client.contract_value?.toString() || '',
      services: client.services || [],
      industry: client.industry || '',
      contract_start: client.contract_start || '',
      contract_end: client.contract_end || '',
      billing_cycle: client.billing_cycle || 'monthly',
      payment_terms: client.payment_terms || 'net_30',
      status: client.status || 'active'
    });
    setOpenDialog(true);
  };

  const handleDelete = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`http://localhost:8000/clients/${clientId}`);
        setSnackbar({
          open: true,
          message: 'Client deleted successfully',
          severity: 'success'
        });
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete client',
          severity: 'error'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      monthly_revenue: '',
      monthly_cost: '',
      contract_value: '',
      services: [],
      industry: '',
      contract_start: '',
      contract_end: '',
      billing_cycle: 'monthly',
      payment_terms: 'net_30',
      status: 'active'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClient(null);
    resetForm();
  };

  const getMarginColor = (margin) => {
    if (margin < 0) return 'error';
    if (margin < 500) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Client Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Client
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Monthly Revenue</TableCell>
                  <TableCell>Monthly Cost</TableCell>
                  <TableCell>Margin</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.company || 'N/A'}</TableCell>
                    <TableCell>${client.monthly_revenue?.toLocaleString() || 0}</TableCell>
                    <TableCell>${client.monthly_cost?.toLocaleString() || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={`$${client.margin?.toLocaleString() || 0}`}
                        color={getMarginColor(client.margin)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {client.services?.slice(0, 2).map((service, index) => (
                        <Chip key={index} label={service} size="small" sx={{ mr: 0.5 }} />
                      ))}
                      {client.services?.length > 2 && (
                        <Chip label={`+${client.services.length - 2}`} size="small" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.status || 'Active'}
                        color={client.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(client)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(client.id)} size="small" color="error">
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

      {/* Add/Edit Client Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingClient ? 'Edit Client' : 'Add New Client'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monthly Revenue"
                  type="number"
                  value={formData.monthly_revenue}
                  onChange={(e) => handleInputChange('monthly_revenue', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Monthly Cost"
                  type="number"
                  value={formData.monthly_cost}
                  onChange={(e) => handleInputChange('monthly_cost', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contract Value"
                  type="number"
                  value={formData.contract_value}
                  onChange={(e) => handleInputChange('contract_value', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    {industryOptions.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {serviceOptions.map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      onClick={() => handleServiceToggle(service)}
                      color={formData.services.includes(service) ? 'primary' : 'default'}
                      variant={formData.services.includes(service) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract Start Date"
                  type="date"
                  value={formData.contract_start}
                  onChange={(e) => handleInputChange('contract_start', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract End Date"
                  type="date"
                  value={formData.contract_end}
                  onChange={(e) => handleInputChange('contract_end', e.target.value)}
                  InputLabelProps={{ shrink: true }}
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
              {loading ? 'Saving...' : editingClient ? 'Update' : 'Add'} Client
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

export default ClientManagement;

