# src/backend/notifications_service.py
import requests
import json
from datetime import datetime

class NotificationService:
    def __init__(self):
        # Add your webhook URLs here
        self.slack_webhook = "YOUR_SLACK_WEBHOOK_URL"
        self.teams_webhook = "YOUR_TEAMS_WEBHOOK_URL"
    
    def send_slack_alert(self, message, severity="info"):
        """Send alert to Slack channel"""
        try:
            color_map = {
                "critical": "#ff0000",
                "warning": "#ff9900", 
                "info": "#36a64f"
            }
            
            payload = {
                "attachments": [
                    {
                        "color": color_map.get(severity, "#36a64f"),
                        "title": "🤖 AI CFO Agent Alert",
                        "text": message,
                        "footer": "AI CFO Agent",
                        "ts": int(datetime.now().timestamp())
                    }
                ]
            }
            
            response = requests.post(self.slack_webhook, json=payload)
            return {"success": True, "message": "Slack notification sent"}
            
        except Exception as e:
            return {"success": False, "message": f"Slack error: {str(e)}"}
    
    def send_teams_alert(self, message, severity="info"):
        """Send alert to Microsoft Teams"""
        try:
            color_map = {
                "critical": "attention",
                "warning": "warning",
                "info": "good"
            }
            
            payload = {
                "@type": "MessageCard",
                "@context": "http://schema.org/extensions",
                "themeColor": "0076D7",
                "summary": "AI CFO Agent Alert",
                "sections": [{
                    "activityTitle": "🤖 AI CFO Agent",
                    "activitySubtitle": f"Alert - {severity.upper()}",
                    "text": message,
                    "markdown": True
                }]
            }
            
            response = requests.post(self.teams_webhook, json=payload)
            return {"success": True, "message": "Teams notification sent"}
            
        except Exception as e:
            return {"success": False, "message": f"Teams error: {str(e)}"}

# Add this to your app.py
@app.route('/api/send-alert', methods=['POST'])
def send_alert():
    """Send alert to Slack/Teams"""
    try:
        data = request.json
        message = data.get('message', 'Test alert from AI CFO Agent')
        severity = data.get('severity', 'info')
        platform = data.get('platform', 'slack')  # 'slack' or 'teams'
        
        notification_service = NotificationService()
        
        if platform == 'slack':
            result = notification_service.send_slack_alert(message, severity)
        else:
            result = notification_service.send_teams_alert(message, severity)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500
