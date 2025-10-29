# 🎨 Frontend - AI CFO Agent

![React](https://img.shields.io/badge/React-19-blue)
![Material-UI](https://img.shields.io/badge/Material--UI-Latest-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

**Modern, responsive dashboard for AI-powered MSP financial management**

---

## 📊 Overview

The frontend is a comprehensive React-based dashboard that provides MSP operators with real-time financial insights, AI-powered recommendations, and interactive tools for financial decision-making.

**Key Stats**:
- **17 Components** (~3,500 lines)
- **23 Features** across 4 categories
- **Real-time Updates** via WebSocket
- **Responsive Design** with Material-UI
- **Production Build** included (`/build` directory)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm (comes with Node.js)

### Installation & Running

**First Time Setup**:
```bash
# Navigate to frontend directory
cd src/frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Subsequent Runs**:
```bash
npm start
```

The app will open automatically at: **http://localhost:3000**

> **Note**: Backend must be running at http://localhost:8000 for full functionality

---

## 📁 Project Structure

```
src/frontend/
├── public/                    # Static files
│   ├── index.html            # HTML template
│   ├── favicon.ico           # App icon
│   └── manifest.json         # PWA manifest
├── src/
│   ├── components/           # React components (17 total)
│   │   ├── Dashboard.js                    # Main dashboard layout
│   │   ├── OverviewCards.js                # KPI summary cards
│   │   ├── ProfitabilityDashboard.js      # Client profitability view
│   │   ├── LicenseOptimizer.js            # License optimization UI
│   │   ├── UpsellFinder.js                # Upsell opportunities
│   │   ├── AnomalyDetection.js            # Anomaly alerts
│   │   ├── ScenarioSimulation.js          # Digital twin simulations
│   │   ├── WeeklyReport.js                # Automated reports
│   │   ├── ClientManagement.js            # CRUD for clients
│   │   ├── ServiceConfiguration.js        # Service management
│   │   ├── BudgetPlanning.js              # Budget tracking
│   │   ├── AlertSettings.js               # Alert configuration
│   │   ├── GoalSetting.js                 # Goal tracking
│   │   ├── UserPreferences.js             # User settings
│   │   ├── SustainabilityInsights.js      # Carbon footprint
│   │   ├── PerformanceScoreboard.js       # Client rankings
│   │   └── PredictiveInsights.js          # Trend predictions
│   ├── App.js                # Main app component with routing
│   ├── App.css               # Global styles
│   ├── index.js              # App entry point
│   ├── index.css             # Base styles
│   ├── config.js             # API configuration
│   └── setupTests.js         # Test configuration
├── build/                    # Production build (ready to deploy)
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🎯 Components Overview

### Core Features (6 Components)

#### 1. **Dashboard.js** - Main Dashboard
**Purpose**: Central navigation and layout
- Tab-based navigation between all features
- Material-UI AppBar and Tabs
- Responsive layout
- Real-time status indicators

#### 2. **OverviewCards.js** - KPI Summary Cards
**Purpose**: High-level financial metrics at a glance
- Total monthly revenue
- Total profit margin
- At-risk clients count
- License optimization savings

#### 3. **ProfitabilityDashboard.js** - Client Profitability Analysis
**Purpose**: Real-time profitability tracking per client
**Features**:
- Client list with revenue, cost, margin
- Risk level indicators (High/Medium/Low)
- Color-coded profitability status
- Action buttons for at-risk clients
- Automated recommendations

**Demo Data**:
- TechCorp Solutions: -$500/month (UNPROFITABLE)
- RetailMax Inc: +$700/month
- HealthFirst Medical: +$1,800/month

#### 4. **LicenseOptimizer.js** - License Optimization
**Purpose**: Automated license waste detection and optimization
**Features**:
- Multi-vendor license tracking (6 vendors)
- Unused license identification
- Annual savings calculation
- One-click optimization
- "OPTIMIZE ALL" batch processing

**Vendors Supported**:
- Microsoft 365, Adobe Creative Cloud, Google Workspace
- Zoom, Slack, Atlassian

**Demo Results**: 32 unused licenses, $7,872/year savings

#### 5. **UpsellFinder.js** - Revenue Opportunities
**Purpose**: AI-powered upsell identification
**Features**:
- Ticket pattern analysis
- Security incident tracking
- Industry-specific recommendations
- Confidence scoring (70-95%)
- Automated proposal generation
- Email delivery integration

**Demo Opportunities**:
- RetailMax: $24K cybersecurity (85% confidence)
- HealthFirst: $14.4K HIPAA (90% confidence)
- TechCorp: $9.6K backup (70% confidence)

#### 6. **ScenarioSimulation.js** - Digital Twin
**Purpose**: What-if modeling for strategic decisions
**Scenario Types**:
1. **Client Churn** - Revenue loss vs. cost savings
2. **Service Addition** - ROI and margin improvement
3. **Price Increase** - Churn risk assessment

**Features**:
- Interactive parameter inputs
- Real-time calculations
- Visual results display
- Recommendation engine

---

### Dynamic Input Features (6 Components)

#### 7. **ClientManagement.js** - Client CRUD
**Features**:
- Create, read, update, delete clients
- Form fields: Name, email, revenue, cost, services
- Industry selection
- Contract management
- Inline editing
- Validation

#### 8. **ServiceConfiguration.js** - Service Management
**Features**:
- Service creation and editing
- Pricing model configuration
- SLA settings
- Feature assignment
- Tier management (Basic/Standard/Premium/Enterprise)

#### 9. **BudgetPlanning.js** - Budget Tracking
**Features**:
- Budget creation and monitoring
- Progress visualization with charts
- Alert thresholds (75%, 90%, 100%)
- Category management
- Overspending detection

#### 10. **AlertSettings.js** - Alert Configuration
**Features**:
- Multi-channel alerts (Email/Slack/Teams/SMS)
- Condition configuration
- Threshold settings
- Priority management
- Test alert functionality
- Escalation workflows

#### 11. **GoalSetting.js** - Goal Tracking
**Features**:
- Goal creation and monitoring
- Progress tracking
- Milestone management
- Deadline tracking
- Success criteria definition

#### 12. **UserPreferences.js** - User Settings
**Categories**:
- Dashboard preferences
- Theme & appearance (Light/Dark mode)
- Notification settings
- Data & privacy
- Regional settings (timezone, currency)
- Security settings

---

### Bonus Features (4 Components)

#### 13. **AnomalyDetection.js** - Issue Detection
**Purpose**: Real-time financial anomaly monitoring
**Detections**:
- Low margin clients (high severity)
- High support load (medium severity)
- License waste (medium severity)

**Features**: Auto-resolve, batch resolution

#### 14. **WeeklyReport.js** - Automated Reporting
**Purpose**: Weekly financial summaries
**Contents**:
- Executive summary with KPIs
- Key metrics and statistics
- Priority action items (4 items)
- Client breakdown

**Actions**: Download, Email delivery

#### 15. **SustainabilityInsights.js** - Carbon Tracking
**Purpose**: Environmental impact monitoring
**Features**:
- Carbon footprint calculation
- Green initiatives catalog
- Industry benchmarking
- Sustainability scoring

#### 16. **PerformanceScoreboard.js** - Client Rankings
**Purpose**: Multi-dimensional performance tracking
**Rankings**:
- 🥇 Platinum (90-100)
- 🥈 Gold (75-89)
- 🥉 Silver (60-74)
- Bronze (<60)

**Dimensions**: Financial, operational, satisfaction, security, license utilization

#### 17. **PredictiveInsights.js** - Trend Analysis
**Purpose**: Forward-looking analytics
**Features**:
- Revenue trend prediction
- Churn risk forecasting
- Cost projections
- Margin trend analysis

---

## 🔧 Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | ^19.0.0 | UI framework |
| **react-dom** | ^19.0.0 | DOM rendering |
| **@mui/material** | ^6.1.7 | Component library |
| **@mui/icons-material** | ^6.1.7 | Material icons |
| **@emotion/react** | ^11.14.0 | CSS-in-JS styling |
| **@emotion/styled** | ^11.14.0 | Styled components |
| **axios** | ^1.7.9 | HTTP client |
| **react-router-dom** | ^7.0.2 | Navigation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **@testing-library/react** | ^16.1.0 | Component testing |
| **@testing-library/jest-dom** | ^6.6.3 | Test assertions |
| **@testing-library/user-event** | ^14.5.2 | User interaction testing |
| **web-vitals** | ^4.2.4 | Performance monitoring |

---

## 📜 Available Scripts

### Development

```bash
npm start
```
- Runs the app in development mode
- Opens http://localhost:3000 in browser
- Hot reload enabled
- Error overlay for debugging

### Testing

```bash
npm test
```
- Launches test runner in interactive watch mode
- Runs all test suites
- Shows coverage report

### Production Build

```bash
npm run build
```
- Builds the app for production to `build/` folder
- Optimizes and minifies code
- Creates static files ready for deployment
- Includes source maps

**Build Output**:
- `build/index.html` - Entry HTML
- `build/static/js/` - JavaScript bundles
- `build/static/css/` - CSS files
- `build/asset-manifest.json` - Asset mapping

### Eject (⚠️ One-way operation)

```bash
npm run eject
```
- Ejects from Create React App
- Exposes webpack configuration
- **Warning**: Cannot be undone!

---

## 🌐 API Integration

### Backend Configuration

The frontend communicates with the backend API configured in `src/config.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000';
```

### API Endpoints Used

**Core Features**:
- `GET /dashboard/overview` - Dashboard summary
- `GET /profitability/clients` - Client profitability
- `GET /licenses/optimization` - License optimization
- `GET /upsell/opportunities` - Upsell opportunities
- `POST /scenario/simulate` - Digital twin simulations
- `GET /anomalies/detect` - Anomaly detection
- `GET /reports/weekly` - Weekly reports

**CRUD Operations**:
- `GET/POST/PUT/DELETE /clients` - Client management
- `GET/POST/PUT/DELETE /services` - Service management
- `GET/POST/PUT/DELETE /budgets` - Budget management
- `GET/POST/PUT/DELETE /alerts/settings` - Alert settings
- `GET/POST/PUT/DELETE /goals` - Goal management

**Actions**:
- `POST /api/send-weekly-report` - Email reports
- `POST /api/send-proposal` - Send upsell proposals
- `POST /api/execute-optimization` - Execute license optimization
- `POST /api/resolve-anomaly` - Resolve anomalies

---

## 🎨 Styling & Theming

### Material-UI Theme

The app uses Material-UI's default theme with customizations:
- **Primary Color**: Blue (#1976d2)
- **Secondary Color**: Green (#4caf50)
- **Error Color**: Red (#f44336)
- **Warning Color**: Orange (#ff9800)
- **Success Color**: Green (#4caf50)

### Responsive Design

Breakpoints:
- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 960px (laptop)
- **lg**: 1280px (desktop)
- **xl**: 1920px (large desktop)

All components are responsive and work on mobile, tablet, and desktop.

---

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Test Structure

Tests are located alongside components:
- `App.test.js` - Main app tests
- `setupTests.js` - Test configuration

### Writing Tests

Example test:
```javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/AI CFO Agent/i);
  expect(linkElement).toBeInTheDocument();
});
```

---

## 📦 Production Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deployment Options

#### 1. **AWS Amplify** (Recommended)
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Deploy
amplify publish
```

#### 2. **Static Hosting** (Netlify, Vercel, etc.)
- Upload `build/` folder contents
- Configure redirects for client-side routing

#### 3. **AWS S3 + CloudFront**
```bash
# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Configure CloudFront for SPA routing
```

#### 4. **Docker** (with nginx)
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `src/frontend/`:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Feature Flags
REACT_APP_ENABLE_WEBSOCKET=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# Analytics (optional)
REACT_APP_GA_TRACKING_ID=your-tracking-id
```

### Backend URL

Update in `src/config.js`:
```javascript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# App will prompt to use port 3001, accept it
# Or set custom port:
PORT=3001 npm start  # Linux/macOS
$env:PORT=3001; npm start  # PowerShell
```

#### npm install Fails
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### CORS Errors
- Ensure backend is running on http://localhost:8000
- Check backend CORS configuration allows http://localhost:3000
- Verify API_BASE_URL in `src/config.js`

#### Blank Page After Build
- Check browser console for errors
- Ensure all environment variables are set
- Verify backend API is accessible
- Check network tab for failed API calls

#### Components Not Updating
- Clear browser cache (Ctrl+Shift+R)
- Check backend is returning data
- Verify API endpoints in Network tab
- Check console for JavaScript errors

---

## 🎯 Features by Tab

| Tab | Component | Purpose |
|-----|-----------|---------|
| **Overview** | OverviewCards | KPI summary |
| **Profitability** | ProfitabilityDashboard | Client margins |
| **License Optimizer** | LicenseOptimizer | License waste |
| **Upsell Finder** | UpsellFinder | Revenue opportunities |
| **Scenarios** | ScenarioSimulation | Digital twin |
| **Anomalies** | AnomalyDetection | Issue detection |
| **Weekly Report** | WeeklyReport | Automated reports |
| **Clients** | ClientManagement | Client CRUD |
| **Services** | ServiceConfiguration | Service management |
| **Budgets** | BudgetPlanning | Budget tracking |
| **Alerts** | AlertSettings | Alert configuration |
| **Goals** | GoalSetting | Goal tracking |
| **Preferences** | UserPreferences | User settings |
| **Sustainability** | SustainabilityInsights | Carbon tracking |
| **Scoreboard** | PerformanceScoreboard | Client rankings |
| **Insights** | PredictiveInsights | Trend analysis |

---

## 📊 Performance

### Build Statistics

Production build (`npm run build`):
- **Main bundle**: ~45KB (gzipped)
- **Total size**: ~2MB (including Material-UI)
- **Load time**: <2s on 3G
- **First Contentful Paint**: <1.5s

### Optimization Tips

1. **Code Splitting**: Lazy load components
```javascript
const LazyComponent = React.lazy(() => import('./Component'));
```

2. **Memoization**: Use React.memo for expensive components
```javascript
export default React.memo(Component);
```

3. **Image Optimization**: Use WebP format
4. **Bundle Analysis**: 
```bash
npm run build
npx source-map-explorer build/static/js/*.js
```

---

## 🔐 Security Notes

- Never commit `.env` files with secrets
- Sanitize all user inputs
- Use HTTPS in production
- Implement Content Security Policy (CSP)
- Keep dependencies updated: `npm audit fix`

---

## 📚 Resources

### Learning
- **React Docs**: https://react.dev/
- **Material-UI Docs**: https://mui.com/
- **Create React App**: https://create-react-app.dev/

### Backend Integration
- See [Backend README](../backend/README.md) for API documentation
- API docs available at: http://localhost:8000/docs (when backend running)

---

## 🤝 Contributing

This is a hackathon submission for SuperHack 2025. For questions or contributions, contact Team Lotus through SuperHack channels.

---

## 📄 License

Part of AI CFO Agent - SuperHack 2025 submission by Team Lotus.

---

**Built with ❤️ using React and Material-UI**

**Version**: 2.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: October 29, 2025
