"""
Sustainability Analytics Module
Environmental impact tracking and carbon footprint analysis for MSPs
"""
import logging
from typing import Dict, List, Any
from datetime import datetime, timedelta
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SustainabilityAnalytics:
    """
    Sustainability and Environmental Impact Analytics
    Tracks carbon footprint, energy usage, and green initiatives for MSPs
    """
    
    def __init__(self):
        self.sustainability_data = self._initialize_sustainability_data()
        logger.info("✅ Sustainability Analytics initialized")
    
    def _initialize_sustainability_data(self) -> Dict[str, Any]:
        """Initialize mock sustainability data for clients"""
        return {
            "client_x": {
                "name": "TechCorp Solutions",
                "monthly_kwh": 2400,
                "server_count": 15,
                "cloud_usage_gb": 850,
                "paper_usage_kg": 45,
                "travel_km": 1200,
                "green_initiatives": ["LED lighting", "Paperless billing"],
                "carbon_offset_credits": 0
            },
            "client_y": {
                "name": "RetailMax Inc", 
                "monthly_kwh": 1800,
                "server_count": 8,
                "cloud_usage_gb": 1200,
                "paper_usage_kg": 32,
                "travel_km": 800,
                "green_initiatives": ["Remote work policy", "Cloud migration"],
                "carbon_offset_credits": 50
            },
            "client_z": {
                "name": "HealthFirst Medical",
                "monthly_kwh": 3200,
                "server_count": 22,
                "cloud_usage_gb": 2100,
                "paper_usage_kg": 65,
                "travel_km": 1600,
                "green_initiatives": ["Solar panels", "Virtualization", "Recycling program"],
                "carbon_offset_credits": 120
            }
        }
    
    def calculate_carbon_footprint(self, client_id: str = None) -> Dict[str, Any]:
        """Calculate carbon footprint for client or all clients"""
        if client_id:
            return self._calculate_client_footprint(client_id)
        else:
            return self._calculate_total_footprint()
    
    def _calculate_client_footprint(self, client_id: str) -> Dict[str, Any]:
        """Calculate carbon footprint for specific client"""
        client_data = self.sustainability_data.get(client_id, {})
        if not client_data:
            return {"error": "Client not found"}
        
        # Carbon emission factors (kg CO2e)
        electricity_factor = 0.4  # kg CO2e per kWh
        server_factor = 0.5  # kg CO2e per server per day
        cloud_factor = 0.0005  # kg CO2e per GB
        paper_factor = 0.9  # kg CO2e per kg paper
        travel_factor = 0.21  # kg CO2e per km
        
        # Calculate emissions
        electricity_emissions = client_data["monthly_kwh"] * electricity_factor
        server_emissions = client_data["server_count"] * server_factor * 30  # monthly
        cloud_emissions = client_data["cloud_usage_gb"] * cloud_factor
        paper_emissions = client_data["paper_usage_kg"] * paper_factor
        travel_emissions = client_data["travel_km"] * travel_factor
        
        total_emissions = (electricity_emissions + server_emissions + 
                          cloud_emissions + paper_emissions + travel_emissions)
        
        # Apply carbon offset credits
        net_emissions = max(0, total_emissions - client_data["carbon_offset_credits"])
        
        return {
            "client_id": client_id,
            "client_name": client_data["name"],
            "carbon_footprint": {
                "electricity": round(electricity_emissions, 2),
                "servers": round(server_emissions, 2),
                "cloud_usage": round(cloud_emissions, 2),
                "paper": round(paper_emissions, 2),
                "travel": round(travel_emissions, 2),
                "total_gross": round(total_emissions, 2),
                "carbon_credits": client_data["carbon_offset_credits"],
                "net_emissions": round(net_emissions, 2)
            },
            "sustainability_score": self._calculate_sustainability_score(client_data, net_emissions),
            "green_initiatives": client_data["green_initiatives"],
            "recommendations": self._generate_sustainability_recommendations(client_data, net_emissions),
            "benchmark": self._get_industry_benchmark(net_emissions)
        }
    
    def _calculate_total_footprint(self) -> Dict[str, Any]:
        """Calculate total carbon footprint across all clients"""
        total_emissions = 0
        total_credits = 0
        client_summaries = []
        
        for client_id, client_data in self.sustainability_data.items():
            client_footprint = self._calculate_client_footprint(client_id)
            total_emissions += client_footprint["carbon_footprint"]["total_gross"]
            total_credits += client_data["carbon_offset_credits"]
            client_summaries.append({
                "client_id": client_id,
                "name": client_data["name"],
                "emissions": client_footprint["carbon_footprint"]["net_emissions"],
                "score": client_footprint["sustainability_score"]
            })
        
        net_total = max(0, total_emissions - total_credits)
        
        return {
            "portfolio_footprint": {
                "total_gross_emissions": round(total_emissions, 2),
                "total_carbon_credits": total_credits,
                "net_emissions": round(net_total, 2),
                "clients_analyzed": len(self.sustainability_data)
            },
            "client_summaries": sorted(client_summaries, key=lambda x: x["emissions"], reverse=True),
            "portfolio_score": round(sum(c["score"] for c in client_summaries) / len(client_summaries), 1),
            "environmental_impact": self._assess_environmental_impact(net_total),
            "sustainability_trends": self._generate_sustainability_trends()
        }
    
    def _calculate_sustainability_score(self, client_data: Dict, net_emissions: float) -> float:
        """Calculate sustainability score (0-100, higher is better)"""
        base_score = 50
        
        # Penalize high emissions (per server)
        emission_penalty = (net_emissions / client_data["server_count"]) * 0.5
        
        # Reward green initiatives
        initiative_bonus = len(client_data["green_initiatives"]) * 5
        
        # Reward carbon credits
        credit_bonus = min(client_data["carbon_offset_credits"] * 0.1, 20)
        
        # Reward efficient cloud usage
        cloud_efficiency = 100 - (client_data["cloud_usage_gb"] / client_data["server_count"])
        efficiency_bonus = max(0, cloud_efficiency * 0.1)
        
        final_score = base_score - emission_penalty + initiative_bonus + credit_bonus + efficiency_bonus
        return round(min(max(final_score, 0), 100), 1)
    
    def _generate_sustainability_recommendations(self, client_data: Dict, net_emissions: float) -> List[str]:
        """Generate sustainability recommendations"""
        recommendations = []
        
        if client_data["monthly_kwh"] > 2000:
            recommendations.append("Consider switching to renewable energy sources")
            recommendations.append("Implement energy-efficient LED lighting")
        
        if client_data["server_count"] > 10 and "Virtualization" not in client_data["green_initiatives"]:
            recommendations.append("Implement server virtualization to reduce hardware needs")
        
        if client_data["cloud_usage_gb"] > 1500:
            recommendations.append("Optimize cloud storage with data lifecycle management")
        
        if client_data["paper_usage_kg"] > 40:
            recommendations.append("Transition to paperless operations")
        
        if client_data["travel_km"] > 1000:
            recommendations.append("Increase remote work and virtual meetings")
        
        if client_data["carbon_offset_credits"] == 0:
            recommendations.append("Invest in verified carbon offset programs")
        
        if net_emissions > 500:
            recommendations.append("Set science-based emissions reduction targets")
        
        return recommendations
    
    def _get_industry_benchmark(self, net_emissions: float) -> Dict[str, Any]:
        """Get industry benchmark comparison"""
        # Industry average: 450 kg CO2e per month for similar MSP clients
        industry_average = 450
        
        performance = "Below Average"
        if net_emissions < industry_average * 0.7:
            performance = "Excellent"
        elif net_emissions < industry_average * 0.9:
            performance = "Good"
        elif net_emissions < industry_average * 1.1:
            performance = "Average"
        
        return {
            "industry_average": industry_average,
            "client_emissions": net_emissions,
            "performance": performance,
            "percentile": max(5, min(95, round(100 - (net_emissions / industry_average * 100), 0)))
        }
    
    def _assess_environmental_impact(self, total_emissions: float) -> Dict[str, Any]:
        """Assess overall environmental impact"""
        trees_equivalent = round(total_emissions / 21.77, 1)  # Trees needed to offset CO2
        car_miles_equivalent = round(total_emissions / 0.4, 0)  # Miles driven by average car
        
        return {
            "total_co2_kg": total_emissions,
            "trees_to_offset": trees_equivalent,
            "car_miles_equivalent": car_miles_equivalent,
            "impact_level": "High" if total_emissions > 1000 else "Medium" if total_emissions > 500 else "Low"
        }
    
    def _generate_sustainability_trends(self) -> Dict[str, Any]:
        """Generate sustainability trends data"""
        return {
            "emission_trend": "decreasing",
            "trend_percentage": -8.5,
            "green_initiative_adoption": 73,
            "carbon_offset_growth": 45,
            "industry_ranking": "Top 25%"
        }
    
    def get_green_initiatives_catalog(self) -> List[Dict[str, Any]]:
        """Get catalog of available green initiatives"""
        return [
            {
                "name": "Solar Panel Installation",
                "category": "Energy",
                "co2_reduction_kg": 300,
                "cost_estimate": 15000,
                "roi_months": 36,
                "difficulty": "Medium"
            },
            {
                "name": "Server Virtualization",
                "category": "Infrastructure",
                "co2_reduction_kg": 120,
                "cost_estimate": 5000,
                "roi_months": 18,
                "difficulty": "Low"
            },
            {
                "name": "Cloud Migration",
                "category": "Infrastructure", 
                "co2_reduction_kg": 200,
                "cost_estimate": 8000,
                "roi_months": 24,
                "difficulty": "Medium"
            },
            {
                "name": "LED Lighting Upgrade",
                "category": "Energy",
                "co2_reduction_kg": 80,
                "cost_estimate": 2000,
                "roi_months": 12,
                "difficulty": "Low"
            },
            {
                "name": "Paperless Operations",
                "category": "Operations",
                "co2_reduction_kg": 50,
                "cost_estimate": 1000,
                "roi_months": 6,
                "difficulty": "Low"
            },
            {
                "name": "Carbon Offset Program",
                "category": "Offset",
                "co2_reduction_kg": 500,
                "cost_estimate": 1200,
                "roi_months": 0,
                "difficulty": "Low"
            }
        ]

# Global sustainability analytics instance
sustainability_analytics = SustainabilityAnalytics()
