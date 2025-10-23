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
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BudgetPlanning = () => {
  const [budgets, setBudgets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [budgetOverview, setBudgetOverview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    target_amount: '',
    current_amount: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    status: 'active',
    description: '',
    alert_threshold: '80',
    auto_adjust: false
  });

  const budgetCategories = [
    'Revenue',
    'Operating Expenses',
    'Software Licenses',
    'Marketing',
    'Equipment',
    'Training',
    'Emergency Fund',
    'Growth Investment',
    'Client Acquisition',
    'Technology Upgrade'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' }
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'paused', label: 'Paused', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'info' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' }
  ];

  useEffect(() => {
    fetchBudgets();
    fetchBudgetOverview();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/budgets');
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      const errorMessage = error.response?.status === 404 ? 'Budget data not found' : 'Failed to fetch budgets';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const fetchBudgetOverview = async () => {
    try {
      const response = await axios.get('http://localhost:8000/budgets/overview');
      setBudgetOverview(response.data);
    } catch (error) {
      console.error('Error fetching budget overview:', error);
      // Silently handle overview fetch errors as it's not critical
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount) || 0,
        current_amount: parseFloat(formData.current_amount) || 0,
        alert_threshold: parseFloat(formData.alert_threshold) || 80
      };

      if (editingBudget) {
        await axios.put(`http://localhost:8000/budgets/${editingBudget.id}`, budgetData);
        setSnackbar({
          open: true,
          message: 'Budget updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('http://localhost:8000/budgets', budgetData);
        setSnackbar({
          open: true,
          message: 'Budget added successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      setEditingBudget(null);
      resetForm();
      fetchBudgets();
      fetchBudgetOverview();
    } catch (error) {
      console.error('Error saving budget:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save budget',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      name: budget.name || '',
      category: budget.category || '',
      target_amount: budget.target_amount?.toString() || '',
      current_amount: budget.current_amount?.toString() || '',
      start_date: budget.start_date || '',
      end_date: budget.end_date || '',
      priority: budget.priority || 'medium',
      status: budget.status || 'active',
      description: budget.description || '',
      alert_threshold: budget.alert_threshold?.toString() || '80',
      auto_adjust: budget.auto_adjust || false
    });
    setOpenDialog(true);
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`http://localhost:8000/budgets/${budgetId}`);
        setSnackbar({
          open: true,
          message: 'Budget deleted successfully',
          severity: 'success'
        });
        fetchBudgets();
        fetchBudgetOverview();
      } catch (error) {
        console.error('Error deleting budget:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete budget',
          severity: 'error'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      target_amount: '',
      current_amount: '',
      start_date: '',
      end_date: '',
      priority: 'medium',
      status: 'active',
      description: '',
      alert_threshold: '80',
      auto_adjust: false
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBudget(null);
    resetForm();
  };

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'warning';
    return 'primary';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'default';
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'default';
  };

  // Chart data for budget visualization
  const chartData = {
    labels: budgets.map(b => b.name),
    datasets: [
      {
        label: 'Target Amount',
        data: budgets.map(b => b.target_amount),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Current Amount',
        data: budgets.map(b => b.current_amount),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Budget Progress Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Budget Planning
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Budget
        </Button>
      </Box>

      {/* Budget Overview Cards */}
      {budgetOverview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Budget
                    </Typography>
                    <Typography variant="h5">
                      ${budgetOverview.total_budget?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Spent
                    </Typography>
                    <Typography variant="h5">
                      ${budgetOverview.total_spent?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Remaining
                    </Typography>
                    <Typography variant="h5">
                      ${budgetOverview.remaining?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Over Budget
                    </Typography>
                    <Typography variant="h5">
                      {budgetOverview.over_budget_count || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Budget Chart */}
      {budgets.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Budget Progress Visualization
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Budget List */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Budget Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Current</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgets.map((budget) => {
                  const progress = getProgressPercentage(budget.current_amount, budget.target_amount);
                  return (
                    <TableRow key={budget.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{budget.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {budget.description?.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{budget.category}</TableCell>
                      <TableCell>${budget.target_amount?.toLocaleString() || 0}</TableCell>
                      <TableCell>${budget.current_amount?.toLocaleString() || 0}</TableCell>
                      <TableCell>
                        <Box sx={{ width: '100%', minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            color={getProgressColor(progress)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                            {progress.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={budget.priority?.toUpperCase()}
                          color={getPriorityColor(budget.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={budget.status?.toUpperCase()}
                          color={getStatusColor(budget.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(budget)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(budget.id)} size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBudget ? 'Edit Budget' : 'Add New Budget'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget Name"
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
                    {budgetCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Amount"
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => handleInputChange('target_amount', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Amount"
                  type="number"
                  value={formData.current_amount}
                  onChange={(e) => handleInputChange('current_amount', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
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
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alert Threshold (%)"
                  type="number"
                  value={formData.alert_threshold}
                  onChange={(e) => handleInputChange('alert_threshold', e.target.value)}
                  helperText="Alert when budget reaches this percentage"
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
              {loading ? 'Saving...' : editingBudget ? 'Update' : 'Add'} Budget
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

export default BudgetPlanning;

