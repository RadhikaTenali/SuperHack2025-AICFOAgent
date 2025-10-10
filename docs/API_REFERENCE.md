# AI CFO Agent 2.0 - API Reference

## Base URL
```
http://localhost:8000
```

## API Documentation
Interactive API docs available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Core Endpoints (Original)

### Dashboard & Overview
```http
GET /dashboard/overview
```
Returns overall MSP financial metrics

### Profitability Analysis
```http
GET /profitability/clients
```
Returns profitability analysis for all clients

### License Optimization
```http
GET /licenses/optimization
```
Returns license optimization opportunities

### Upsell Opportunities
```http
GET /upsell/opportunities
```
Returns AI-identified upsell opportunities

### Scenario Simulation
```http
POST /scenario/simulate
Content-Type: application/json

{
  "scenario_type": "client_churn|service_addition|price_increase",
  "client_id": "client_x",
  "parameters": {
    "months": 3,
    "monthly_revenue": 1000,
    "monthly_cost": 600
  }
}
```

### Anomaly Detection
```http
GET /anomalies/detect
```
Returns detected anomalies across all clients

### Weekly Reports
```http
GET /reports/weekly
```
Returns automated weekly financial summary

### Health Check
```http
GET /health
```
Returns system health and component status

---

## New AI & MCP Endpoints

### Comprehensive Client Analysis
```http
POST /ai/comprehensive-analysis/{client_id}
```
**Description:** Multi-agent comprehensive analysis using MCP orchestration

**Response:**
```json
{
  "client_id": "client_x",
  "client_name": "TechCorp Solutions",
  "analysis_timestamp": "2024-10-10T12:00:00Z",
  "profitability": {
    "margin": -500,
    "status": "unprofitable",
    "priority": "critical",
    "recommendation": "renegotiate"
  },
  "license_optimization": {
    "optimization_needed": true,
    "potential_savings": 2880,
    "monthly_savings": 240
  },
  "upsell_opportunities": {
    "opportunities": [...],
    "total_potential_annual": 24000
  },
  "risk_assessment": {
    "risk_level": "high",
    "cashflow_risk": -1500,
    "churn_probability": 15
  },
  "recommended_actions": [...]
}
```

### License Optimization Workflow
```http
POST /ai/license-optimization-workflow
```
**Description:** Multi-agent workflow for license optimization across all clients

**Response:**
```json
{
  "workflow_type": "license_optimization",
  "completed_at": "2024-10-10T12:00:00Z",
  "clients_analyzed": 3,
  "total_potential_savings": 5000,
  "optimizations": [...]
}
```

### Upsell Workflow
```http
POST /ai/upsell-workflow/{client_id}
```
**Description:** Multi-agent workflow for upsell identification and proposal

**Response:**
```json
{
  "workflow_type": "upsell_generation",
  "client_id": "client_x",
  "opportunities": {...},
  "risk_assessment": {...},
  "proposal": {...},
  "status": "ready_for_review"
}
```

---

## Nova ACT Endpoints

### Track Licenses
```http
GET /nova-act/track-licenses/{client_id}
```
**Description:** Use Nova ACT to track licenses from vendor portals

**Response:**
```json
{
  "client_id": "client_x",
  "tracked_at": "2024-10-10T12:00:00Z",
  "vendors_tracked": [
    {
      "vendor": "microsoft_365",
      "licenses": [...],
      "automation_success": true
    }
  ],
  "total_annual_savings": 2880
}
```

### Auto-Reclaim Licenses
```http
POST /nova-act/auto-reclaim-licenses/{client_id}
```
**Description:** Automatically reclaim unused licenses using Nova ACT

**Response:**
```json
{
  "client_id": "client_x",
  "reclaim_completed": "2024-10-10T12:00:00Z",
  "licenses_reclaimed": 20,
  "total_annual_savings": 2880,
  "details": [...]
}
```

---

## Autonomous Actions Endpoints

### Auto-Downgrade Licenses
```http
POST /autonomous/auto-downgrade-licenses/{client_id}
```
**Description:** Autonomously downgrade unused licenses with guardrails

**Response:**
```json
{
  "action_id": "license_downgrade_client_x_1234567890",
  "status": "requires_approval|completed",
  "monthly_savings": 240,
  "annual_savings": 2880,
  "approval_url": "/actions/approve/{action_id}"
}
```

### Draft Negotiation Email
```http
POST /autonomous/draft-negotiation-email/{client_id}
```
**Description:** Automatically draft negotiation email

**Response:**
```json
{
  "client_id": "client_x",
  "email_type": "negotiation",
  "subject": "Service Agreement Review - TechCorp Solutions",
  "body": "Dear TechCorp Solutions Team,...",
  "status": "draft_ready",
  "requires_review": true
}
```

### Draft Upsell Proposal
```http
POST /autonomous/draft-upsell-proposal/{client_id}
```
**Description:** Automatically draft upsell proposal

**Response:**
```json
{
  "client_id": "client_x",
  "proposal_type": "upsell",
  "service_name": "Premium Cybersecurity Package",
  "monthly_value": 2000,
  "annual_value": 24000,
  "body": "Dear...",
  "status": "draft_ready"
}
```

### Create SuperOps Quote
```http
POST /autonomous/create-superops-quote/{client_id}
Content-Type: application/json

{
  "service_name": "Premium Cybersecurity",
  "description": "24/7 SOC monitoring",
  "monthly_value": 2000,
  "annual_value": 24000
}
```

**Response:**
```json
{
  "quote_id": "Q-20241010-TECH",
  "client_id": "client_x",
  "total": 2200,
  "annual_value": 24000,
  "status": "draft",
  "superops_url": "https://app.superops.com/quotes/client_x"
}
```

### Get Pending Approvals
```http
GET /autonomous/pending-approvals
```
**Description:** Get all autonomous actions awaiting approval

### Approve Action
```http
POST /autonomous/approve/{action_id}
```
**Description:** Approve a pending autonomous action

### Actions History
```http
GET /autonomous/history?limit=50
```
**Description:** Get history of autonomous actions

---

## Alerts Endpoints

### Send Test Alert
```http
POST /alerts/send-test-alert
```
**Description:** Send test alert to Slack/Teams

### Recent Alerts
```http
GET /alerts/recent?limit=20
```
**Description:** Get recent alerts

### Alert Statistics
```http
GET /alerts/stats
```
**Description:** Get alert statistics

**Response:**
```json
{
  "total_alerts": 18,
  "critical_alerts": 3,
  "high_alerts": 7,
  "alerts_by_type": {
    "unprofitable_client": 3,
    "license_waste_detected": 5,
    "upsell_opportunity": 6,
    "cashflow_risk": 2,
    "anomaly_detected": 2
  }
}
```

---

## Vector Store (RAG) Endpoints

### Find Similar Clients
```http
GET /vector-store/similar-clients?query={query}&limit=5
```
**Description:** Find similar clients using vector store RAG

**Example:**
```
GET /vector-store/similar-clients?query=profitable+clients+with+cybersecurity&limit=5
```

### Analyze Patterns
```http
GET /vector-store/analyze-patterns/{client_id}
```
**Description:** Analyze patterns using RAG from similar clients

**Response:**
```json
{
  "client_id": "client_x",
  "analysis_type": "pattern_recognition",
  "similar_clients_analyzed": 5,
  "patterns_identified": [
    {
      "pattern": "below_average_margin",
      "description": "Client margin is below similar clients average",
      "recommendation": "Review pricing and efficiency"
    }
  ]
}
```

### Get Best Practices
```http
GET /vector-store/best-practices/{client_id}
```
**Description:** Get best practices from successful similar clients

### Predict Churn
```http
GET /vector-store/predict-churn/{client_id}
```
**Description:** Predict churn risk using RAG and historical patterns

**Response:**
```json
{
  "client_id": "client_x",
  "churn_probability": 75,
  "risk_level": "high",
  "indicators": {
    "negative_margin": true,
    "high_ticket_volume": true,
    "security_incidents": true
  },
  "recommendations": [...],
  "confidence": 85
}
```

---

## S3 Storage Endpoints

### Get Client History
```http
GET /s3/client-history/{client_id}?days=30
```
**Description:** Retrieve client historical data from S3

### Get Financial Trend
```http
GET /s3/financial-trend?days=30
```
**Description:** Retrieve financial trend data from S3

### Export Client Report
```http
GET /s3/export-report/{client_id}
```
**Description:** Export comprehensive client report from S3 data

**Response:**
```json
{
  "client_id": "client_x",
  "generated_at": "2024-10-10T12:00:00Z",
  "report_type": "comprehensive",
  "data_points": 45,
  "sections": {
    "profile": {...},
    "tickets": [...],
    "licenses": [...],
    "financial": [...]
  }
}
```

---

## System Endpoints

### System Statistics
```http
GET /system/stats
```
**Description:** Get overall system statistics and health

**Response:**
```json
{
  "system_health": "operational",
  "components": {
    "bedrock_agent": {
      "available": true,
      "status": "operational"
    },
    "mcp_orchestrator": {
      "agents": 5,
      "tasks_completed": 127
    },
    "nova_act": {
      "vendors_supported": 6,
      "tracking_active": true
    },
    "autonomous_engine": {
      "pending_approvals": 2,
      "actions_completed": 34
    },
    "alerts_manager": {
      "total_alerts": 18
    },
    "vector_store": {...},
    "s3_store": {...}
  },
  "version": "2.0.0",
  "features": {
    "ai_reasoning": true,
    "multi_agent_coordination": true,
    "browser_automation": true,
    "autonomous_actions": true,
    "real_time_alerts": true,
    "rag_analytics": true,
    "cloud_storage": true
  }
}
```

---

## Authentication

Currently, the API uses simple environment variable configuration for AWS services. In production, implement:
- API key authentication
- OAuth2 for SuperOps integration
- Role-based access control (RBAC)

---

## Rate Limiting

Production deployments should implement rate limiting:
- Standard endpoints: 100 requests/minute
- AI/MCP endpoints: 20 requests/minute (more expensive)
- Bulk operations: 10 requests/minute

---

## Error Responses

All endpoints return standard HTTP status codes:

**Success:**
- `200 OK` - Request successful
- `201 Created` - Resource created

**Client Errors:**
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error

**Server Errors:**
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Component unavailable

**Example Error Response:**
```json
{
  "detail": "Client not found",
  "error_code": "CLIENT_NOT_FOUND",
  "timestamp": "2024-10-10T12:00:00Z"
}
```

---

## Webhooks

### Slack Webhook Format
```json
{
  "text": "🚨 AI CFO Agent Alert",
  "attachments": [
    {
      "color": "#FF0000",
      "title": "Unprofitable Client",
      "fields": [
        {
          "title": "Client",
          "value": "TechCorp Solutions",
          "short": true
        },
        {
          "title": "Monthly Margin",
          "value": "$-500",
          "short": true
        }
      ]
    }
  ]
}
```

### Teams Webhook Format
```json
{
  "@type": "MessageCard",
  "@context": "https://schema.org/extensions",
  "summary": "AI CFO Agent Alert",
  "themeColor": "attention",
  "title": "🤖 AI CFO Agent - Unprofitable Client",
  "sections": [...]
}
```

---

## Testing

### Quick Test Commands

```bash
# Health check
curl http://localhost:8000/health

# Get system stats
curl http://localhost:8000/system/stats

# Comprehensive analysis
curl -X POST http://localhost:8000/ai/comprehensive-analysis/client_x

# Track licenses with Nova ACT
curl http://localhost:8000/nova-act/track-licenses/client_x

# Draft negotiation email
curl -X POST http://localhost:8000/autonomous/draft-negotiation-email/client_x

# Get pending approvals
curl http://localhost:8000/autonomous/pending-approvals

# Predict churn
curl http://localhost:8000/vector-store/predict-churn/client_x

# Send test alert
curl -X POST http://localhost:8000/alerts/send-test-alert
```

---

## SDK/Client Libraries

Future releases will include:
- Python SDK
- JavaScript/TypeScript SDK
- SuperOps Plugin SDK

---

## Version History

### v2.0.0 (Current)
- ✅ AWS Bedrock AI Agent integration
- ✅ Multi-Agent Coordination Protocol (MCP)
- ✅ Amazon Nova ACT browser automation
- ✅ Autonomous actions with guardrails
- ✅ Slack/Teams alerts
- ✅ Vector Store for RAG analytics
- ✅ S3 storage integration

### v1.0.0
- Basic dashboard and analytics
- License optimization
- Upsell identification
- Scenario simulation
- Anomaly detection

---

**For more information, visit:** `http://localhost:8000/docs`

