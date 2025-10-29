# 🤖 AI CFO Agent - Backend

**An intelligent financial management system for MSPs with real-time analytics, email automation, and multi-agent AI capabilities.**

![AI CFO Agent](https://img.shields.io/badge/AI-CFO%20Agent-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-red)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)

## ✨ Features

- **📊 Real-time Financial Dashboard** - Track revenue, margins, and client profitability
- **📧 Automated Email Reports** - Beautiful HTML weekly reports via SMTP
- **🎯 License Optimization** - Identify unused licenses and cost savings
- **💰 Upsell Opportunities** - AI-powered service recommendations
- **🔍 Anomaly Detection** - Detect billing errors and risk patterns
- **🌱 Sustainability Analytics** - Carbon footprint tracking and green initiatives
- **🏆 Performance Scoreboard** - MSP benchmarking and client rankings
- **🎲 Scenario Simulation** - What-if analysis with Digital Twin technology
- **⚡ Autonomous Actions** - AI-driven license management with guardrails
- **🤖 AWS Bedrock Integration** - Multi-agent AI orchestration with Nova models

## 🏗️ Backend Structure

```
src/backend/
├── app.py                          # Main FastAPI application with all endpoints
├── bedrock_agent.py                # AWS Bedrock AI agent integration
├── autonomous_actions.py           # Automated license management & actions
├── email_service.py                # SMTP email service for reports
├── notifications_service.py        # Multi-channel notifications (email, Slack, webhooks)
├── alerts_integration.py           # Alert management and monitoring
├── performance_scoreboard.py       # MSP performance metrics and benchmarking
├── sustainability_analytics.py     # Carbon footprint and sustainability tracking
├── vector_store_rag.py             # RAG system with vector embeddings
├── s3_storage.py                   # AWS S3 integration for data storage
├── realtime_updates.py             # Real-time data updates and WebSocket support
├── superops_integration.py         # SuperOps.ai PSA/RMM integration
├── nova_act_automation.py          # AWS Nova Act automation workflows
├── mcp_orchestrator.py             # Multi-agent orchestration layer
├── lambda_handler.py               # AWS Lambda deployment handler
├── requirements.txt                # Python dependencies
├── test_app.py                     # Application tests
└── test_email.py                   # Email service tests
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8 or higher**
- **Node.js 16 or higher** (for frontend)
- **AWS Account** (for Bedrock, S3, optional)
- **Gmail account with App Password** (for email reports)

### Installation

#### 1. Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Email Configuration (Gmail with App Password)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=AI CFO Agent

# AWS Configuration (Optional - for Bedrock AI features)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# SuperOps Integration (Optional)
SUPEROPS_API_KEY=your-superops-key
SUPEROPS_BASE_URL=https://api.superops.ai

# Application Settings
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

#### 4. Run the Backend Server

**Windows:**
```powershell
.\venv\Scripts\python.exe app.py
```

**Linux/macOS:**
```bash
python app.py
```

Or using Uvicorn directly:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**

API Documentation will be available at: **http://localhost:8000/docs**

## 📡 API Endpoints

### Core Dashboard
- `GET /` - Welcome message and API info
- `GET /dashboard/overview` - Financial overview dashboard
- `GET /health` - Health check endpoint
- `GET /system/stats` - System statistics and metrics

### Client Management
- `GET /clients` - List all clients with financial metrics
- `POST /clients` - Create new client
- `PUT /clients/{client_id}` - Update client information
- `DELETE /clients/{client_id}` - Delete client

### Profitability & Analytics
- `GET /profitability/clients` - Client profitability analysis
- `GET /licenses/optimization` - License optimization recommendations
- `GET /upsell/opportunities` - AI-powered upsell opportunities
- `GET /anomalies/detect` - Detect billing anomalies and risks

### AI & Automation
- `POST /ai/comprehensive-analysis/{client_id}` - Comprehensive AI analysis
- `POST /autonomous/auto-downgrade-licenses/{client_id}` - Autonomous license optimization
- `POST /scenario/simulate` - What-if scenario simulation

### Reports & Notifications
- `GET /reports/weekly` - Generate weekly financial report
- `POST /api/send-weekly-report` - Email weekly report
- `POST /api/send-proposal` - Send upsell proposal via email
- `POST /api/execute-optimization` - Execute license optimization
- `POST /api/resolve-anomaly` - Resolve detected anomaly

### Sustainability
- `GET /sustainability/overview` - Sustainability metrics overview
- `GET /sustainability/client/{client_id}` - Client sustainability metrics
- `GET /sustainability/green-initiatives` - Available green initiatives
- `POST /sustainability/implement-initiative/{client_id}` - Implement green initiative

### Performance Scoreboard
- `GET /performance/scoreboard` - MSP performance scoreboard
- `GET /performance/client/{client_id}` - Individual client performance
- `GET /performance/benchmarks` - Industry benchmarks
- `POST /performance/set-goals/{client_id}` - Set performance goals

### Services & Budget Management
- `GET /services` - List all services
- `POST /services` - Create new service
- `PUT /services/{service_id}` - Update service
- `DELETE /services/{service_id}` - Delete service
- `GET /budgets` - List all budgets
- `GET /budgets/overview` - Budget overview
- `POST /budgets` - Create budget
- `PUT /budgets/{budget_id}` - Update budget
- `DELETE /budgets/{budget_id}` - Delete budget

### Alerts & Goals
- `GET /alerts/settings` - Get alert settings
- `POST /alerts/settings` - Create alert setting
- `PUT /alerts/settings/{alert_id}` - Update alert
- `DELETE /alerts/settings/{alert_id}` - Delete alert
- `POST /alerts/test/{alert_id}` - Test alert
- `GET /goals` - List all goals
- `POST /goals` - Create goal
- `PUT /goals/{goal_id}` - Update goal
- `DELETE /goals/{goal_id}` - Delete goal

### User Preferences
- `GET /user/preferences` - Get user preferences
- `PUT /user/preferences` - Update user preferences

### Real-time & Integrations
- `GET /realtime/status` - Real-time update status
- `POST /realtime/trigger-update` - Trigger manual update
- `GET /superops/status` - SuperOps integration status
- `GET /superops/clients` - Fetch SuperOps clients
- `GET /nova-act/status` - AWS Nova Act status

## 🧪 Testing

Run application tests:
```bash
python test_app.py
```

Test email functionality:
```bash
python test_email.py
```

## 📦 Key Dependencies

- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **boto3** - AWS SDK for Python (Bedrock, S3)
- **python-dotenv** - Environment variable management
- **requests** - HTTP client library
- **PyYAML** - YAML parser for configuration
- **smtplib** (built-in) - Email sending

## 🔧 Development

### Interactive API Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Adding New Endpoints

1. Define your endpoint in `app.py`:
```python
@app.get("/new-endpoint")
async def new_endpoint():
    return {"message": "New endpoint"}
```

2. The endpoint will automatically appear in the API docs

### Hot Reload

Use the `--reload` flag for development:
```bash
uvicorn app:app --reload
```

## 🚀 Deployment

### AWS Lambda (Serverless)

Use the provided `lambda_handler.py`:
```bash
# Package dependencies
pip install -r requirements.txt -t ./package
cd package
zip -r ../deployment.zip .
cd ..
zip -g deployment.zip *.py
```

Upload to AWS Lambda and configure API Gateway.

### Docker (Coming Soon)

Docker support is planned for easier deployment.

## 🔐 Security Notes

- Never commit `.env` files or credentials
- Use AWS IAM roles instead of access keys when possible
- Enable Gmail App Passwords (don't use account password)
- Implement rate limiting for production deployments
- Use HTTPS in production

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SMTP_SERVER` | SMTP server address | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes | `587` |
| `SMTP_USERNAME` | SMTP username/email | Yes | - |
| `SMTP_PASSWORD` | SMTP password/app password | Yes | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | No | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | No | - |
| `AWS_REGION` | AWS region | No | `us-east-1` |
| `S3_BUCKET_NAME` | S3 bucket for storage | No | - |
| `DEBUG` | Debug mode | No | `True` |
| `HOST` | Server host | No | `0.0.0.0` |
| `PORT` | Server port | No | `8000` |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Linux/macOS

# Kill the process or use a different port
uvicorn app:app --port 8001
```

### Module Not Found Errors
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Email Sending Issues
- Verify Gmail App Password is correct
- Enable "Less secure app access" (if not using App Password)
- Check firewall settings for port 587

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for SuperHack 2025**
