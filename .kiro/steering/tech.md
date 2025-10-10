# Technology Stack & Build System

## Core Technologies

### Frontend Stack
- **React 19** - Modern React with latest features
- **Material-UI (MUI) v7** - Component library for consistent design
- **Axios** - HTTP client for API communication
- **React Router DOM** - Client-side routing

### Backend Stack
- **FastAPI** - High-performance Python web framework
- **Python 3.9+** - Core backend language
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server for FastAPI

### AI/ML Integration
- **AWS Bedrock** - Core AI reasoning engine and LLM integration
- **Nova ACT** - Browser automation for license tracking
- **MCP (Model Context Protocol)** - Multi-agent workflow orchestration
- **Boto3** - AWS SDK for Python

### Development & Testing
- **pytest** - Python testing framework
- **React Testing Library** - Frontend component testing
- **Jest** - JavaScript testing framework

## Common Commands

### Backend Development
```bash
# Setup and run backend
cd src/backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with AWS credentials
python app.py

# Run tests
pytest test_app.py -v

# Start development server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
# Setup and run frontend
cd src/frontend
npm install
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Full Stack Setup
```bash
# Use provided setup scripts
# Windows:
src/scripts/setup.bat

# Linux/Mac:
chmod +x src/scripts/setup.sh
./src/scripts/setup.sh
```

## Environment Configuration

### Required Environment Variables (.env)
```
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Development Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## AWS Services Integration
- **AWS Bedrock** - AI/ML model hosting and inference
- **AWS Amplify** - Frontend hosting (production)
- **AWS Lambda** - Serverless function execution
- **AWS S3** - Document and report storage
- **Bedrock Vector Store** - RAG data storage

## Code Quality Standards
- Use TypeScript-style prop validation in React components
- Follow FastAPI async/await patterns for API endpoints
- Implement comprehensive error handling with try/catch blocks
- Use Pydantic models for API request/response validation
- Follow Material-UI design system guidelines