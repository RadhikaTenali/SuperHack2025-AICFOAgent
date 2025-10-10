"""
AWS Bedrock Agent Integration
Provides AI reasoning, multi-agent coordination, and autonomous actions
"""
import boto3
import json
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BedrockAIAgent:
    """Core AI reasoning agent using AWS Bedrock"""
    
    def __init__(self):
        try:
            self.bedrock_runtime = boto3.client(
                service_name='bedrock-runtime',
                region_name=os.getenv('AWS_REGION', 'us-west-2'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.bedrock_agent = boto3.client(
                service_name='bedrock-agent-runtime',
                region_name=os.getenv('AWS_REGION', 'us-west-2'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.model_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
            self.agent_available = True
            logger.info("✅ AWS Bedrock Agent initialized successfully")
        except Exception as e:
            logger.warning(f"⚠️ AWS Bedrock not available: {e}. Using mock mode.")
            self.bedrock_runtime = None
            self.bedrock_agent = None
            self.agent_available = False
    
    def analyze_client_profitability(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered profitability analysis with recommendations
        """
        if not self.agent_available:
            return self._mock_profitability_analysis(client_data)
        
        try:
            prompt = f"""You are an expert CFO analyzing MSP client profitability.

Client Data:
- Name: {client_data['name']}
- Monthly Revenue: ${client_data['monthly_revenue']}
- Monthly Cost: ${client_data['monthly_cost']}
- Margin: ${client_data['margin']}
- Services: {', '.join(client_data['services'])}
- Support Tickets (last month): {client_data['tickets_last_month']}
- Security Incidents: {client_data['security_incidents']}

Analyze this client and provide:
1. Risk assessment (high/medium/low)
2. Specific recommendations (renegotiate, upsell, terminate, optimize)
3. Predicted 3-month cashflow impact
4. Confidence score (0-100)

Format as JSON with keys: risk_level, recommendations, cashflow_prediction, confidence_score, reasoning"""

            response = self.bedrock_runtime.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                })
            )
            
            response_body = json.loads(response['body'].read())
            analysis_text = response_body['content'][0]['text']
            
            # Parse JSON response
            try:
                analysis = json.loads(analysis_text)
            except:
                # Fallback if response isn't pure JSON
                analysis = {
                    "risk_level": "medium",
                    "recommendations": [analysis_text],
                    "cashflow_prediction": f"${client_data['margin'] * 3}",
                    "confidence_score": 75,
                    "reasoning": analysis_text
                }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in Bedrock analysis: {e}")
            return self._mock_profitability_analysis(client_data)
    
    def identify_upsell_opportunities(self, client_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        AI-powered upsell opportunity identification
        """
        if not self.agent_available:
            return self._mock_upsell_opportunities(client_data)
        
        try:
            prompt = f"""You are an expert MSP sales consultant analyzing upsell opportunities.

Client Profile:
- Name: {client_data['name']}
- Current Services: {', '.join(client_data['services'])}
- Monthly Revenue: ${client_data['monthly_revenue']}
- Support Tickets: {client_data['tickets_last_month']}
- Security Incidents: {client_data['security_incidents']}

Identify 2-3 specific upsell opportunities based on their data patterns.
For each opportunity provide:
- service_name: The specific service to upsell
- monthly_value: Expected monthly recurring revenue
- annual_value: Annual contract value
- confidence: Confidence score (0-100)
- reason: Data-driven justification
- proposal_draft: 2-3 sentence sales pitch

Format as JSON array."""

            response = self.bedrock_runtime.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1500,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                })
            )
            
            response_body = json.loads(response['body'].read())
            opportunities_text = response_body['content'][0]['text']
            
            try:
                opportunities = json.loads(opportunities_text)
                if isinstance(opportunities, list):
                    return opportunities
            except:
                pass
            
            return self._mock_upsell_opportunities(client_data)
            
        except Exception as e:
            logger.error(f"Error in upsell identification: {e}")
            return self._mock_upsell_opportunities(client_data)
    
    def generate_negotiation_email(self, client_data: Dict[str, Any], scenario: str) -> str:
        """
        Generate draft negotiation/upsell emails using AI
        """
        if not self.agent_available:
            return self._mock_negotiation_email(client_data, scenario)
        
        try:
            prompt = f"""You are a professional MSP account manager drafting an email.

Scenario: {scenario}
Client: {client_data['name']}
Context: Monthly margin is ${client_data['margin']}, operating at {'a loss' if client_data['margin'] < 0 else 'low profitability'}

Write a professional, empathetic email that:
1. Acknowledges the relationship
2. Presents data-driven concerns
3. Proposes specific solutions
4. Maintains positive tone
5. Includes clear call-to-action

Keep it concise (200-300 words)."""

            response = self.bedrock_runtime.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                })
            )
            
            response_body = json.loads(response['body'].read())
            email_content = response_body['content'][0]['text']
            
            return email_content
            
        except Exception as e:
            logger.error(f"Error generating email: {e}")
            return self._mock_negotiation_email(client_data, scenario)
    
    def predict_cashflow_risk(self, client_data: Dict[str, Any], months_ahead: int = 3) -> Dict[str, Any]:
        """
        Digital Twin: Predict cashflow risks using AI
        """
        if not self.agent_available:
            return self._mock_cashflow_prediction(client_data, months_ahead)
        
        try:
            prompt = f"""You are a financial analyst creating cashflow predictions.

Client Financial Data:
- Current Monthly Margin: ${client_data['margin']}
- Monthly Revenue: ${client_data['monthly_revenue']}
- Monthly Cost: ${client_data['monthly_cost']}
- Ticket Volume Trend: {client_data['tickets_last_month']} last month
- Security Incidents: {client_data['security_incidents']}

Predict the {months_ahead}-month cashflow scenario assuming current trends continue.

Provide JSON with:
- total_margin_impact: Total margin over {months_ahead} months
- risk_level: high/medium/low
- risk_factors: Array of specific risks
- mitigation_strategies: Array of recommended actions
- confidence_score: 0-100

Consider ticket volume trends, security incidents, and margin trajectory."""

            response = self.bedrock_runtime.invoke_model(
                modelId=self.model_id,
                body=json.dumps({
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": 1000,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ]
                })
            )
            
            response_body = json.loads(response['body'].read())
            prediction_text = response_body['content'][0]['text']
            
            try:
                prediction = json.loads(prediction_text)
                return prediction
            except:
                return self._mock_cashflow_prediction(client_data, months_ahead)
            
        except Exception as e:
            logger.error(f"Error in cashflow prediction: {e}")
            return self._mock_cashflow_prediction(client_data, months_ahead)
    
    # Mock methods for when Bedrock is unavailable
    def _mock_profitability_analysis(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock analysis when Bedrock unavailable"""
        margin = client_data['margin']
        if margin < 0:
            risk_level = "high"
            recommendations = [
                "Immediate contract renegotiation required",
                "Consider 20-30% price increase or service reduction",
                "Set 60-day deadline for profitability improvement"
            ]
        elif margin < 500:
            risk_level = "medium"
            recommendations = [
                "Review service delivery efficiency",
                "Identify automation opportunities",
                "Consider upselling premium services"
            ]
        else:
            risk_level = "low"
            recommendations = [
                "Maintain current service levels",
                "Explore strategic upsell opportunities",
                "Use as case study for other clients"
            ]
        
        return {
            "risk_level": risk_level,
            "recommendations": recommendations,
            "cashflow_prediction": f"${margin * 3} over 3 months",
            "confidence_score": 85,
            "reasoning": f"Based on current margin of ${margin}/month and ticket volume of {client_data['tickets_last_month']}"
        }
    
    def _mock_upsell_opportunities(self, client_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Mock upsell opportunities"""
        opportunities = []
        
        if client_data['security_incidents'] >= 5:
            opportunities.append({
                "service_name": "Premium Cybersecurity Package",
                "monthly_value": 2000,
                "annual_value": 24000,
                "confidence": 90,
                "reason": f"{client_data['security_incidents']} security incidents indicate vulnerability gaps",
                "proposal_draft": f"Given your recent security incidents, we recommend our Premium Cybersecurity Package with 24/7 SOC monitoring, advanced threat detection, and incident response. This proactive approach will reduce incidents by 80% and protect your business continuity."
            })
        
        if client_data['tickets_last_month'] > 20:
            opportunities.append({
                "service_name": "Enhanced Support & Monitoring",
                "monthly_value": 1200,
                "annual_value": 14400,
                "confidence": 75,
                "reason": f"High ticket volume ({client_data['tickets_last_month']}) suggests infrastructure instability",
                "proposal_draft": f"Your high support ticket volume indicates opportunities for proactive monitoring. Our Enhanced Support package includes 24/7 infrastructure monitoring, automated remediation, and dedicated support engineer - reducing tickets by 60%."
            })
        
        if "health" in client_data['name'].lower():
            opportunities.append({
                "service_name": "HIPAA Compliance Suite",
                "monthly_value": 1500,
                "annual_value": 18000,
                "confidence": 95,
                "reason": "Healthcare industry requires comprehensive compliance monitoring",
                "proposal_draft": "As a healthcare organization, HIPAA compliance is critical. Our Compliance Suite provides continuous monitoring, automated audit trails, risk assessments, and staff training - ensuring you meet all regulatory requirements."
            })
        
        return opportunities
    
    def _mock_negotiation_email(self, client_data: Dict[str, Any], scenario: str) -> str:
        """Mock email generation"""
        return f"""Subject: Partnership Review - {client_data['name']}

Dear {client_data['name']} Team,

I hope this message finds you well. I wanted to reach out regarding our current service agreement and explore how we can ensure continued mutual success.

After reviewing our partnership metrics, I've identified some concerns about the sustainability of our current arrangement. Our analysis shows that the service delivery costs have exceeded the contract value by approximately ${abs(client_data['margin'])}/month.

We highly value our relationship and want to continue providing exceptional service. To maintain the quality you've come to expect, I'd like to discuss a few options:

1. Optimizing your service package to better match your needs
2. Adjusting pricing to reflect the actual service delivery costs
3. Exploring additional services that could provide more value

I believe we can find a solution that works for both parties. Could we schedule a call this week to discuss these options?

Looking forward to continuing our partnership.

Best regards,
Your MSP Account Manager"""
    
    def _mock_cashflow_prediction(self, client_data: Dict[str, Any], months_ahead: int) -> Dict[str, Any]:
        """Mock cashflow prediction"""
        total_impact = client_data['margin'] * months_ahead
        
        return {
            "total_margin_impact": total_impact,
            "risk_level": "high" if total_impact < 0 else "medium" if total_impact < 1500 else "low",
            "risk_factors": [
                f"Current margin: ${client_data['margin']}/month",
                f"Projected {months_ahead}-month impact: ${total_impact}",
                f"High support load: {client_data['tickets_last_month']} tickets/month"
            ] if total_impact < 0 else ["Stable revenue stream", "Manageable support load"],
            "mitigation_strategies": [
                "Renegotiate contract terms immediately",
                "Implement service optimization",
                "Consider client termination if unprofitable"
            ] if total_impact < 0 else ["Maintain service quality", "Explore upsell opportunities"],
            "confidence_score": 88
        }


# Global agent instance
bedrock_agent = BedrockAIAgent()

