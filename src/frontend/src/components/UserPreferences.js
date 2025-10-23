import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Slider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';

const UserPreferences = () => {
  const [preferences, setPreferences] = useState({
    // Dashboard Settings
    dashboard: {
      default_view: 'overview',
      refresh_interval: 30,
      show_quick_actions: true,
      show_recent_activities: true,
      show_performance_widgets: true,
      show_alerts_panel: true,
      compact_mode: false
    },
    // Theme Settings
    theme: {
      mode: 'light',
      primary_color: '#1976d2',
      secondary_color: '#dc004e',
      font_size: 'medium',
      density: 'comfortable'
    },
    // Notification Settings
    notifications: {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      desktop_notifications: true,
      sound_enabled: true,
      notification_frequency: 'immediate',
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00'
    },
    // Data Settings
    data: {
      auto_refresh: true,
      data_retention_days: 365,
      export_format: 'excel',
      chart_animation: true,
      show_tooltips: true,
      show_legends: true
    },
    // Security Settings
    security: {
      two_factor_auth: false,
      session_timeout: 30,
      password_change_required: false,
      login_notifications: true,
      api_access_enabled: true
    },
    // Language and Regional
    regional: {
      language: 'en',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY',
      currency: 'USD',
      number_format: 'US'
    }
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' }
  ];

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  const dateFormats = [
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MM-DD-YYYY'
  ];

  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CAD',
    'AUD',
    'CHF',
    'CNY'
  ];

  const numberFormats = [
    'US',
    'EU',
    'UK',
    'JP',
    'CN'
  ];

  const fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  const densities = [
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'spacious', label: 'Spacious' }
  ];

  const notificationFrequencies = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const exportFormats = [
    { value: 'excel', label: 'Excel (.xlsx)' },
    { value: 'csv', label: 'CSV' },
    { value: 'pdf', label: 'PDF' },
    { value: 'json', label: 'JSON' }
  ];

  const primaryColors = [
    '#1976d2', // Blue
    '#dc004e', // Pink
    '#9c27b0', // Purple
    '#673ab7', // Deep Purple
    '#3f51b5', // Indigo
    '#2196f3', // Light Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff9800', // Orange
    '#ff5722', // Deep Orange
    '#795548', // Brown
    '#607d8b', // Blue Grey
    '#9e9e9e'  // Grey
  ];

  const secondaryColors = [
    '#dc004e', // Pink
    '#1976d2', // Blue
    '#9c27b0', // Purple
    '#673ab7', // Deep Purple
    '#3f51b5', // Indigo
    '#2196f3', // Light Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff9800', // Orange
    '#ff5722', // Deep Orange
    '#795548', // Brown
    '#607d8b', // Blue Grey
    '#9e9e9e'  // Grey
  ];

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user/preferences');
      if (response.data.preferences) {
        setPreferences(response.data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      const errorMessage = error.response?.status === 404 ? 'User preferences data not found' : 'Failed to fetch preferences';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handlePreferenceChange = (section, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:8000/user/preferences', { preferences });
      setSnackbar({
        open: true,
        message: 'Preferences saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save preferences',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all preferences to default?')) {
      fetchPreferences();
      setSnackbar({
        open: true,
        message: 'Preferences reset to default',
        severity: 'info'
      });
    }
  };

  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon />, value: 0 },
    { label: 'Theme', icon: <PaletteIcon />, value: 1 },
    { label: 'Notifications', icon: <NotificationsIcon />, value: 2 },
    { label: 'Data', icon: <SettingsIcon />, value: 3 },
    { label: 'Security', icon: <SecurityIcon />, value: 4 },
    { label: 'Regional', icon: <LanguageIcon />, value: 5 }
  ];

  const renderDashboardSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Default View</InputLabel>
          <Select
            value={preferences.dashboard.default_view}
            onChange={(e) => handlePreferenceChange('dashboard', 'default_view', e.target.value)}
          >
            <MenuItem value="overview">Overview</MenuItem>
            <MenuItem value="profitability">Profitability</MenuItem>
            <MenuItem value="licenses">License Optimizer</MenuItem>
            <MenuItem value="upsells">Upsell Finder</MenuItem>
            <MenuItem value="scenarios">Scenario Simulation</MenuItem>
            <MenuItem value="anomalies">Anomaly Detection</MenuItem>
            <MenuItem value="reports">Weekly Reports</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography gutterBottom>Refresh Interval (seconds)</Typography>
        <Slider
          value={preferences.dashboard.refresh_interval}
          onChange={(e, value) => handlePreferenceChange('dashboard', 'refresh_interval', value)}
          min={10}
          max={300}
          step={10}
          marks={[
            { value: 10, label: '10s' },
            { value: 30, label: '30s' },
            { value: 60, label: '1m' },
            { value: 300, label: '5m' }
          ]}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Dashboard Components</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboard.show_quick_actions}
                  onChange={(e) => handlePreferenceChange('dashboard', 'show_quick_actions', e.target.checked)}
                />
              }
              label="Show Quick Actions"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboard.show_recent_activities}
                  onChange={(e) => handlePreferenceChange('dashboard', 'show_recent_activities', e.target.checked)}
                />
              }
              label="Show Recent Activities"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboard.show_performance_widgets}
                  onChange={(e) => handlePreferenceChange('dashboard', 'show_performance_widgets', e.target.checked)}
                />
              }
              label="Show Performance Widgets"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboard.show_alerts_panel}
                  onChange={(e) => handlePreferenceChange('dashboard', 'show_alerts_panel', e.target.checked)}
                />
              }
              label="Show Alerts Panel"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.dashboard.compact_mode}
                  onChange={(e) => handlePreferenceChange('dashboard', 'compact_mode', e.target.checked)}
                />
              }
              label="Compact Mode"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderThemeSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Theme Mode</InputLabel>
          <Select
            value={preferences.theme.mode}
            onChange={(e) => handlePreferenceChange('theme', 'mode', e.target.value)}
          >
            <MenuItem value="light">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LightModeIcon sx={{ mr: 1 }} />
                Light
              </Box>
            </MenuItem>
            <MenuItem value="dark">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <DarkModeIcon sx={{ mr: 1 }} />
                Dark
              </Box>
            </MenuItem>
            <MenuItem value="auto">Auto</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Font Size</InputLabel>
          <Select
            value={preferences.theme.font_size}
            onChange={(e) => handlePreferenceChange('theme', 'font_size', e.target.value)}
          >
            {fontSizes.map((size) => (
              <MenuItem key={size.value} value={size.value}>
                {size.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Density</InputLabel>
          <Select
            value={preferences.theme.density}
            onChange={(e) => handlePreferenceChange('theme', 'density', e.target.value)}
          >
            {densities.map((density) => (
              <MenuItem key={density.value} value={density.value}>
                {density.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Color Scheme</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Primary Color</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {primaryColors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: preferences.theme.primary_color === color ? '3px solid #000' : '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handlePreferenceChange('theme', 'primary_color', color)}
                >
                  {preferences.theme.primary_color === color && (
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Secondary Color</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {secondaryColors.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: preferences.theme.secondary_color === color ? '3px solid #000' : '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => handlePreferenceChange('theme', 'secondary_color', color)}
                >
                  {preferences.theme.secondary_color === color && (
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                  )}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Notification Channels</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.email_notifications}
                  onChange={(e) => handlePreferenceChange('notifications', 'email_notifications', e.target.checked)}
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.push_notifications}
                  onChange={(e) => handlePreferenceChange('notifications', 'push_notifications', e.target.checked)}
                />
              }
              label="Push Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.sms_notifications}
                  onChange={(e) => handlePreferenceChange('notifications', 'sms_notifications', e.target.checked)}
                />
              }
              label="SMS Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.desktop_notifications}
                  onChange={(e) => handlePreferenceChange('notifications', 'desktop_notifications', e.target.checked)}
                />
              }
              label="Desktop Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.notifications.sound_enabled}
                  onChange={(e) => handlePreferenceChange('notifications', 'sound_enabled', e.target.checked)}
                />
              }
              label="Sound Enabled"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Notification Frequency</InputLabel>
          <Select
            value={preferences.notifications.notification_frequency}
            onChange={(e) => handlePreferenceChange('notifications', 'notification_frequency', e.target.value)}
          >
            {notificationFrequencies.map((freq) => (
              <MenuItem key={freq.value} value={freq.value}>
                {freq.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.notifications.quiet_hours_enabled}
              onChange={(e) => handlePreferenceChange('notifications', 'quiet_hours_enabled', e.target.checked)}
            />
          }
          label="Enable Quiet Hours"
        />
      </Grid>
      {preferences.notifications.quiet_hours_enabled && (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quiet Hours Start"
              type="time"
              value={preferences.notifications.quiet_hours_start}
              onChange={(e) => handlePreferenceChange('notifications', 'quiet_hours_start', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quiet Hours End"
              type="time"
              value={preferences.notifications.quiet_hours_end}
              onChange={(e) => handlePreferenceChange('notifications', 'quiet_hours_end', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );

  const renderDataSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.data.auto_refresh}
              onChange={(e) => handlePreferenceChange('data', 'auto_refresh', e.target.checked)}
            />
          }
          label="Auto Refresh Data"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Data Retention (Days)"
          type="number"
          value={preferences.data.data_retention_days}
          onChange={(e) => handlePreferenceChange('data', 'data_retention_days', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Export Format</InputLabel>
          <Select
            value={preferences.data.export_format}
            onChange={(e) => handlePreferenceChange('data', 'export_format', e.target.value)}
          >
            {exportFormats.map((format) => (
              <MenuItem key={format.value} value={format.value}>
                {format.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>Display Options</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.data.chart_animation}
                  onChange={(e) => handlePreferenceChange('data', 'chart_animation', e.target.checked)}
                />
              }
              label="Chart Animation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.data.show_tooltips}
                  onChange={(e) => handlePreferenceChange('data', 'show_tooltips', e.target.checked)}
                />
              }
              label="Show Tooltips"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.data.show_legends}
                  onChange={(e) => handlePreferenceChange('data', 'show_legends', e.target.checked)}
                />
              }
              label="Show Legends"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.security.two_factor_auth}
              onChange={(e) => handlePreferenceChange('security', 'two_factor_auth', e.target.checked)}
            />
          }
          label="Two-Factor Authentication"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          type="number"
          value={preferences.security.session_timeout}
          onChange={(e) => handlePreferenceChange('security', 'session_timeout', parseInt(e.target.value))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.security.password_change_required}
              onChange={(e) => handlePreferenceChange('security', 'password_change_required', e.target.checked)}
            />
          }
          label="Require Password Change"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.security.login_notifications}
              onChange={(e) => handlePreferenceChange('security', 'login_notifications', e.target.checked)}
            />
          }
          label="Login Notifications"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.security.api_access_enabled}
              onChange={(e) => handlePreferenceChange('security', 'api_access_enabled', e.target.checked)}
            />
          }
          label="API Access Enabled"
        />
      </Grid>
    </Grid>
  );

  const renderRegionalSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={preferences.regional.language}
            onChange={(e) => handlePreferenceChange('regional', 'language', e.target.value)}
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={preferences.regional.timezone}
            onChange={(e) => handlePreferenceChange('regional', 'timezone', e.target.value)}
          >
            {timezones.map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Date Format</InputLabel>
          <Select
            value={preferences.regional.date_format}
            onChange={(e) => handlePreferenceChange('regional', 'date_format', e.target.value)}
          >
            {dateFormats.map((format) => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={preferences.regional.currency}
            onChange={(e) => handlePreferenceChange('regional', 'currency', e.target.value)}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Number Format</InputLabel>
          <Select
            value={preferences.regional.number_format}
            onChange={(e) => handlePreferenceChange('regional', 'number_format', e.target.value)}
          >
            {numberFormats.map((format) => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderDashboardSettings();
      case 1:
        return renderThemeSettings();
      case 2:
        return renderNotificationSettings();
      case 3:
        return renderDataSettings();
      case 4:
        return renderSecuritySettings();
      case 5:
        return renderRegionalSettings();
      default:
        return renderDashboardSettings();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Preferences
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            sx={{ mr: 2 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>
        <CardContent sx={{ p: 3 }}>
          {renderTabContent()}
        </CardContent>
      </Card>

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

export default UserPreferences;

