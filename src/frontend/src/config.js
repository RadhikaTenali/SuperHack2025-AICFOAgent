// API Configuration
const config = {
  // API Base URL - defaults to localhost for development
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  
  // WebSocket URL for real-time updates
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  
  // Application settings
  APP_NAME: 'AI CFO Agent',
  VERSION: '2.0.0',
  
  // Feature flags
  FEATURES: {
    SUSTAINABILITY_INSIGHTS: true,
    PERFORMANCE_SCOREBOARD: true,
    REAL_TIME_UPDATES: true,
    EMAIL_INTEGRATION: true,
    AUTONOMOUS_ACTIONS: true
  }
};

export default config;
