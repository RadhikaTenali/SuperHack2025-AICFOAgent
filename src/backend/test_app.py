import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "AI CFO Agent" in response.json()["message"]

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "healthy"

def test_dashboard_overview():
    """Test the dashboard overview endpoint"""
    response = client.get("/dashboard/overview")
    assert response.status_code == 200
    data = response.json()
    assert "total_monthly_revenue" in data
    assert "total_margin" in data
    assert "client_count" in data
    assert "unprofitable_clients" in data

def test_client_profitability():
    """Test the client profitability endpoint"""
    response = client.get("/profitability/clients")
    assert response.status_code == 200
    data = response.json()
    assert "clients" in data
    assert len(data["clients"]) > 0
    
    # Check client structure
    client_data = data["clients"][0]
    assert "id" in client_data
    assert "name" in client_data
    assert "margin" in client_data
    assert "risk_level" in client_data

def test_license_optimization():
    """Test the license optimization endpoint"""
    response = client.get("/licenses/optimization")
    assert response.status_code == 200
    data = response.json()
    assert "optimizations" in data
    assert "total_annual_savings" in data

def test_upsell_opportunities():
    """Test the upsell opportunities endpoint"""
    response = client.get("/upsell/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert "opportunities" in data

def test_anomaly_detection():
    """Test the anomaly detection endpoint"""
    response = client.get("/anomalies/detect")
    assert response.status_code == 200
    data = response.json()
    assert "anomalies" in data

def test_weekly_report():
    """Test the weekly report endpoint"""
    response = client.get("/reports/weekly")
    assert response.status_code == 200
    data = response.json()
    assert "report_date" in data
    assert "key_metrics" in data
    assert "action_items" in data

def test_scenario_simulation_client_churn():
    """Test scenario simulation for client churn"""
    payload = {
        "scenario_type": "client_churn",
        "client_id": "client_x",
        "parameters": {"months": 3}
    }
    response = client.post("/scenario/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "scenario" in data
    assert "revenue_loss" in data
    assert "net_impact" in data

def test_scenario_simulation_service_addition():
    """Test scenario simulation for service addition"""
    payload = {
        "scenario_type": "service_addition",
        "client_id": "client_y",
        "parameters": {
            "monthly_revenue": 1000,
            "monthly_cost": 600,
            "months": 12
        }
    }
    response = client.post("/scenario/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "scenario" in data
    assert "annual_margin_improvement" in data

def test_scenario_simulation_price_increase():
    """Test scenario simulation for price increase"""
    payload = {
        "scenario_type": "price_increase",
        "client_id": "client_z",
        "parameters": {"percentage": 10}
    }
    response = client.post("/scenario/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "scenario" in data
    assert "churn_risk" in data

def test_scenario_simulation_invalid_client():
    """Test scenario simulation with invalid client"""
    payload = {
        "scenario_type": "client_churn",
        "client_id": "invalid_client",
        "parameters": {"months": 3}
    }
    response = client.post("/scenario/simulate", json=payload)
    assert response.status_code == 404

def test_scenario_simulation_invalid_type():
    """Test scenario simulation with invalid scenario type"""
    payload = {
        "scenario_type": "invalid_scenario",
        "client_id": "client_x",
        "parameters": {}
    }
    response = client.post("/scenario/simulate", json=payload)
    assert response.status_code == 400

if __name__ == "__main__":
    pytest.main([__file__])