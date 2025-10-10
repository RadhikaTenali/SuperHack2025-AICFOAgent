# Project Structure & Organization

## Root Directory Structure
```
ai-cfo-agent/
├── .git/                    # Git version control
├── .kiro/                   # Kiro AI IDE configuration and steering
├── docs/                    # Project documentation
├── images/                  # Static images and assets
├── src/                     # Source code (main development area)
├── .gitignore              # Git ignore patterns
├── LICENSE                 # Project license
└── README.md               # Main project documentation
```

## Source Code Organization (`src/`)
```
src/
├── backend/                 # FastAPI Python backend
│   ├── __pycache__/        # Python bytecode cache
│   ├── venv/               # Python virtual environment
│   ├── .env                # Environment variables (local)
│   ├── .env.example        # Environment template
│   ├── app.py              # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── test_app.py         # Backend test suite
│   └── README.md           # Backend-specific documentation
├── frontend/               # React frontend application
│   ├── node_modules/       # NPM dependencies
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── ProfitabilityDashboard.js
│   │   │   ├── LicenseOptimizer.js
│   │   │   ├── UpsellFinder.js
│   │   │   ├── ScenarioSimulation.js
│   │   │   ├── AnomalyDetection.js
│   │   │   ├── WeeklyReport.js
│   │   │   ├── OverviewCards.js
│   │   │   └── PredictiveInsights.js
│   │   ├── App.js          # Main React application
│   │   ├── index.js        # React entry point
│   │   └── *.css           # Styling files
│   ├── package.json        # NPM configuration
│   └── README.md           # Frontend documentation
└── scripts/                # Automation and setup scripts
    ├── setup.bat           # Windows setup script
    └── setup.sh            # Linux/Mac setup script
```

## Documentation Structure (`docs/`)
```
docs/
├── architecture.md         # System architecture overview
├── DEMO_GUIDE.md          # Demo presentation guide
├── IMPLEMENTATION_SUMMARY.md # Development summary
└── problem-statement.md    # Business problem definition
```

## Component Architecture

### Backend API Structure
- **app.py** - Single-file FastAPI application with 12 REST endpoints
- **Mock Data** - Embedded SuperOps PSA/RMM simulation data
- **AWS Integration** - Bedrock client initialization and error handling
- **CORS Configuration** - Frontend-backend communication setup

### Frontend Component Hierarchy
```
App.js
└── Dashboard.js (Main container)
    ├── OverviewCards.js (KPI summary)
    ├── ProfitabilityDashboard.js (Client analysis)
    ├── LicenseOptimizer.js (Cost optimization)
    ├── UpsellFinder.js (Revenue opportunities)
    ├── ScenarioSimulation.js (Digital twin)
    ├── AnomalyDetection.js (Real-time monitoring)
    ├── WeeklyReport.js (Automated reporting)
    └── PredictiveInsights.js (AI predictions)
```

## File Naming Conventions

### Backend (Python)
- **snake_case** for file names and variables
- **PascalCase** for Pydantic models and classes
- **UPPER_CASE** for constants and environment variables

### Frontend (React)
- **PascalCase** for component files (e.g., `Dashboard.js`)
- **camelCase** for variables and functions
- **kebab-case** for CSS classes and IDs

## Development Workflow

### Local Development
1. Backend runs on `localhost:8000` with auto-reload
2. Frontend runs on `localhost:3000` with hot reload
3. CORS configured for seamless frontend-backend communication

### Testing Structure
- **Backend**: `test_app.py` with pytest framework
- **Frontend**: React Testing Library with Jest
- **Integration**: Manual testing via browser and API docs

## Configuration Management

### Environment Files
- `.env.example` - Template with required variables
- `.env` - Local environment (gitignored)
- Production configs managed via AWS services

### Package Management
- **Backend**: `requirements.txt` with pinned versions
- **Frontend**: `package.json` with semantic versioning

## Deployment Architecture
- **Frontend**: AWS Amplify hosting
- **Backend**: AWS Lambda serverless functions
- **AI/ML**: AWS Bedrock integration
- **Data**: AWS S3 and Bedrock Vector Store