

from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import boto3
from botocore.exceptions import ClientError
import os
import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from dotenv import load_dotenv
import asyncio

# Import AI CFO Agent modules with error handling
try:
    from bedrock_agent import bedrock_agent
except ImportError:
    bedrock_agent = type('MockBedrock', (), {'agent_available': False})()

try:
    from mcp_orchestrator import mcp_orchestrator
except ImportError:
    mcp_orchestrator = type('MockMCP', (), {
        'orchestrate_comprehensive_analysis': lambda self, data: {"status": "mock_mode"},
        'agents': [],
        'tasks': {}
    })()

try:
    from nova_act_automation import nova_act
except ImportError:
    nova_act = type('MockNova', (), {'tracked_vendors': []})()

try:
    from autonomous_actions import autonomous_engine, ActionType, AutonomousActions
except ImportError:
    autonomous_engine = type('MockEngine', (), {
        'auto_downgrade_unused_licenses': lambda self, *args: {"status": "mock_mode"},
        'get_pending_approvals': lambda self: [],
        'actions_history': []
    })()
    AutonomousActions = type('MockActions', (), {
        'execute_license_optimization': lambda self, *args: {"status": "mock_mode"},
        'resolve_anomaly': lambda self, *args: {"status": "mock_mode"}
    })

try:
    from alerts_integration import alerts_manager
except ImportError:
    alerts_manager = type('MockAlerts', (), {
        'send_unprofitable_client_alert': lambda self, data: {"status": "mock_mode"},
        'alerts_history': []
    })()

try:
    from vector_store_rag import vector_store
except ImportError:
    vector_store = type('MockVector', (), {
        'vector_store_available': False,
        'store_client_financial_data': lambda self, *args: {"status": "mock_mode"},
        'get_storage_stats': lambda self: {"status": "mock_mode"}
    })()

try:
    from s3_storage import s3_store
except ImportError:
    s3_store = type('MockS3', (), {
        's3_available': False,
        'store_analysis_result': lambda self, *args: {"status": "mock_mode"},
        'get_storage_stats': lambda self: {"status": "mock_mode"}
    })()

try:
    from email_service import EmailService
    email_service = EmailService()
except ImportError:
    EmailService = type('MockEmail', (), {
        'send_weekly_report': lambda self, *args: {"success": False, "message": "Email service not configured"},
        'send_proposal_email': lambda self, *args: {"success": False, "message": "Email service not configured"}
    })
    email_service = EmailService()

try:
    from sustainability_analytics import sustainability_analytics
except ImportError:
    sustainability_analytics = type('MockSustainability', (), {
        'calculate_carbon_footprint': lambda self, client_id=None: {
            "portfolio_footprint": {"net_emissions": 1200, "total_carbon_credits": 150},
            "portfolio_score": 75, "environmental_impact": {"impact_level": "Medium", "trees_to_offset": 55, "car_miles_equivalent": 3000},
            "client_summaries": [], "sustainability_trends": {"emission_trend": "decreasing", "trend_percentage": -8.5, "green_initiative_adoption": 73, "industry_ranking": "Top 25%"}
        },
        'get_green_initiatives_catalog': lambda self: [
            {"name": "Solar Panel Installation", "category": "Energy", "co2_reduction_kg": 300, "cost_estimate": 15000, "roi_months": 36},
            {"name": "Server Virtualization", "category": "Infrastructure", "co2_reduction_kg": 120, "cost_estimate": 5000, "roi_months": 18}
        ]
    })()

try:
    from performance_scoreboard import performance_scoreboard
except ImportError:
    performance_scoreboard = type('MockPerformance', (), {
        'get_overall_scoreboard': lambda self: {
            "scoreboard": [], "portfolio_summary": {"total_clients": 3, "average_score": 72.5, "rankings_distribution": {"Platinum": 1, "Gold": 1, "Silver": 1, "Bronze": 0}, "portfolio_health": "Good"},
            "performance_trends": {"overall_trend": "improving", "trend_percentage": 8.5, "key_improvements": ["Customer satisfaction up 12%"], "areas_of_concern": ["License utilization plateaued"]},
            "recommendations": ["Focus on improving client satisfaction scores"]
        },
        'get_client_performance_detail': lambda self, client_id: {
            "client_info": {"name": "Mock Client", "contract_value": 50000}, "performance_metrics": {"financial": {"monthly_revenue": 5000, "monthly_margin": 1000, "margin_percentage": 20}},
            "score_breakdown": {"overall_score": 75, "score_breakdown": {"financial": 80, "operational": 75, "satisfaction": 85, "security": 70, "efficiency": 65}},
            "achievements": ["High Availability Champion"], "improvement_plan": []
        },
        'industry_benchmarks': {"avg_margin_percentage": 22, "avg_resolution_time": 12.5},
        '_get_industry_comparison': lambda self: {},
        '_generate_portfolio_recommendations': lambda self, data: ["Implement automated monitoring"]
    })()

load_dotenv()

app = FastAPI(
    title="AI CFO Agent - Enhanced", 
    description="Autonomous CFO with Digital Twin, Multi-Agent AI, and Predictive Analytics for MSPs",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock SuperOps Data
MOCK_CLIENTS = {
    "client_x": {
        "name": "TechCorp Solutions",
        "monthly_revenue": 1500,
        "monthly_cost": 2000,
        "margin": -500,
        "contract_value": 18000,
        "services": ["IT Support", "Cloud Management"],
        "tickets_last_month": 45,
        "security_incidents": 5,
        "licenses": {
            "microsoft_365": {"total": 50, "used": 30, "cost_per_license": 12},
            "adobe_creative": {"total": 10, "used": 3, "cost_per_license": 52}
        }
    },
    "client_y": {
        "name": "RetailMax Inc",
        "monthly_revenue": 3500,
        "monthly_cost": 2800,
        "margin": 700,
        "contract_value": 42000,
        "services": ["Network Management", "Backup Services"],
        "tickets_last_month": 12,
        "security_incidents": 8,
        "licenses": {
            "microsoft_365": {"total": 25, "used": 24, "cost_per_license": 12},
            "antivirus": {"total": 30, "used": 28, "cost_per_license": 8}
        }
    },
    "client_z": {
        "name": "HealthFirst Medical",
        "monthly_revenue": 5000,
        "monthly_cost": 3200,
        "margin": 1800,
        "contract_value": 60000,
        "services": ["Cybersecurity", "Compliance Management"],
        "tickets_last_month": 8,
        "security_incidents": 1,
        "licenses": {
            "microsoft_365": {"total": 40, "used": 38, "cost_per_license": 12},
            "security_suite": {"total": 15, "used": 15, "cost_per_license": 45}
        }
    }
}

class ScenarioRequest(BaseModel):
    scenario_type: str
    client_id: str
    parameters: Dict[str, Any]

@app.get("/")
def read_root():
    return {"message": "Welcome to AI CFO Agent - Autonomous CFO with Digital Twin for MSPs"}

@app.get("/dashboard/overview")
def get_dashboard_overview():
    """Get overall MSP financial overview"""
    total_revenue = sum(client["monthly_revenue"] for client in MOCK_CLIENTS.values())
    total_costs = sum(client["monthly_cost"] for client in MOCK_CLIENTS.values())
    total_margin = total_revenue - total_costs
    
    unprofitable_clients = [
        {"id": k, "name": v["name"], "margin": v["margin"]} 
        for k, v in MOCK_CLIENTS.items() if v["margin"] < 0
    ]
    
    return {
        "total_monthly_revenue": total_revenue,
        "total_monthly_costs": total_costs,
        "total_margin": total_margin,
        "margin_percentage": round((total_margin / total_revenue) * 100, 1),
        "client_count": len(MOCK_CLIENTS),
        "unprofitable_clients": unprofitable_clients,
        "risk_alerts": len(unprofitable_clients)
    }

@app.get("/profitability/clients")
def get_client_profitability():
    """Get profitability analysis for all clients"""
    clients = []
    for client_id, data in MOCK_CLIENTS.items():
        risk_level = "high" if data["margin"] < 0 else "medium" if data["margin"] < 500 else "low"
        
        clients.append({
            "id": client_id,
            "name": data["name"],
            "monthly_revenue": data["monthly_revenue"],
            "monthly_cost": data["monthly_cost"],
            "margin": data["margin"],
            "margin_percentage": round((data["margin"] / data["monthly_revenue"]) * 100, 1),
            "risk_level": risk_level,
            "contract_value": data["contract_value"],
            "recommendation": get_profitability_recommendation(data)
        })
    
    return {"clients": clients}

@app.get("/licenses/optimization")
def get_license_optimization():
    """Get license optimization opportunities"""
    optimizations = []
    total_savings = 0
    
    for client_id, client_data in MOCK_CLIENTS.items():
        for license_type, license_data in client_data["licenses"].items():
            unused = license_data["total"] - license_data["used"]
            if unused > 0:
                monthly_savings = unused * license_data["cost_per_license"]
                annual_savings = monthly_savings * 12
                total_savings += annual_savings
                
                optimizations.append({
                    "client_id": client_id,
                    "client_name": client_data["name"],
                    "license_type": license_type.replace("_", " ").title(),
                    "total_licenses": license_data["total"],
                    "used_licenses": license_data["used"],
                    "unused_licenses": unused,
                    "cost_per_license": license_data["cost_per_license"],
                    "monthly_savings": monthly_savings,
                    "annual_savings": annual_savings,
                    "utilization_rate": round((license_data["used"] / license_data["total"]) * 100, 1)
                })
    
    return {
        "optimizations": optimizations,
        "total_annual_savings": total_savings,
        "total_monthly_savings": total_savings / 12
    }

@app.get("/upsell/opportunities")
def get_upsell_opportunities():
    """Identify upsell opportunities based on ticket patterns"""
    opportunities = []
    
    for client_id, client_data in MOCK_CLIENTS.items():
        upsells = []
        
        # Security upsell based on incidents
        if client_data["security_incidents"] >= 5:
            upsells.append({
                "service": "Premium Cybersecurity Package",
                "monthly_value": 2000,
                "annual_value": 24000,
                "confidence": 85,
                "reason": f"{client_data['security_incidents']} security incidents last month"
            })
        
        # Backup upsell based on tickets
        if client_data["tickets_last_month"] >= 20:
            upsells.append({
                "service": "Enhanced Backup & Recovery",
                "monthly_value": 800,
                "annual_value": 9600,
                "confidence": 70,
                "reason": f"{client_data['tickets_last_month']} support tickets indicate system instability"
            })
        
        # Compliance upsell for healthcare
        if "health" in client_data["name"].lower():
            upsells.append({
                "service": "HIPAA Compliance Monitoring",
                "monthly_value": 1200,
                "annual_value": 14400,
                "confidence": 90,
                "reason": "Healthcare industry requires enhanced compliance monitoring"
            })
        
        if upsells:
            opportunities.append({
                "client_id": client_id,
                "client_name": client_data["name"],
                "current_monthly_revenue": client_data["monthly_revenue"],
                "upsell_opportunities": upsells,
                "total_potential_monthly": sum(u["monthly_value"] for u in upsells),
                "total_potential_annual": sum(u["annual_value"] for u in upsells)
            })
    
    return {"opportunities": opportunities}

@app.post("/scenario/simulate")
def simulate_scenario(request: ScenarioRequest):
    """Simulate what-if scenarios using Digital Twin"""
    client_data = MOCK_CLIENTS.get(request.client_id)
    if not client_data:
        raise HTTPException(status_code=404, detail="Client not found")
    
    if request.scenario_type == "client_churn":
        return simulate_client_churn(request.client_id, client_data, request.parameters)
    elif request.scenario_type == "service_addition":
        return simulate_service_addition(request.client_id, client_data, request.parameters)
    elif request.scenario_type == "price_increase":
        return simulate_price_increase(request.client_id, client_data, request.parameters)
    else:
        raise HTTPException(status_code=400, detail="Invalid scenario type")

@app.get("/anomalies/detect")
def detect_anomalies():
    """Detect billing errors, low-margin clients, and budget overruns"""
    anomalies = []
    
    for client_id, client_data in MOCK_CLIENTS.items():
        # Low margin anomaly
        if client_data["margin"] < 0:
            anomalies.append({
                "type": "low_margin",
                "severity": "high",
                "client_id": client_id,
                "client_name": client_data["name"],
                "description": f"Client operating at {client_data['margin']} monthly loss",
                "impact": f"${abs(client_data['margin']) * 12} annual loss",
                "recommendation": "Renegotiate contract or terminate relationship"
            })
        
        # High ticket volume anomaly
        if client_data["tickets_last_month"] > 30:
            anomalies.append({
                "type": "high_support_load",
                "severity": "medium",
                "client_id": client_id,
                "client_name": client_data["name"],
                "description": f"{client_data['tickets_last_month']} tickets last month (above normal)",
                "impact": "Increased support costs",
                "recommendation": "Investigate root cause or adjust service level"
            })
        
        # License utilization anomaly
        for license_type, license_data in client_data["licenses"].items():
            utilization = (license_data["used"] / license_data["total"]) * 100
            if utilization < 60:
                unused = license_data["total"] - license_data["used"]
                monthly_waste = unused * license_data["cost_per_license"]
                anomalies.append({
                    "type": "license_waste",
                    "severity": "medium",
                    "client_id": client_id,
                    "client_name": client_data["name"],
                    "description": f"{license_type.replace('_', ' ').title()}: {unused} unused licenses ({utilization:.1f}% utilization)",
                    "impact": f"${monthly_waste}/month waste",
                    "recommendation": f"Downgrade by {unused} licenses"
                })
    
    return {"anomalies": anomalies}

@app.get("/reports/weekly")
def get_weekly_report():
    """Generate automated weekly financial summary"""
    overview = get_dashboard_overview()
    profitability = get_client_profitability()
    licenses = get_license_optimization()
    upsells = get_upsell_opportunities()
    anomalies = detect_anomalies()
    
    return {
        "report_date": datetime.now().isoformat(),
        "period": "Weekly Summary",
        "overview": overview,
        "key_metrics": {
            "total_revenue": overview["total_monthly_revenue"],
            "total_margin": overview["total_margin"],
            "margin_percentage": overview["margin_percentage"],
            "at_risk_clients": len(overview["unprofitable_clients"]),
            "potential_savings": licenses["total_annual_savings"],
            "upsell_potential": sum(opp["total_potential_annual"] for opp in upsells["opportunities"])
        },
        "action_items": generate_action_items(anomalies["anomalies"], upsells["opportunities"])
    }

@app.get("/health")
def health_check():
    """Health check with component status"""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "components": {
            "bedrock_agent": getattr(bedrock_agent, 'agent_available', False),
            "mcp_orchestrator": True,
            "nova_act": True,
            "autonomous_engine": True,
            "alerts_manager": True,
            "vector_store": getattr(vector_store, 'vector_store_available', False),
            "s3_store": getattr(s3_store, 's3_available', False),
            "email_service": True,
            "sustainability_analytics": True,
            "performance_scoreboard": True
        }
    }

# ============================================================================
# AI CFO AUTONOMOUS EMAIL ENDPOINTS
# ============================================================================

@app.post("/api/send-weekly-report")
async def send_weekly_report(request: Request):
    """Send weekly report via REAL EMAIL"""
    try:
        data = await request.json()
        recipient_email = data.get('email', 'cheatercock911@gmail.com')
        report_data = data.get('report_data', {
            'revenue': '10,000',
            'margin': '2,000', 
            'savings': '7,872',
            'upsell': '72,000'
        })
        
        result = email_service.send_weekly_report(recipient_email, report_data)
        return result
        
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

@app.post("/api/send-proposal")
async def send_proposal(request: Request):
    """Send proposal email to client - REAL EMAIL"""
    try:
        data = await request.json()
        client_email = data.get('client_email', 'cheatercock911@gmail.com')
        
        proposal_data = {
            'service_name': data.get('service_name', 'Premium Cybersecurity Package'),
            'client_name': data.get('client_name', 'RetailMax Inc'),
            'monthly_cost': data.get('monthly_cost', '2,000'),
            'annual_cost': data.get('annual_cost', '24,000')
        }
        
        result = email_service.send_proposal_email(client_email, proposal_data)
        return result
        
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

@app.post("/api/execute-optimization")
async def execute_optimization(request: Request):
    """Execute license optimization"""
    try:
        data = await request.json()
        client_name = data.get('client', 'TechCorp Solutions')
        license_type = data.get('license_type', 'Microsoft 365')
        
        autonomous_actions = AutonomousActions()
        result = autonomous_actions.execute_license_optimization(client_name, license_type)
        
        return result
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/api/resolve-anomaly")
async def resolve_anomaly(request: Request):
    """Resolve detected anomaly"""
    try:
        data = await request.json()
        anomaly_type = data.get('type', 'Low Margin')
        client_name = data.get('client', 'TechCorp Solutions')
        impact_amount = data.get('impact', 6000)
        
        autonomous_actions = AutonomousActions()
        result = autonomous_actions.resolve_anomaly(anomaly_type, client_name, impact_amount)
        
        return result
        
    except Exception as e:
        return {"success": False, "error": str(e)}

# ============================================================================
# ADVANCED AI CFO ENDPOINTS
# ============================================================================

@app.post("/ai/comprehensive-analysis/{client_id}")
async def comprehensive_client_analysis(client_id: str, background_tasks: BackgroundTasks):
    """Multi-agent comprehensive analysis using MCP orchestration"""
    client_data = MOCK_CLIENTS.get(client_id)
    if not client_data:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client_data["id"] = client_id
    
    try:
        # Run comprehensive analysis using MCP
        analysis = await mcp_orchestrator.orchestrate_comprehensive_analysis(client_data)
        
        # Store in S3 for historical tracking
        background_tasks.add_task(s3_store.store_analysis_result, "comprehensive", analysis)
        
        # Store in vector store for RAG
        background_tasks.add_task(vector_store.store_client_financial_data, client_id, client_data)
        
        # Send alerts if critical issues detected
        if analysis.get("profitability", {}).get("priority") == "critical":
            background_tasks.add_task(alerts_manager.send_unprofitable_client_alert, client_data)
        
        return analysis
    except Exception as e:
        return {"status": "error", "message": str(e), "mock_analysis": True}

@app.post("/autonomous/auto-downgrade-licenses/{client_id}")
async def autonomous_license_downgrade(client_id: str, background_tasks: BackgroundTasks):
    """Autonomously downgrade unused licenses with guardrails"""
    client_data = MOCK_CLIENTS.get(client_id)
    if not client_data:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client_data["id"] = client_id
    
    # Analyze license usage
    license_analysis = {
        "monthly_savings": 0,
        "potential_savings": 0,
        "optimizations": []
    }
    
    for license_type, license_data in client_data.get("licenses", {}).items():
        unused = license_data["total"] - license_data["used"]
        if unused > 0:
            monthly_savings = unused * license_data["cost_per_license"]
            license_analysis["monthly_savings"] += monthly_savings
            license_analysis["potential_savings"] += monthly_savings * 12
            license_analysis["optimizations"].append({
                "license_type": license_type,
                "unused_count": unused,
                "monthly_waste": monthly_savings,
                "action": "downgrade"
            })
    
    try:
        # Execute autonomous downgrade
        result = await autonomous_engine.auto_downgrade_unused_licenses(
            client_id,
            client_data,
            license_analysis
        )
        return result
    except Exception as e:
        return {"status": "mock_mode", "message": str(e), "license_analysis": license_analysis}

# ============================================================================
# SUSTAINABILITY INSIGHTS ENDPOINTS
# ============================================================================

@app.get("/sustainability/overview")
def get_sustainability_overview():
    """Get portfolio-wide sustainability overview"""
    try:
        return sustainability_analytics.calculate_carbon_footprint()
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.get("/sustainability/client/{client_id}")
def get_client_sustainability(client_id: str):
    """Get detailed sustainability analysis for specific client"""
    try:
        return sustainability_analytics.calculate_carbon_footprint(client_id)
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.get("/sustainability/green-initiatives")
def get_green_initiatives():
    """Get catalog of available green initiatives"""
    try:
        return {
            "initiatives": sustainability_analytics.get_green_initiatives_catalog(),
            "portfolio_impact": sustainability_analytics.calculate_carbon_footprint()
        }
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.post("/sustainability/implement-initiative/{client_id}")
async def implement_green_initiative(client_id: str, initiative: dict):
    """Implement green initiative for client"""
    return {
        "success": True,
        "message": f"Green initiative '{initiative.get('name')}' scheduled for {client_id}",
        "expected_co2_reduction": initiative.get("co2_reduction_kg", 0),
        "implementation_timeline": "30-90 days",
        "estimated_cost": initiative.get("cost_estimate", 0)
    }

# ============================================================================
# PERFORMANCE SCOREBOARD ENDPOINTS
# ============================================================================

@app.get("/performance/scoreboard")
def get_performance_scoreboard():
    """Get overall MSP performance scoreboard"""
    try:
        return performance_scoreboard.get_overall_scoreboard()
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.get("/performance/client/{client_id}")
def get_client_performance(client_id: str):
    """Get detailed performance analysis for specific client"""
    try:
        return performance_scoreboard.get_client_performance_detail(client_id)
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.get("/performance/benchmarks")
def get_performance_benchmarks():
    """Get industry benchmarks and comparisons"""
    try:
        return {
            "industry_benchmarks": performance_scoreboard.industry_benchmarks,
            "portfolio_comparison": performance_scoreboard._get_industry_comparison(),
            "improvement_opportunities": performance_scoreboard._generate_portfolio_recommendations(
                performance_scoreboard.get_overall_scoreboard()["scoreboard"]
            )
        }
    except Exception as e:
        return {"error": str(e), "mock_data": True}

@app.post("/performance/set-goals/{client_id}")
async def set_performance_goals(client_id: str, goals: dict):
    """Set performance improvement goals for client"""
    return {
        "success": True,
        "message": f"Performance goals set for client {client_id}",
        "goals": goals,
        "tracking_started": datetime.now().isoformat(),
        "next_review": (datetime.now() + timedelta(days=30)).isoformat()
    }

@app.get("/system/stats")
def get_system_stats():
    """Get overall system statistics"""
    return {
        "system_health": "operational",
        "components": {
            "bedrock_agent": {
                "available": getattr(bedrock_agent, 'agent_available', False),
                "status": "operational" if getattr(bedrock_agent, 'agent_available', False) else "mock_mode"
            },
            "mcp_orchestrator": {
                "agents": len(getattr(mcp_orchestrator, 'agents', [])),
                "tasks_completed": len([t for t in getattr(mcp_orchestrator, 'tasks', {}).values() if getattr(t, 'status', '') == "completed"])
            },
            "nova_act": {
                "vendors_supported": len(getattr(nova_act, 'tracked_vendors', [])),
                "tracking_active": True
            },
            "autonomous_engine": {
                "pending_approvals": len(autonomous_engine.get_pending_approvals()) if hasattr(autonomous_engine, 'get_pending_approvals') else 0,
                "actions_completed": len(getattr(autonomous_engine, 'actions_history', []))
            },
            "alerts_manager": {
                "total_alerts": len(getattr(alerts_manager, 'alerts_history', []))
            },
            "vector_store": getattr(vector_store, 'get_storage_stats', lambda: {"status": "mock"})(),
            "s3_store": getattr(s3_store, 'get_storage_stats', lambda: {"status": "mock"})(),
            "email_service": True,
            "sustainability_analytics": True,
            "performance_scoreboard": True
        },
        "version": "2.0.0",
        "features": {
            "ai_reasoning": getattr(bedrock_agent, 'agent_available', False),
            "multi_agent_coordination": True,
            "browser_automation": True,
            "autonomous_actions": True,
            "real_time_alerts": True,
            "rag_analytics": True,
            "cloud_storage": True,
            "real_email_delivery": True,
            "sustainability_tracking": True,
            "performance_benchmarking": True
        }
    }

# Helper functions
def get_profitability_recommendation(client_data):
    if client_data["margin"] < 0:
        return "URGENT: Renegotiate contract or consider termination"
    elif client_data["margin"] < 500:
        return "Review service delivery efficiency and pricing"
    else:
        return "Healthy margin - consider upsell opportunities"

def simulate_client_churn(client_id, client_data, parameters):
    months_ahead = parameters.get("months", 3)
    revenue_impact = client_data["monthly_revenue"] * months_ahead
    cost_savings = client_data["monthly_cost"] * months_ahead
    net_impact = revenue_impact - cost_savings
    
    return {
        "scenario": "Client Churn",
        "client_id": client_id,
        "timeframe_months": months_ahead,
        "revenue_loss": revenue_impact,
        "cost_savings": cost_savings,
        "net_impact": -net_impact if net_impact > 0 else abs(net_impact),
        "recommendation": "Focus on client retention" if net_impact > 0 else "Acceptable loss due to unprofitability"
    }

def simulate_service_addition(client_id, client_data, parameters):
    service_revenue = parameters.get("monthly_revenue", 1000)
    service_cost = parameters.get("monthly_cost", 600)
    months = parameters.get("months", 12)
    
    new_margin = (client_data["margin"] + (service_revenue - service_cost)) * months
    
    return {
        "scenario": "Service Addition",
        "client_id": client_id,
        "new_service_revenue": service_revenue * months,
        "new_service_cost": service_cost * months,
        "annual_margin_improvement": (service_revenue - service_cost) * months,
        "new_total_margin": new_margin,
        "roi_percentage": round(((service_revenue - service_cost) / service_cost) * 100, 1)
    }

def simulate_price_increase(client_id, client_data, parameters):
    increase_percentage = parameters.get("percentage", 10)
    new_revenue = client_data["monthly_revenue"] * (1 + increase_percentage / 100)
    margin_improvement = (new_revenue - client_data["monthly_revenue"]) * 12
    
    return {
        "scenario": "Price Increase",
        "client_id": client_id,
        "current_monthly_revenue": client_data["monthly_revenue"],
        "new_monthly_revenue": new_revenue,
        "increase_percentage": increase_percentage,
        "annual_margin_improvement": margin_improvement,
        "churn_risk": "low" if increase_percentage <= 5 else "medium" if increase_percentage <= 15 else "high"
    }

def generate_action_items(anomalies, upsell_opportunities):
    actions = []
    
    # High priority anomalies
    for anomaly in anomalies:
        if anomaly["severity"] == "high":
            actions.append({
                "priority": "high",
                "action": anomaly["recommendation"],
                "client": anomaly["client_name"],
                "impact": anomaly["impact"]
            })
    
    # Top upsell opportunities
    for opp in upsell_opportunities[:3]:  # Top 3
        actions.append({
            "priority": "medium",
            "action": f"Present upsell proposal to {opp['client_name']}",
            "client": opp["client_name"],
            "impact": f"${opp['total_potential_annual']} annual potential"
        })
    
    return actions

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
