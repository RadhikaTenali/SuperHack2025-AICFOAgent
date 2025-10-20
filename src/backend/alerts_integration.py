"""
Slack/Teams Alerts Integration
Real-time notifications for critical financial events
"""
import logging
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum
import requests
import aiohttp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AlertPriority(Enum):
    """Alert priority levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class AlertChannel(Enum):
    """Alert delivery channels"""
    SLACK = "slack"
    TEAMS = "teams"
    EMAIL = "email"
    SUPEROPS = "superops"


class AlertsManager:
    """
    Manage real-time alerts to Slack, Teams, and SuperOps
    """
    
    def __init__(self):
        self.slack_webhook_url = None  # Set from environment
        self.teams_webhook_url = None  # Set from environment
        self.alerts_history = []
        self.alert_rules = self._initialize_alert_rules()
        logger.info("✅ Alerts Manager initialized")
    
    def _initialize_alert_rules(self) -> Dict[str, Any]:
        """Define alert rules and thresholds"""
        return {
            "unprofitable_client": {
                "enabled": True,
                "priority": AlertPriority.CRITICAL,
                "channels": [AlertChannel.SLACK, AlertChannel.TEAMS],
                "threshold": {"margin": 0},
                "message_template": "🚨 CRITICAL: Client {client_name} is operating at ${margin}/month loss"
            },
            "high_churn_risk": {
                "enabled": True,
                "priority": AlertPriority.HIGH,
                "channels": [AlertChannel.SLACK],
                "threshold": {"churn_probability": 20},
                "message_template": "⚠️ HIGH RISK: Client {client_name} has {churn_probability}% churn risk"
            },
            "license_waste_detected": {
                "enabled": True,
                "priority": AlertPriority.MEDIUM,
                "channels": [AlertChannel.SLACK],
                "threshold": {"monthly_waste": 500},
                "message_template": "💰 SAVINGS OPPORTUNITY: ${monthly_waste}/month in unused licenses detected for {client_name}"
            },
            "upsell_opportunity": {
                "enabled": True,
                "priority": AlertPriority.MEDIUM,
                "channels": [AlertChannel.SLACK],
                "threshold": {"confidence": 80},
                "message_template": "📈 UPSELL: {service_name} opportunity for {client_name} - ${annual_value}/year potential"
            },
            "anomaly_detected": {
                "enabled": True,
                "priority": AlertPriority.HIGH,
                "channels": [AlertChannel.SLACK, AlertChannel.TEAMS],
                "threshold": {},
                "message_template": "🔍 ANOMALY: {anomaly_type} detected for {client_name} - {description}"
            },
            "cashflow_risk": {
                "enabled": True,
                "priority": AlertPriority.CRITICAL,
                "channels": [AlertChannel.SLACK, AlertChannel.TEAMS],
                "threshold": {"projected_loss": 5000},
                "message_template": "💸 CASHFLOW ALERT: Projected ${projected_loss} loss in {timeframe} for {client_name}"
            }
        }
    
    async def send_unprofitable_client_alert(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert for unprofitable client"""
        alert = {
            "type": "unprofitable_client",
            "priority": AlertPriority.CRITICAL,
            "client_name": client_data.get("name"),
            "client_id": client_data.get("id"),
            "margin": client_data.get("margin"),
            "monthly_revenue": client_data.get("monthly_revenue"),
            "monthly_cost": client_data.get("monthly_cost"),
            "recommended_action": "Renegotiate contract or consider termination",
            "timestamp": datetime.now().isoformat()
        }
        
        # Send to Slack
        slack_result = await self._send_slack_alert(alert)
        
        # Send to Teams
        teams_result = await self._send_teams_alert(alert)
        
        # Record alert
        self.alerts_history.append(alert)
        
        logger.info(f"🚨 CRITICAL ALERT sent: {client_data.get('name')} unprofitable")
        
        return {
            "alert_sent": True,
            "channels": ["slack", "teams"],
            "alert_id": f"alert_{datetime.now().timestamp()}",
            "slack_status": slack_result,
            "teams_status": teams_result
        }
    
    async def send_license_optimization_alert(self, client_data: Dict[str, Any], 
                                             savings_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert for license optimization opportunity"""
        monthly_waste = savings_data.get("monthly_savings", 0)
        annual_savings = savings_data.get("potential_savings", 0)
        
        alert = {
            "type": "license_waste_detected",
            "priority": AlertPriority.MEDIUM,
            "client_name": client_data.get("name"),
            "client_id": client_data.get("id"),
            "monthly_waste": monthly_waste,
            "annual_savings": annual_savings,
            "optimizations": savings_data.get("optimizations", []),
            "recommended_action": "Review and approve license downgrade",
            "timestamp": datetime.now().isoformat()
        }
        
        slack_result = await self._send_slack_alert(alert)
        
        logger.info(f"💰 SAVINGS ALERT sent: ${annual_savings:.2f}/year opportunity for {client_data.get('name')}")
        
        return {
            "alert_sent": True,
            "channels": ["slack"],
            "annual_savings": annual_savings,
            "slack_status": slack_result
        }
    
    async def send_upsell_opportunity_alert(self, client_data: Dict[str, Any], 
                                           opportunity: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert for upsell opportunity"""
        alert = {
            "type": "upsell_opportunity",
            "priority": AlertPriority.MEDIUM,
            "client_name": client_data.get("name"),
            "client_id": client_data.get("id"),
            "service_name": opportunity.get("service_name"),
            "monthly_value": opportunity.get("monthly_value"),
            "annual_value": opportunity.get("annual_value"),
            "confidence": opportunity.get("confidence"),
            "reason": opportunity.get("reason"),
            "recommended_action": "Review proposal and contact client",
            "timestamp": datetime.now().isoformat()
        }
        
        slack_result = await self._send_slack_alert(alert)
        
        logger.info(f"📈 UPSELL ALERT sent: ${opportunity.get('annual_value', 0):.2f} opportunity")
        
        return {
            "alert_sent": True,
            "channels": ["slack"],
            "potential_value": opportunity.get("annual_value"),
            "slack_status": slack_result
        }
    
    async def send_cashflow_risk_alert(self, client_data: Dict[str, Any], 
                                      risk_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert for cashflow risk"""
        alert = {
            "type": "cashflow_risk",
            "priority": AlertPriority.CRITICAL,
            "client_name": client_data.get("name"),
            "client_id": client_data.get("id"),
            "projected_loss": abs(risk_data.get("total_margin_impact", 0)),
            "timeframe": "3 months",
            "risk_factors": risk_data.get("risk_factors", []),
            "recommended_action": "Immediate action required",
            "timestamp": datetime.now().isoformat()
        }
        
        slack_result = await self._send_slack_alert(alert)
        teams_result = await self._send_teams_alert(alert)
        
        logger.info(f"💸 CASHFLOW ALERT sent: ${alert['projected_loss']:.2f} risk")
        
        return {
            "alert_sent": True,
            "channels": ["slack", "teams"],
            "slack_status": slack_result,
            "teams_status": teams_result
        }
    
    async def send_anomaly_alert(self, anomaly_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert for detected anomaly"""
        alert = {
            "type": "anomaly_detected",
            "priority": AlertPriority.HIGH if anomaly_data.get("severity") == "high" else AlertPriority.MEDIUM,
            "anomaly_type": anomaly_data.get("type"),
            "client_name": anomaly_data.get("client_name"),
            "client_id": anomaly_data.get("client_id"),
            "description": anomaly_data.get("description"),
            "impact": anomaly_data.get("impact"),
            "recommended_action": anomaly_data.get("recommendation"),
            "timestamp": datetime.now().isoformat()
        }
        
        if anomaly_data.get("severity") == "high":
            slack_result = await self._send_slack_alert(alert)
            teams_result = await self._send_teams_alert(alert)
            channels = ["slack", "teams"]
        else:
            slack_result = await self._send_slack_alert(alert)
            teams_result = None
            channels = ["slack"]
        
        logger.info(f"🔍 ANOMALY ALERT sent: {anomaly_data.get('type')}")
        
        return {
            "alert_sent": True,
            "channels": channels,
            "slack_status": slack_result,
            "teams_status": teams_result
        }
    
    async def _send_slack_alert(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert to Slack"""
        # Format message based on alert type
        message = self._format_slack_message(alert)
        
        # Get Slack webhook URL from environment
        slack_webhook = os.getenv('SLACK_WEBHOOK_URL')
        
        if not slack_webhook:
            logger.warning("Slack webhook URL not configured, simulating alert")
            return {
                "success": True,
                "channel": "slack",
                "message_id": f"slack_{datetime.now().timestamp()}",
                "timestamp": datetime.now().isoformat(),
                "simulated": True
            }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(slack_webhook, json=message) as response:
                    if response.status == 200:
                        logger.info(f"✅ Slack alert sent successfully: {alert['type']}")
                        return {
                            "success": True,
                            "channel": "slack",
                            "message_id": f"slack_{datetime.now().timestamp()}",
                            "timestamp": datetime.now().isoformat(),
                            "response_status": response.status
                        }
                    else:
                        logger.error(f"Slack API error: {response.status}")
                        return {
                            "success": False,
                            "channel": "slack",
                            "error": f"HTTP {response.status}",
                            "timestamp": datetime.now().isoformat()
                        }
        except Exception as e:
            logger.error(f"Error sending Slack alert: {e}")
            return {
                "success": False,
                "channel": "slack",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _send_teams_alert(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Send alert to Microsoft Teams"""
        # Format message based on alert type
        message = self._format_teams_message(alert)
        
        # Get Teams webhook URL from environment
        teams_webhook = os.getenv('TEAMS_WEBHOOK_URL')
        
        if not teams_webhook:
            logger.warning("Teams webhook URL not configured, simulating alert")
            return {
                "success": True,
                "channel": "teams",
                "message_id": f"teams_{datetime.now().timestamp()}",
                "timestamp": datetime.now().isoformat(),
                "simulated": True
            }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(teams_webhook, json=message) as response:
                    if response.status == 200:
                        logger.info(f"✅ Teams alert sent successfully: {alert['type']}")
                        return {
                            "success": True,
                            "channel": "teams",
                            "message_id": f"teams_{datetime.now().timestamp()}",
                            "timestamp": datetime.now().isoformat(),
                            "response_status": response.status
                        }
                    else:
                        logger.error(f"Teams API error: {response.status}")
                        return {
                            "success": False,
                            "channel": "teams",
                            "error": f"HTTP {response.status}",
                            "timestamp": datetime.now().isoformat()
                        }
        except Exception as e:
            logger.error(f"Error sending Teams alert: {e}")
            return {
                "success": False,
                "channel": "teams",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _format_slack_message(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Format alert for Slack"""
        color_map = {
            AlertPriority.CRITICAL: "#FF0000",
            AlertPriority.HIGH: "#FFA500",
            AlertPriority.MEDIUM: "#FFFF00",
            AlertPriority.LOW: "#00FF00",
            AlertPriority.INFO: "#0000FF"
        }
        
        priority = alert.get("priority", AlertPriority.INFO)
        color = color_map.get(priority, "#808080")
        
        emoji_map = {
            "unprofitable_client": "🚨",
            "license_waste_detected": "💰",
            "upsell_opportunity": "📈",
            "anomaly_detected": "🔍",
            "cashflow_risk": "💸",
            "high_churn_risk": "⚠️"
        }
        
        emoji = emoji_map.get(alert.get("type"), "ℹ️")
        
        message = {
            "text": f"{emoji} AI CFO Agent Alert",
            "attachments": [
                {
                    "color": color,
                    "title": f"{alert.get('type').replace('_', ' ').title()}",
                    "fields": [
                        {
                            "title": "Client",
                            "value": alert.get("client_name", "N/A"),
                            "short": True
                        },
                        {
                            "title": "Priority",
                            "value": priority.value.upper(),
                            "short": True
                        },
                        {
                            "title": "Recommended Action",
                            "value": alert.get("recommended_action", "Review required"),
                            "short": False
                        }
                    ],
                    "footer": "AI CFO Agent",
                    "ts": int(datetime.now().timestamp())
                }
            ]
        }
        
        # Add specific fields based on alert type
        if alert.get("type") == "unprofitable_client":
            message["attachments"][0]["fields"].insert(1, {
                "title": "Monthly Margin",
                "value": f"${alert.get('margin', 0)}",
                "short": True
            })
        elif alert.get("type") == "license_waste_detected":
            message["attachments"][0]["fields"].insert(1, {
                "title": "Annual Savings Potential",
                "value": f"${alert.get('annual_savings', 0):,.2f}",
                "short": True
            })
        elif alert.get("type") == "upsell_opportunity":
            message["attachments"][0]["fields"].insert(1, {
                "title": "Annual Value",
                "value": f"${alert.get('annual_value', 0):,.2f}",
                "short": True
            })
            message["attachments"][0]["fields"].insert(2, {
                "title": "Service",
                "value": alert.get('service_name', 'N/A'),
                "short": True
            })
        
        return message
    
    def _format_teams_message(self, alert: Dict[str, Any]) -> Dict[str, Any]:
        """Format alert for Microsoft Teams"""
        color_map = {
            AlertPriority.CRITICAL: "attention",
            AlertPriority.HIGH: "warning",
            AlertPriority.MEDIUM: "accent",
            AlertPriority.LOW: "good",
            AlertPriority.INFO: "default"
        }
        
        priority = alert.get("priority", AlertPriority.INFO)
        theme_color = color_map.get(priority, "default")
        
        message = {
            "@type": "MessageCard",
            "@context": "https://schema.org/extensions",
            "summary": f"AI CFO Agent Alert: {alert.get('type')}",
            "themeColor": theme_color,
            "title": f"🤖 AI CFO Agent - {alert.get('type').replace('_', ' ').title()}",
            "sections": [
                {
                    "activityTitle": alert.get("client_name", "N/A"),
                    "activitySubtitle": f"Priority: {priority.value.upper()}",
                    "facts": [
                        {
                            "name": "Recommended Action",
                            "value": alert.get("recommended_action", "Review required")
                        },
                        {
                            "name": "Timestamp",
                            "value": alert.get("timestamp", datetime.now().isoformat())
                        }
                    ]
                }
            ]
        }
        
        return message
    
    def get_recent_alerts(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent alerts history"""
        return self.alerts_history[-limit:]
    
    def get_alert_stats(self) -> Dict[str, Any]:
        """Get alert statistics"""
        return {
            "total_alerts": len(self.alerts_history),
            "critical_alerts": len([a for a in self.alerts_history if a.get("priority") == AlertPriority.CRITICAL]),
            "high_alerts": len([a for a in self.alerts_history if a.get("priority") == AlertPriority.HIGH]),
            "alerts_by_type": self._count_alerts_by_type()
        }
    
    def _count_alerts_by_type(self) -> Dict[str, int]:
        """Count alerts by type"""
        counts = {}
        for alert in self.alerts_history:
            alert_type = alert.get("type", "unknown")
            counts[alert_type] = counts.get(alert_type, 0) + 1
        return counts


# Global alerts manager instance
alerts_manager = AlertsManager()

