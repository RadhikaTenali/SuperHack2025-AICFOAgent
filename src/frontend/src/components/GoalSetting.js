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
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Flag as FlagIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GoalSetting = () => {
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [goalOverview, setGoalOverview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    target_value: '',
    current_value: '',
    start_date: '',
    target_date: '',
    priority: 'medium',
    status: 'active',
    measurement_unit: '',
    milestones: [],
    success_criteria: '',
    owner: '',
    dependencies: []
  });

  const goalCategories = [
    'Revenue',
    'Profit Margin',
    'Client Acquisition',
    'Client Retention',
    'Cost Reduction',
    'Efficiency',
    'Quality',
    'Growth',
    'Innovation',
    'Sustainability'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'critical', label: 'Critical', color: 'error' }
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: 'success' },
    { value: 'paused', label: 'Paused', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'info' },
    { value: 'cancelled', label: 'Cancelled', color: 'error' },
    { value: 'overdue', label: 'Overdue', color: 'error' }
  ];

  const measurementUnits = [
    'Dollars ($)',
    'Percentage (%)',
    'Count',
    'Hours',
    'Days',
    'Clients',
    'Tickets',
    'Licenses',
    'Projects',
    'Other'
  ];

  const commonMilestones = [
    'Initial Planning',
    'Resource Allocation',
    'First Quarter Review',
    'Mid-Point Assessment',
    'Final Review',
    'Implementation Complete',
    'Results Analysis'
  ];

  const commonDependencies = [
    'Budget Approval',
    'Team Availability',
    'Client Approval',
    'Technology Setup',
    'Training Completion',
    'Vendor Delivery',
    'Regulatory Approval'
  ];

  useEffect(() => {
    fetchGoals();
    fetchGoalOverview();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:8000/goals');
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      const errorMessage = error.response?.status === 404 ? 'Goals data not found' : 'Failed to fetch goals';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const fetchGoalOverview = async () => {
    try {
      const response = await axios.get('http://localhost:8000/goals/overview');
      setGoalOverview(response.data);
    } catch (error) {
      console.error('Error fetching goal overview:', error);
      // Silently handle overview fetch errors as it's not critical
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneToggle = (milestone) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.includes(milestone)
        ? prev.milestones.filter(m => m !== milestone)
        : [...prev.milestones, milestone]
    }));
  };

  const handleDependencyToggle = (dependency) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(dependency)
        ? prev.dependencies.filter(d => d !== dependency)
        : [...prev.dependencies, dependency]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const goalData = {
        ...formData,
        target_value: parseFloat(formData.target_value) || 0,
        current_value: parseFloat(formData.current_value) || 0
      };

      if (editingGoal) {
        await axios.put(`http://localhost:8000/goals/${editingGoal.id}`, goalData);
        setSnackbar({
          open: true,
          message: 'Goal updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('http://localhost:8000/goals', goalData);
        setSnackbar({
          open: true,
          message: 'Goal added successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
      fetchGoalOverview();
    } catch (error) {
      console.error('Error saving goal:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save goal',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name || '',
      description: goal.description || '',
      category: goal.category || '',
      target_value: goal.target_value?.toString() || '',
      current_value: goal.current_value?.toString() || '',
      start_date: goal.start_date || '',
      target_date: goal.target_date || '',
      priority: goal.priority || 'medium',
      status: goal.status || 'active',
      measurement_unit: goal.measurement_unit || '',
      milestones: goal.milestones || [],
      success_criteria: goal.success_criteria || '',
      owner: goal.owner || '',
      dependencies: goal.dependencies || []
    });
    setOpenDialog(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await axios.delete(`http://localhost:8000/goals/${goalId}`);
        setSnackbar({
          open: true,
          message: 'Goal deleted successfully',
          severity: 'success'
        });
        fetchGoals();
        fetchGoalOverview();
      } catch (error) {
        console.error('Error deleting goal:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete goal',
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
      target_value: '',
      current_value: '',
      start_date: '',
      target_date: '',
      priority: 'medium',
      status: 'active',
      measurement_unit: '',
      milestones: [],
      success_criteria: '',
      owner: '',
      dependencies: []
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
    resetForm();
  };

  const getProgressPercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'primary';
    if (percentage >= 25) return 'warning';
    return 'error';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'default';
  };

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'default';
  };

  const isOverdue = (targetDate) => {
    if (!targetDate) return false;
    return new Date(targetDate) < new Date();
  };

  // Chart data for goal visualization
  const chartData = {
    labels: goals.map(g => g.name),
    datasets: [
      {
        label: 'Target Value',
        data: goals.map(g => g.target_value),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Current Value',
        data: goals.map(g => g.current_value),
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
        text: 'Goal Progress Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart for goal status distribution
  const statusData = {
    labels: statuses.map(s => s.label),
    datasets: [
      {
        data: statuses.map(status => 
          goals.filter(g => g.status === status.value).length
        ),
        backgroundColor: [
          '#4caf50',
          '#ff9800',
          '#2196f3',
          '#f44336',
          '#9c27b0'
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Goal Setting
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New Goal
        </Button>
      </Box>

      {/* Goal Overview Cards */}
      {goalOverview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FlagIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Goals
                    </Typography>
                    <Typography variant="h5">
                      {goalOverview.total_goals || 0}
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
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Completed
                    </Typography>
                    <Typography variant="h5">
                      {goalOverview.completed_goals || 0}
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
                  <TrendingUpIcon color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      On Track
                    </Typography>
                    <Typography variant="h5">
                      {goalOverview.on_track_goals || 0}
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
                      At Risk
                    </Typography>
                    <Typography variant="h5">
                      {goalOverview.at_risk_goals || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Goal Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Goal Progress Overview
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line data={chartData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Goal Status Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <Doughnut data={statusData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goal List */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Goal Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell>Current</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goals.map((goal) => {
                  const progress = getProgressPercentage(goal.current_value, goal.target_value);
                  const overdue = isOverdue(goal.target_date);
                  return (
                    <TableRow key={goal.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{goal.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {goal.description?.substring(0, 50)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{goal.category}</TableCell>
                      <TableCell>
                        {goal.target_value} {goal.measurement_unit}
                      </TableCell>
                      <TableCell>
                        {goal.current_value} {goal.measurement_unit}
                      </TableCell>
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
                          label={goal.priority?.toUpperCase()}
                          color={getPriorityColor(goal.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={goal.status?.toUpperCase()}
                          color={getStatusColor(goal.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {overdue && <WarningIcon color="error" sx={{ mr: 1, fontSize: 16 }} />}
                          <Typography variant="body2">
                            {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(goal)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(goal.id)} size="small" color="error">
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

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FlagIcon sx={{ mr: 1 }} />
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
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
                  label="Goal Name"
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
                    {goalCategories.map((category) => (
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
                  rows={2}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              {/* Goal Values */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Goal Values</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Target Value"
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => handleInputChange('target_value', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Current Value"
                  type="number"
                  value={formData.current_value}
                  onChange={(e) => handleInputChange('current_value', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Measurement Unit</InputLabel>
                  <Select
                    value={formData.measurement_unit}
                    onChange={(e) => handleInputChange('measurement_unit', e.target.value)}
                  >
                    {measurementUnits.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Timeline */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Timeline</Typography>
                <Divider sx={{ mb: 2 }} />
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
                  label="Target Date"
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => handleInputChange('target_date', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Priority and Status */}
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

              {/* Milestones and Dependencies */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Milestones & Dependencies</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Milestones
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonMilestones.map((milestone) => (
                    <Chip
                      key={milestone}
                      label={milestone}
                      onClick={() => handleMilestoneToggle(milestone)}
                      color={formData.milestones.includes(milestone) ? 'primary' : 'default'}
                      variant={formData.milestones.includes(milestone) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Dependencies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {commonDependencies.map((dependency) => (
                    <Chip
                      key={dependency}
                      label={dependency}
                      onClick={() => handleDependencyToggle(dependency)}
                      color={formData.dependencies.includes(dependency) ? 'secondary' : 'default'}
                      variant={formData.dependencies.includes(dependency) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Additional Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Owner"
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Success Criteria"
                  multiline
                  rows={3}
                  value={formData.success_criteria}
                  onChange={(e) => handleInputChange('success_criteria', e.target.value)}
                  helperText="Define what constitutes success for this goal"
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
              {loading ? 'Saving...' : editingGoal ? 'Update' : 'Add'} Goal
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

export default GoalSetting;

