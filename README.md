# AI CFO Agent with Digital Twin

**Team Name:** Lotus  
**Team Leader:** Radhika Tenali

## Overview
AI CFO Agent is an autonomous financial advisor for MSPs, built on AWS Bedrock, Nova ACT, and MCP. It provides real-time insights, predictive analytics, and autonomous actions to optimize financial management.

## Features
- Profitability and Risk Insights
- License Optimization
- Upsell Opportunities
- Scenario Simulation
- Anomaly Detection
- Automated Reports
- SuperOps Integration

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- AWS Account
- SuperOps API Access (Mock for Prototype)

### Quick Setup
Use the automated setup script:
```bash
chmod +x src/scripts/setup.sh
./src/scripts/setup.sh
```

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd src/backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   - Copy `.env` file and update with your AWS credentials
   - Set your SuperOps API key

5. Run the backend server:
   ```bash
   uvicorn app:app --reload
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd src/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend server:
   ```bash
   npm start
   ```

## Testing

### Backend
Run the backend tests using pytest:
```bash
cd src/backend
pip install pytest
pytest
```

### Frontend
Run the frontend tests using Jest:
```bash
cd src/frontend
npm test
```

## Running the Application

### Backend
```bash
cd src/backend
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
uvicorn app:app --reload
```

### Frontend
```bash
cd src/frontend
npm start
```

## Directory Structure
```
SuperHack2025-AICFOAgent/
├── docs/
├── src/
│   ├── backend/
│   ├── frontend/
│   └── scripts/
├── images/
├── .gitignore
├── README.md
└── LICENSE
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT