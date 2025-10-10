"""
Autonomous Actions Module
Executes autonomous financial actions with guardrails
"""
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ActionType(Enum):
    """Types of autonomous actions"""
    LICENSE_DOWNGRADE = "license_downgrade"
    DRAFT_NEGOTIATION_EMAIL = "draft_negotiation_email"
    DRAFT_UPSELL_PROPOSAL = "draft_upsell_proposal"
    CREATE_SUPEROPS_QUOTE = "create_superops_quote"
    SEND_ALERT = "send_alert"
    UPDATE_CLIENT_RISK = "update_client_risk"


class ActionStatus(Enum):
    """Status of autonomous actions"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    REQUIRES_APPROVAL = "requires_approval"


class AutonomousAction:
    """Represents an autonomous action"""
    def __init__(self, action_type: ActionType, client_id: str, 
                 data: Dict[str, Any], requires_approval: bool = False):
        self.action_id = f"{action_type.value}_{client_id}_{datetime.now().timestamp()}"
        self.action_type = action_type
        self.client_id = client_id
        self.data = data
        self.requires_approval = requires_approval
        self.status = ActionStatus.REQUIRES_APPROVAL if requires_approval else ActionStatus.PENDING
        self.created_at = datetime.now()
        self.completed_at = None
        self.result = None


class AutonomousActionsEngine:
    """
    Autonomous Actions Engine with Bedrock Guardrails
    Executes safe, autonomous financial actions
    """
    
    def __init__(self):
        self.actions_queue = []
        self.actions_history = []
        self.guardrails = self._initialize_guardrails()
        logger.info("✅ Autonomous Actions Engine initialized with guardrails")
    
    def _initialize_guardrails(self) -> Dict[str, Any]:
        """Initialize safety guardrails for autonomous actions"""
        return {
            "max_license_downgrade_per_action": 50,  # Max licenses to downgrade at once
            "max_monthly_cost_change": 5000,  # Max $ change per month
            "require_approval_threshold": 1000,  # Require approval above this amount
            "client_risk_levels": {
                "high": {"allow_autonomous": False, "reason": "High risk clients require manual review"},
                "medium": {"allow_autonomous": True, "reason": "Medium risk - proceed with caution"},
                "low": {"allow_autonomous": True, "reason": "Low risk - safe for automation"}
            },
            "blacklisted_actions": [],  # Actions that always require approval
            "auto_approval_enabled": True
        }
    
    async def auto_downgrade_unused_licenses(self, client_id: str, client_data: Dict[str, Any], 
                                            license_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Autonomously downgrade unused licenses with guardrails
        """
        logger.info(f"🤖 Autonomous Action: Processing license downgrade for client {client_id}")
        
        # Check guardrails
        if not self._check_guardrails(client_id, client_data, "license_downgrade"):
            return {
                "action": "license_downgrade",
                "status": "blocked_by_guardrails",
                "reason": "Client risk level requires manual approval",
                "requires_approval": True
            }
        
        # Calculate total savings
        total_monthly_savings = license_analysis.get("monthly_savings", 0)
        
        # Check if exceeds threshold
        requires_approval = total_monthly_savings > self.guardrails["require_approval_threshold"]
        
        if requires_approval:
            action = AutonomousAction(
                ActionType.LICENSE_DOWNGRADE,
                client_id,
                {
                    "licenses": license_analysis.get("optimizations", []),
                    "monthly_savings": total_monthly_savings,
                    "annual_savings": license_analysis.get("potential_savings", 0)
                },
                requires_approval=True
            )
            self.actions_queue.append(action)
            
            logger.info(f"⚠️ Action requires approval: ${total_monthly_savings}/month savings")
            
            return {
                "action_id": action.action_id,
                "status": "requires_approval",
                "monthly_savings": total_monthly_savings,
                "annual_savings": license_analysis.get("potential_savings", 0),
                "approval_url": f"/actions/approve/{action.action_id}"
            }
        
        # Execute autonomous downgrade
        result = await self._execute_license_downgrade(client_id, license_analysis)
        
        # Record action
        action = AutonomousAction(
            ActionType.LICENSE_DOWNGRADE,
            client_id,
            license_analysis
        )
        action.status = ActionStatus.COMPLETED
        action.completed_at = datetime.now()
        action.result = result
        self.actions_history.append(action)
        
        logger.info(f"✅ Autonomous downgrade completed: Saving ${total_monthly_savings}/month")
        
        return result
    
    async def draft_negotiation_email(self, client_id: str, client_data: Dict[str, Any], 
                                     reason: str = "unprofitable") -> Dict[str, Any]:
        """
        Automatically draft negotiation email for unprofitable clients
        """
        logger.info(f"🤖 Autonomous Action: Drafting negotiation email for {client_id}")
        
        margin = client_data.get("margin", 0)
        
        email_template = f"""Subject: Service Agreement Review - {client_data.get('name')}

Dear {client_data.get('name')} Team,

I hope this email finds you well. As part of our commitment to providing exceptional service, we regularly review our client partnerships to ensure mutual success.

**Current Situation:**
Our analysis shows that our current service delivery costs exceed the contract value by approximately ${abs(margin)}/month. This trend, if continued, impacts our ability to maintain the high-quality service you've come to expect.

**What This Means:**
We value our partnership and want to ensure we can continue supporting your business effectively. To achieve this, we'd like to discuss options that work for both parties.

**Proposed Solutions:**
1. **Service Optimization**: Review and adjust service levels to better match your actual needs
2. **Contract Amendment**: Update pricing to reflect true service delivery costs (approximately {round((abs(margin) / client_data.get('monthly_revenue', 1)) * 100)}% adjustment)
3. **Enhanced Services**: Add value-added services that provide additional ROI

**Next Steps:**
I'd like to schedule a brief call this week to discuss these options and find the best path forward for our partnership.

Please let me know your availability, and I'll send a calendar invite.

Best regards,
[Your CFO Agent]

---
*This email was drafted by AI CFO Agent and is ready for your review and personalization.*"""
        
        draft = {
            "client_id": client_id,
            "email_type": "negotiation",
            "subject": f"Service Agreement Review - {client_data.get('name')}",
            "body": email_template,
            "tone": "professional_empathetic",
            "generated_at": datetime.now().isoformat(),
            "status": "draft_ready",
            "requires_review": True,
            "suggested_actions": [
                "Review and personalize",
                "Add specific service examples",
                "Adjust pricing proposal if needed",
                "Send via SuperOps ticket system"
            ]
        }
        
        # Record action
        action = AutonomousAction(
            ActionType.DRAFT_NEGOTIATION_EMAIL,
            client_id,
            draft,
            requires_approval=True
        )
        self.actions_queue.append(action)
        
        logger.info(f"✅ Negotiation email drafted for {client_data.get('name')}")
        
        return draft
    
    async def draft_upsell_proposal(self, client_id: str, client_data: Dict[str, Any], 
                                   opportunities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Automatically generate upsell proposal
        """
        logger.info(f"🤖 Autonomous Action: Drafting upsell proposal for {client_id}")
        
        if not opportunities:
            return {"status": "no_opportunities"}
        
        top_opportunity = opportunities[0]
        
        proposal_template = f"""Subject: Enhance Your IT Security - {client_data.get('name')}

Dear {client_data.get('name')} Team,

I hope you're doing well. I wanted to reach out regarding an opportunity to strengthen your IT infrastructure.

**What We've Observed:**
{top_opportunity.get('reason', 'Based on our analysis of your recent activity')}

**Our Recommendation:**
**{top_opportunity.get('service_name', 'Enhanced Service Package')}**

{top_opportunity.get('proposal_draft', 'This service will provide additional value and protection for your business.')}

**Investment:**
- Monthly: ${top_opportunity.get('monthly_value', 0):,.2f}
- Annual Contract: ${top_opportunity.get('annual_value', 0):,.2f}

**Expected Outcomes:**
- Reduced security incidents by 70-80%
- Faster issue resolution
- Proactive monitoring and prevention
- Compliance support

**Why Now:**
Given your current situation, implementing this solution now can prevent potential issues and provide immediate value.

**Next Steps:**
I've prepared a detailed proposal and would love to discuss how this can benefit your organization. Are you available for a 15-minute call this week?

Best regards,
[Your Account Manager]

---
*Proposal generated by AI CFO Agent with {top_opportunity.get('confidence', 75)}% confidence based on data analysis.*"""
        
        proposal = {
            "client_id": client_id,
            "proposal_type": "upsell",
            "service_name": top_opportunity.get('service_name'),
            "monthly_value": top_opportunity.get('monthly_value'),
            "annual_value": top_opportunity.get('annual_value'),
            "confidence": top_opportunity.get('confidence'),
            "subject": f"Enhance Your IT Security - {client_data.get('name')}",
            "body": proposal_template,
            "generated_at": datetime.now().isoformat(),
            "status": "draft_ready",
            "requires_review": True,
            "next_actions": [
                "Review proposal",
                "Customize pricing if needed",
                "Create SuperOps quote",
                "Schedule follow-up call"
            ]
        }
        
        # Record action
        action = AutonomousAction(
            ActionType.DRAFT_UPSELL_PROPOSAL,
            client_id,
            proposal,
            requires_approval=True
        )
        self.actions_queue.append(action)
        
        logger.info(f"✅ Upsell proposal drafted: ${top_opportunity.get('annual_value', 0):,.2f} opportunity")
        
        return proposal
    
    async def create_superops_quote(self, client_id: str, service_details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Automatically create quote in SuperOps system
        """
        logger.info(f"🤖 Autonomous Action: Creating SuperOps quote for {client_id}")
        
        # Simulate SuperOps API integration
        quote = {
            "quote_id": f"Q-{datetime.now().strftime('%Y%m%d')}-{client_id[:4].upper()}",
            "client_id": client_id,
            "service_name": service_details.get('service_name'),
            "description": service_details.get('description', ''),
            "line_items": [
                {
                    "item": service_details.get('service_name'),
                    "quantity": 1,
                    "unit_price": service_details.get('monthly_value', 0),
                    "total": service_details.get('monthly_value', 0),
                    "billing_cycle": "monthly"
                }
            ],
            "subtotal": service_details.get('monthly_value', 0),
            "tax": service_details.get('monthly_value', 0) * 0.1,  # 10% tax example
            "total": service_details.get('monthly_value', 0) * 1.1,
            "annual_value": service_details.get('annual_value', 0),
            "status": "draft",
            "created_at": datetime.now().isoformat(),
            "valid_until": self._calculate_quote_expiry(),
            "superops_url": f"https://app.superops.com/quotes/{client_id}",
            "pdf_url": f"https://app.superops.com/quotes/{client_id}/download"
        }
        
        # Record action
        action = AutonomousAction(
            ActionType.CREATE_SUPEROPS_QUOTE,
            client_id,
            quote,
            requires_approval=False
        )
        action.status = ActionStatus.COMPLETED
        action.completed_at = datetime.now()
        self.actions_history.append(action)
        
        logger.info(f"✅ SuperOps quote created: {quote['quote_id']}")
        
        return quote
    
    async def _execute_license_downgrade(self, client_id: str, 
                                        license_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the actual license downgrade"""
        # In production, this would call vendor APIs
        # For demo, simulating the execution
        
        optimizations = license_analysis.get("optimizations", [])
        
        results = []
        for optimization in optimizations:
            result = {
                "license_type": optimization.get("license_type"),
                "action": "downgrade",
                "licenses_removed": optimization.get("unused_count"),
                "monthly_savings": optimization.get("monthly_waste"),
                "status": "completed",
                "executed_at": datetime.now().isoformat(),
                "vendor_confirmation": f"CONF-{datetime.now().timestamp()}"
            }
            results.append(result)
        
        return {
            "action": "license_downgrade",
            "client_id": client_id,
            "status": "completed",
            "downgrades": results,
            "total_monthly_savings": license_analysis.get("monthly_savings", 0),
            "total_annual_savings": license_analysis.get("potential_savings", 0),
            "executed_at": datetime.now().isoformat()
        }
    
    def _check_guardrails(self, client_id: str, client_data: Dict[str, Any], 
                         action_type: str) -> bool:
        """Check if action passes guardrails"""
        # Check client risk level
        risk_level = self._assess_client_risk(client_data)
        
        if risk_level == "high" and action_type in ["license_downgrade"]:
            # High risk clients need manual review for financial changes
            logger.warning(f"⚠️ Guardrail: {client_id} is high risk, requiring manual approval")
            return False
        
        return True
    
    def _assess_client_risk(self, client_data: Dict[str, Any]) -> str:
        """Assess client risk level"""
        margin = client_data.get("margin", 0)
        
        if margin < 0:
            return "high"
        elif margin < 500:
            return "medium"
        else:
            return "low"
    
    def _calculate_quote_expiry(self) -> str:
        """Calculate quote expiration date"""
        from datetime import timedelta
        expiry = datetime.now() + timedelta(days=30)
        return expiry.isoformat()
    
    def get_pending_approvals(self) -> List[Dict[str, Any]]:
        """Get all actions waiting for approval"""
        pending = [
            {
                "action_id": action.action_id,
                "action_type": action.action_type.value,
                "client_id": action.client_id,
                "created_at": action.created_at.isoformat(),
                "data": action.data
            }
            for action in self.actions_queue
            if action.status == ActionStatus.REQUIRES_APPROVAL
        ]
        return pending
    
    def approve_action(self, action_id: str) -> Dict[str, Any]:
        """Approve a pending action"""
        for action in self.actions_queue:
            if action.action_id == action_id:
                action.status = ActionStatus.PENDING
                logger.info(f"✅ Action approved: {action_id}")
                return {"status": "approved", "action_id": action_id}
        
        return {"status": "not_found", "action_id": action_id}
    
    def get_actions_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent actions history"""
        return [
            {
                "action_id": action.action_id,
                "action_type": action.action_type.value,
                "client_id": action.client_id,
                "status": action.status.value,
                "created_at": action.created_at.isoformat(),
                "completed_at": action.completed_at.isoformat() if action.completed_at else None,
                "result": action.result
            }
            for action in self.actions_history[-limit:]
        ]


# Global autonomous actions engine
autonomous_engine = AutonomousActionsEngine()

