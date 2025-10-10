# AI CFO Agent 2.0 - Deployment Guide

## 📦 Prerequisites

### System Requirements
- **Python**: 3.9 or higher
- **Node.js**: 16.x or higher (for frontend)
- **RAM**: Minimum 4GB, Recommended 8GB
- **Storage**: 5GB free space

### AWS Account (Optional but Recommended)
- AWS account with Bedrock access
- S3 bucket for data storage
- IAM credentials with appropriate permissions

---

## 🚀 Quick Start (Local Development)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/SuperHack2025-AICFOAgent.git
cd SuperHack2025-AICFOAgent
```

### Step 2: Backend Setup
```bash
cd src/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Optional: Install v2 enhanced dependencies
pip install -r requirements_v2.txt

# Create .env file
cp .env.example .env

# Edit .env with your credentials (optional - works without AWS)
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_REGION=us-west-2
# SLACK_WEBHOOK_URL=your_webhook
# TEAMS_WEBHOOK_URL=your_webhook

# Run backend
python app.py
```

Backend will be available at: `http://localhost:8000`

### Step 3: Frontend Setup
```bash
cd src/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## ☁️ AWS Configuration

### AWS Bedrock Setup

#### 1. Enable Bedrock Models
```bash
# Using AWS CLI
aws bedrock list-foundation-models --region us-west-2

# Request access to Claude 3.5 Sonnet
# Go to AWS Console > Bedrock > Model Access
# Request access to: anthropic.claude-3-5-sonnet-20241022-v2:0
```

#### 2. Create IAM User
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock-agent:*",
        "bedrock-agent-runtime:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ai-cfo-agent-data",
        "arn:aws:s3:::ai-cfo-agent-data/*"
      ]
    }
  ]
}
```

#### 3. Create S3 Bucket
```bash
# Create bucket
aws s3 mb s3://ai-cfo-agent-data --region us-west-2

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket ai-cfo-agent-data \
  --versioning-configuration Status=Enabled
```

#### 4. Configure Bedrock Knowledge Base (Optional)
```bash
# Create knowledge base for vector store
aws bedrock-agent create-knowledge-base \
  --name "ai-cfo-financial-data" \
  --description "Financial data for AI CFO Agent RAG" \
  --role-arn "arn:aws:iam::YOUR_ACCOUNT:role/BedrockKnowledgeBaseRole"
```

### Environment Variables
```bash
# Required for AWS features
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-west-2
S3_BUCKET_NAME=ai-cfo-agent-data
BEDROCK_KNOWLEDGE_BASE_ID=your-kb-id

# Optional integrations
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...

# SuperOps API (when available)
SUPEROPS_API_KEY=your-api-key
SUPEROPS_API_URL=https://api.superops.com/v1
```

---

## 🐳 Docker Deployment

### Build Docker Images

#### Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY src/backend/requirements.txt .
COPY src/backend/requirements_v2.txt .
RUN pip install --no-cache-dir -r requirements.txt -r requirements_v2.txt

COPY src/backend/ .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=us-west-2
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
```

### Deploy with Docker Compose
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☸️ Kubernetes Deployment

### Kubernetes Manifests

#### Backend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-cfo-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-cfo-backend
  template:
    metadata:
      labels:
        app: ai-cfo-backend
    spec:
      containers:
      - name: backend
        image: ai-cfo-agent:2.0.0
        ports:
        - containerPort: 8000
        env:
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: access-key-id
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: secret-access-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: ai-cfo-backend-service
spec:
  selector:
    app: ai-cfo-backend
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

### Deploy to Kubernetes
```bash
# Create secrets
kubectl create secret generic aws-credentials \
  --from-literal=access-key-id=$AWS_ACCESS_KEY_ID \
  --from-literal=secret-access-key=$AWS_SECRET_ACCESS_KEY

# Apply configurations
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/ai-cfo-backend
```

---

## 🌐 AWS Amplify Deployment (Frontend)

### Setup Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify project
cd src/frontend
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

### Amplify Configuration
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 🔒 Security Best Practices

### 1. API Security
```python
# Add authentication middleware
from fastapi.security import HTTPBearer
from fastapi import Security, Depends

security = HTTPBearer()

@app.get("/protected-endpoint")
async def protected_route(credentials: HTTPAuthorizationCredentials = Security(security)):
    # Verify token
    token = credentials.credentials
    # Your auth logic here
    pass
```

### 2. Environment Variables
- Never commit `.env` files
- Use AWS Secrets Manager or Parameter Store in production
- Rotate credentials regularly

### 3. Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/endpoint")
@limiter.limit("100/minute")
async def rate_limited_endpoint():
    pass
```

### 4. CORS Configuration
```python
# Production CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domains
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Specific methods
    allow_headers=["*"],
)
```

---

## 📊 Monitoring & Logging

### CloudWatch Integration
```python
import watchtower
import logging

logger = logging.getLogger(__name__)
logger.addHandler(watchtower.CloudWatchLogHandler())
```

### Health Checks
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "components": {
            # Check each component
        }
    }
```

### Metrics
```python
from prometheus_client import Counter, Histogram

request_count = Counter('api_requests_total', 'Total API requests')
request_duration = Histogram('api_request_duration_seconds', 'Request duration')
```

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd src/backend
pytest

# With coverage
pytest --cov=. --cov-report=html

# Frontend tests
cd src/frontend
npm test

# E2E tests
npm run test:e2e
```

### Load Testing
```bash
# Install locust
pip install locust

# Run load test
locust -f tests/load_test.py --host=http://localhost:8000
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        pip install -r src/backend/requirements.txt
        pip install pytest
    - name: Run tests
      run: pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Deploy to AWS
      run: |
        # Your deployment commands
        aws ecr get-login-password --region us-west-2 | docker login ...
        docker build -t ai-cfo-agent .
        docker push ...
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. AWS Credentials Not Working
```bash
# Verify credentials
aws sts get-caller-identity

# Check Bedrock access
aws bedrock list-foundation-models --region us-west-2
```

#### 2. Module Import Errors
```bash
# Ensure you're in the backend directory
cd src/backend

# Reinstall dependencies
pip install -r requirements.txt -r requirements_v2.txt
```

#### 3. CORS Issues
- Check frontend is making requests to correct backend URL
- Verify CORS middleware configuration
- Check browser console for specific errors

#### 4. Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

---

## 📈 Performance Optimization

### 1. Async Operations
- All new endpoints use `async/await`
- Background tasks for non-blocking operations
- Parallel agent execution with MCP

### 2. Caching
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def expensive_computation(param):
    # Cached results
    pass
```

### 3. Database Optimization
- Use S3 for historical data
- Vector store for fast semantic search
- In-memory caching for frequent queries

---

## 🎯 Production Checklist

- [ ] AWS credentials configured
- [ ] S3 bucket created and configured
- [ ] Bedrock models access granted
- [ ] Environment variables set
- [ ] SSL/TLS certificates configured
- [ ] Rate limiting enabled
- [ ] Authentication implemented
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Load testing completed
- [ ] Security audit completed

---

## 📞 Support

For deployment issues:
1. Check logs: `kubectl logs` or `docker logs`
2. Verify component health: `GET /health`
3. Test AWS connectivity: `GET /system/stats`
4. Review documentation: `GET /docs`

---

**Deployment Version:** 2.0.0  
**Last Updated:** October 10, 2025  
**Status:** Production Ready ✅

