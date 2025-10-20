"""
Performance Scoreboard Module
MSP benchmark metrics and performance tracking
"""
import logging
from typing import Dict, List, Any
from datetime import datetime, timedelta
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformanceScoreboard:
    """
    MSP Performance Scoreboard and Benchmarking System
    Tracks KPIs, industry benchmarks, and performance rankings
    """
    
    def __init__(self):
        self.performance_data = self._initialize_performance_data()
        self.industry_benchmarks = self._load_industry_benchmarks()
        logger.info("✅ Performance Scoreboard initialized")
    
    def _initialize_performance_data(self) -> Dict[str, Any]:
        """Initialize performance metrics for clients"""
        return {
            "client_x": {
                "name": "TechCorp Solutions",
                "monthly_revenue": 1500,
                "monthly_cost": 2000,
                "margin": -500,
                "tickets_last_month": 45,
                "avg_resolution_time": 18.5,  # hours
                "customer_satisfaction": 3.2,  # out of 5
                "uptime_percentage": 97.8,
                "security_incidents": 5,
                "license_utilization": 60,
                "contract_value": 18000,
                "client_tenure_months": 14,
                "team_hours_monthly": 85,
                "automation_score": 25
            },
            "client_y": {
                "name": "RetailMax Inc",
                "monthly_revenue": 3500,
                "monthly_cost": 2800,
                "margin": 700,
                "tickets_last_month": 12,
                "avg_resolution_time": 8.2,
                "customer_satisfaction": 4.1,
                "uptime_percentage": 99.2,
                "security_incidents": 8,
                "license_utilization": 96,
                "contract_value": 42000,
                "client_tenure_months": 28,
                "team_hours_monthly": 45,
                "automation_score": 65
            },
            "client_z": {
                "name": "HealthFirst Medical",
                "monthly_revenue": 5000,
                "monthly_cost": 3200,
                "margin": 1800,
                "tickets_last_month": 8,
                "avg_resolution_time": 4.8,
                "customer_satisfaction": 4.6,
                "uptime_percentage": 99.7,
                "security_incidents": 1,
                "license_utilization": 95,
                "contract_value": 60000,
                "client_tenure_months": 36,
                "team_hours_monthly": 38,
                "automation_score": 85
            }
        }
    
    def _load_industry_benchmarks(self) -> Dict[str, Any]:
        """Load industry benchmark data"""
        return {
            "avg_margin_percentage": 22,
            "avg_resolution_time": 12.5,
            "avg_customer_satisfaction": 4.0,
            "avg_uptime": 99.1,
            "avg_security_incidents": 3,
            "avg_license_utilization": 78,
            "avg_automation_score": 55,
            "top_quartile_thresholds": {
                "margin_percentage": 30,
                "resolution_time": 6,
                "customer_satisfaction": 4.5,
                "uptime": 99.5,
                "security_incidents": 1,
                "license_utilization": 90,
                "automation_score": 75
            }
        }
    
    def get_overall_scoreboard(self) -> Dict[str, Any]:
        """Get overall MSP performance scoreboard"""
        client_scores = []
        
        for client_id, client_data in self.performance_data.items():
            score = self._calculate_performance_score(client_data)
            client_scores.append({
                "client_id": client_id,
                "name": client_data["name"],
                "overall_score": score["overall_score"],
                "ranking": score["ranking"],
                "key_strengths": score["key_strengths"],
                "improvement_areas": score["improvement_areas"],
                "trend": self._get_performance_trend(client_id)
            })
        
        # Sort by overall score
        client_scores.sort(key=lambda x: x["overall_score"], reverse=True)
        
        # Add rankings
        for i, client in enumerate(client_scores):
            client["position"] = i + 1
        
        return {
            "scoreboard": client_scores,
            "portfolio_summary": self._calculate_portfolio_summary(client_scores),
            "industry_comparison": self._get_industry_comparison(),
            "performance_trends": self._get_portfolio_trends(),
            "recommendations": self._generate_portfolio_recommendations(client_scores)
        }
    
    def get_client_performance_detail(self, client_id: str) -> Dict[str, Any]:
        """Get detailed performance metrics for specific client"""
        client_data = self.performance_data.get(client_id, {})
        if not client_data:
            return {"error": "Client not found"}
        
        score_breakdown = self._calculate_performance_score(client_data)
        
        return {
            "client_info": {
                "id": client_id,
                "name": client_data["name"],
                "contract_value": client_data["contract_value"],
                "tenure_months": client_data["client_tenure_months"]
            },
            "performance_metrics": {
                "financial": {
                    "monthly_revenue": client_data["monthly_revenue"],
                    "monthly_margin": client_data["margin"],
                    "margin_percentage": round((client_data["margin"] / client_data["monthly_revenue"]) * 100, 1),
                    "benchmark_comparison": self._compare_to_benchmark("margin_percentage", 
                                                                    (client_data["margin"] / client_data["monthly_revenue"]) * 100)
                },
                "operational": {
                    "avg_resolution_time": client_data["avg_resolution_time"],
                    "tickets_per_month": client_data["tickets_last_month"],
                    "uptime_percentage": client_data["uptime_percentage"],
                    "team_efficiency": round(client_data["monthly_revenue"] / client_data["team_hours_monthly"], 2),
                    "automation_score": client_data["automation_score"]
                },
                "quality": {
                    "customer_satisfaction": client_data["customer_satisfaction"],
                    "security_score": max(0, 100 - (client_data["security_incidents"] * 10)),
                    "license_utilization": client_data["license_utilization"]
                }
            },
            "score_breakdown": score_breakdown,
            "benchmarks": self._get_client_benchmarks(client_data),
            "improvement_plan": self._generate_improvement_plan(client_data, score_breakdown),
            "achievements": self._identify_achievements(client_data)
        }
    
    def _calculate_performance_score(self, client_data: Dict) -> Dict[str, Any]:
        """Calculate comprehensive performance score"""
        # Financial Performance (30%)
        margin_pct = (client_data["margin"] / client_data["monthly_revenue"]) * 100
        financial_score = min(100, max(0, (margin_pct + 50) * 2))  # Normalize to 0-100
        
        # Operational Excellence (25%)
        resolution_score = max(0, 100 - (client_data["avg_resolution_time"] - 2) * 5)
        uptime_score = (client_data["uptime_percentage"] - 95) * 20  # 95% = 0, 100% = 100
        operational_score = (resolution_score + uptime_score) / 2
        
        # Customer Satisfaction (20%)
        satisfaction_score = client_data["customer_satisfaction"] * 20  # 5.0 = 100
        
        # Security & Compliance (15%)
        security_score = max(0, 100 - client_data["security_incidents"] * 15)
        
        # Efficiency & Automation (10%)
        efficiency_score = min(100, client_data["automation_score"] + client_data["license_utilization"])
        
        # Calculate weighted overall score
        overall_score = (
            financial_score * 0.30 +
            operational_score * 0.25 +
            satisfaction_score * 0.20 +
            security_score * 0.15 +
            efficiency_score * 0.10
        )
        
        # Determine ranking
        if overall_score >= 80:
            ranking = "Platinum"
        elif overall_score >= 65:
            ranking = "Gold"
        elif overall_score >= 50:
            ranking = "Silver"
        else:
            ranking = "Bronze"
        
        # Identify strengths and weaknesses
        scores = {
            "Financial": financial_score,
            "Operational": operational_score,
            "Customer Satisfaction": satisfaction_score,
            "Security": security_score,
            "Efficiency": efficiency_score
        }
        
        key_strengths = [k for k, v in scores.items() if v >= 75][:2]
        improvement_areas = [k for k, v in scores.items() if v < 60][:2]
        
        return {
            "overall_score": round(overall_score, 1),
            "ranking": ranking,
            "score_breakdown": {
                "financial": round(financial_score, 1),
                "operational": round(operational_score, 1),
                "satisfaction": round(satisfaction_score, 1),
                "security": round(security_score, 1),
                "efficiency": round(efficiency_score, 1)
            },
            "key_strengths": key_strengths,
            "improvement_areas": improvement_areas
        }
    
    def _calculate_portfolio_summary(self, client_scores: List) -> Dict[str, Any]:
        """Calculate portfolio-wide performance summary"""
        total_clients = len(client_scores)
        avg_score = sum(c["overall_score"] for c in client_scores) / total_clients
        
        rankings = {"Platinum": 0, "Gold": 0, "Silver": 0, "Bronze": 0}
        for client in client_scores:
            rankings[client["ranking"]] += 1
        
        return {
            "total_clients": total_clients,
            "average_score": round(avg_score, 1),
            "rankings_distribution": rankings,
            "top_performer": client_scores[0]["name"] if client_scores else None,
            "portfolio_health": "Excellent" if avg_score >= 75 else "Good" if avg_score >= 60 else "Needs Attention"
        }
    
    def _get_industry_comparison(self) -> Dict[str, Any]:
        """Compare portfolio to industry benchmarks"""
        portfolio_metrics = self._calculate_portfolio_metrics()
        
        comparisons = {}
        for metric, value in portfolio_metrics.items():
            benchmark = self.industry_benchmarks.get(f"avg_{metric}")
            if benchmark:
                difference = ((value - benchmark) / benchmark) * 100
                comparisons[metric] = {
                    "portfolio_value": value,
                    "industry_average": benchmark,
                    "difference_percent": round(difference, 1),
                    "performance": "Above Average" if difference > 5 else "Below Average" if difference < -5 else "Average"
                }
        
        return comparisons
    
    def _calculate_portfolio_metrics(self) -> Dict[str, float]:
        """Calculate portfolio-wide metrics"""
        clients = list(self.performance_data.values())
        total_clients = len(clients)
        
        return {
            "margin_percentage": sum((c["margin"] / c["monthly_revenue"]) * 100 for c in clients) / total_clients,
            "resolution_time": sum(c["avg_resolution_time"] for c in clients) / total_clients,
            "customer_satisfaction": sum(c["customer_satisfaction"] for c in clients) / total_clients,
            "uptime": sum(c["uptime_percentage"] for c in clients) / total_clients,
            "security_incidents": sum(c["security_incidents"] for c in clients) / total_clients,
            "license_utilization": sum(c["license_utilization"] for c in clients) / total_clients,
            "automation_score": sum(c["automation_score"] for c in clients) / total_clients
        }
    
    def _get_performance_trend(self, client_id: str) -> str:
        """Get performance trend for client (mock data)"""
        trends = ["improving", "stable", "declining"]
        return random.choice(trends)
    
    def _get_portfolio_trends(self) -> Dict[str, Any]:
        """Get portfolio performance trends"""
        return {
            "overall_trend": "improving",
            "trend_percentage": 8.5,
            "key_improvements": ["Customer satisfaction up 12%", "Resolution time down 15%"],
            "areas_of_concern": ["Security incidents increased", "License utilization plateaued"]
        }
    
    def _generate_portfolio_recommendations(self, client_scores: List) -> List[str]:
        """Generate portfolio-wide recommendations"""
        recommendations = []
        
        # Analyze bronze/silver clients
        underperformers = [c for c in client_scores if c["ranking"] in ["Bronze", "Silver"]]
        if len(underperformers) > len(client_scores) * 0.4:
            recommendations.append("Focus on improving bottom 40% of clients through targeted service optimization")
        
        # Top performers
        top_performers = [c for c in client_scores if c["ranking"] == "Platinum"]
        if top_performers:
            recommendations.append(f"Leverage best practices from {top_performers[0]['name']} across other clients")
        
        recommendations.extend([
            "Implement automated monitoring to improve resolution times",
            "Develop client success programs to boost satisfaction scores",
            "Invest in security training to reduce incident rates"
        ])
        
        return recommendations
    
    def _compare_to_benchmark(self, metric: str, value: float) -> Dict[str, Any]:
        """Compare specific metric to industry benchmark"""
        benchmark = self.industry_benchmarks.get(f"avg_{metric}")
        if not benchmark:
            return {}
        
        difference_pct = ((value - benchmark) / benchmark) * 100
        
        return {
            "benchmark_value": benchmark,
            "client_value": value,
            "difference_percent": round(difference_pct, 1),
            "percentile": min(95, max(5, 50 + difference_pct))
        }
    
    def _get_client_benchmarks(self, client_data: Dict) -> Dict[str, Any]:
        """Get benchmark comparisons for all client metrics"""
        metrics = {
            "margin_percentage": (client_data["margin"] / client_data["monthly_revenue"]) * 100,
            "resolution_time": client_data["avg_resolution_time"],
            "customer_satisfaction": client_data["customer_satisfaction"],
            "uptime": client_data["uptime_percentage"],
            "license_utilization": client_data["license_utilization"]
        }
        
        benchmarks = {}
        for metric, value in metrics.items():
            benchmarks[metric] = self._compare_to_benchmark(metric, value)
        
        return benchmarks
    
    def _generate_improvement_plan(self, client_data: Dict, score_breakdown: Dict) -> List[Dict[str, Any]]:
        """Generate specific improvement plan for client"""
        improvements = []
        
        # Financial improvements
        if score_breakdown["score_breakdown"]["financial"] < 60:
            improvements.append({
                "area": "Financial Performance",
                "priority": "High",
                "action": "Renegotiate contract terms or optimize service delivery costs",
                "expected_impact": f"+${abs(client_data['margin']) * 0.5}/month margin improvement",
                "timeline": "30-60 days"
            })
        
        # Operational improvements
        if score_breakdown["score_breakdown"]["operational"] < 60:
            improvements.append({
                "area": "Operational Excellence",
                "priority": "Medium",
                "action": "Implement automated monitoring and ticketing prioritization",
                "expected_impact": f"-{client_data['avg_resolution_time'] * 0.3:.1f} hours avg resolution time",
                "timeline": "60-90 days"
            })
        
        # Security improvements
        if client_data["security_incidents"] > 2:
            improvements.append({
                "area": "Security & Compliance",
                "priority": "High",
                "action": "Deploy advanced threat detection and employee training",
                "expected_impact": f"-{client_data['security_incidents'] // 2} incidents per month",
                "timeline": "30-45 days"
            })
        
        return improvements
    
    def _identify_achievements(self, client_data: Dict) -> List[str]:
        """Identify client achievements and milestones"""
        achievements = []
        
        if client_data["uptime_percentage"] >= 99.5:
            achievements.append("🏆 High Availability Champion (99.5%+ uptime)")
        
        if client_data["customer_satisfaction"] >= 4.5:
            achievements.append("⭐ Customer Excellence Award (4.5+ satisfaction)")
        
        if client_data["security_incidents"] <= 1:
            achievements.append("🔒 Security Excellence (≤1 incident/month)")
        
        if client_data["license_utilization"] >= 90:
            achievements.append("💎 License Efficiency Master (90%+ utilization)")
        
        if client_data["client_tenure_months"] >= 24:
            achievements.append("🤝 Loyal Partnership (2+ years)")
        
        return achievements

# Global performance scoreboard instance
performance_scoreboard = PerformanceScoreboard()
