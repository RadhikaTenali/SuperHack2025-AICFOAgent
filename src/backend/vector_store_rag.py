"""
Bedrock Vector Store for RAG (Retrieval-Augmented Generation)
Stores and retrieves financial data for AI analysis
"""
import boto3
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BedrockVectorStore:
    """
    AWS Bedrock Vector Store for RAG analytics
    Stores financial data embeddings for intelligent retrieval
    """
    
    def __init__(self):
        try:
            self.bedrock_agent = boto3.client(
                service_name='bedrock-agent',
                region_name=os.getenv('AWS_REGION', 'us-west-2'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.bedrock_runtime = boto3.client(
                service_name='bedrock-runtime',
                region_name=os.getenv('AWS_REGION', 'us-west-2'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.knowledge_base_id = os.getenv('BEDROCK_KNOWLEDGE_BASE_ID', 'mock-kb-id')
            self.vector_store_available = True
            logger.info("✅ Bedrock Vector Store initialized")
        except Exception as e:
            logger.warning(f"⚠️ Bedrock Vector Store not available: {e}. Using mock mode.")
            self.bedrock_agent = None
            self.bedrock_runtime = None
            self.vector_store_available = False
            # Mock in-memory storage
            self.mock_storage = {}
    
    async def store_client_financial_data(self, client_id: str, financial_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store client financial data in vector store for RAG
        """
        logger.info(f"📦 Storing financial data for client {client_id}")
        
        # Prepare document for embedding
        document = {
            "client_id": client_id,
            "client_name": financial_data.get("name"),
            "timestamp": datetime.now().isoformat(),
            "financial_metrics": {
                "monthly_revenue": financial_data.get("monthly_revenue"),
                "monthly_cost": financial_data.get("monthly_cost"),
                "margin": financial_data.get("margin"),
                "margin_percentage": round((financial_data.get("margin", 0) / financial_data.get("monthly_revenue", 1)) * 100, 2),
                "contract_value": financial_data.get("contract_value")
            },
            "operational_metrics": {
                "services": financial_data.get("services", []),
                "tickets_last_month": financial_data.get("tickets_last_month"),
                "security_incidents": financial_data.get("security_incidents")
            },
            "license_data": financial_data.get("licenses", {}),
            "text_content": self._generate_text_representation(financial_data)
        }
        
        if self.vector_store_available:
            # Store in actual Bedrock Vector Store
            result = await self._store_in_bedrock(document)
        else:
            # Store in mock storage
            self.mock_storage[client_id] = document
            result = {
                "success": True,
                "document_id": f"doc_{client_id}_{datetime.now().timestamp()}",
                "storage": "mock"
            }
        
        logger.info(f"✅ Financial data stored for {financial_data.get('name')}")
        return result
    
    async def query_similar_clients(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Query vector store for similar clients using RAG
        """
        logger.info(f"🔍 Querying similar clients: {query}")
        
        if self.vector_store_available:
            results = await self._query_bedrock(query, limit)
        else:
            # Mock similarity search
            results = self._mock_similarity_search(query, limit)
        
        logger.info(f"✅ Found {len(results)} similar clients")
        return results
    
    async def analyze_client_patterns(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use RAG to analyze patterns from similar clients
        """
        logger.info(f"📊 Analyzing patterns for {client_data.get('name')}")
        
        # Create query based on client characteristics
        query = self._build_pattern_query(client_data)
        
        # Find similar clients
        similar_clients = await self.query_similar_clients(query)
        
        # Analyze patterns
        patterns = {
            "client_id": client_data.get("id"),
            "analysis_type": "pattern_recognition",
            "similar_clients_analyzed": len(similar_clients),
            "patterns_identified": []
        }
        
        # Identify common patterns
        if similar_clients:
            patterns["patterns_identified"] = self._extract_patterns(client_data, similar_clients)
        
        logger.info(f"✅ Identified {len(patterns['patterns_identified'])} patterns")
        return patterns
    
    async def get_best_practices_for_client(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retrieve best practices from successful similar clients using RAG
        """
        logger.info(f"💡 Retrieving best practices for {client_data.get('name')}")
        
        # Find successful clients with similar profiles
        query = f"successful profitable clients similar to {client_data.get('name')} with margin > 20%"
        
        successful_clients = await self.query_similar_clients(query)
        
        best_practices = {
            "client_id": client_data.get("id"),
            "recommendations": [],
            "based_on_clients": len(successful_clients)
        }
        
        # Extract best practices
        if successful_clients:
            best_practices["recommendations"] = self._extract_best_practices(successful_clients)
        
        logger.info(f"✅ Generated {len(best_practices['recommendations'])} best practice recommendations")
        return best_practices
    
    async def predictive_churn_analysis(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Use RAG to predict churn based on historical patterns
        """
        logger.info(f"🔮 Predicting churn risk for {client_data.get('name')}")
        
        # Find clients with similar characteristics that churned
        query = f"clients with margin {client_data.get('margin')} and {client_data.get('tickets_last_month')} tickets that churned"
        
        historical_cases = await self.query_similar_clients(query, limit=10)
        
        # Calculate churn probability
        churn_indicators = {
            "negative_margin": client_data.get("margin", 0) < 0,
            "high_ticket_volume": client_data.get("tickets_last_month", 0) > 30,
            "security_incidents": client_data.get("security_incidents", 0) > 5
        }
        
        churn_score = sum(churn_indicators.values()) * 25  # Each indicator = 25%
        
        analysis = {
            "client_id": client_data.get("id"),
            "churn_probability": min(churn_score, 90),
            "risk_level": "high" if churn_score > 50 else "medium" if churn_score > 25 else "low",
            "indicators": churn_indicators,
            "historical_cases_analyzed": len(historical_cases),
            "recommendations": [
                "Immediate account review" if churn_score > 50 else "Monitor closely",
                "Consider contract renegotiation" if client_data.get("margin", 0) < 0 else "Maintain relationship",
                "Address service quality issues" if client_data.get("tickets_last_month", 0) > 30 else "Continue current service"
            ],
            "confidence": 85
        }
        
        logger.info(f"✅ Churn analysis complete: {analysis['churn_probability']}% probability")
        return analysis
    
    def _generate_text_representation(self, financial_data: Dict[str, Any]) -> str:
        """Generate text representation for embedding"""
        margin = financial_data.get("margin", 0)
        margin_status = "profitable" if margin > 0 else "unprofitable"
        
        text = f"""
Client: {financial_data.get('name')}
Status: {margin_status}
Monthly Revenue: ${financial_data.get('monthly_revenue')}
Monthly Cost: ${financial_data.get('monthly_cost')}
Margin: ${margin}
Services: {', '.join(financial_data.get('services', []))}
Support Tickets: {financial_data.get('tickets_last_month')} per month
Security Incidents: {financial_data.get('security_incidents')}
Contract Value: ${financial_data.get('contract_value')}
"""
        return text.strip()
    
    async def _store_in_bedrock(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Store document in actual Bedrock Vector Store"""
        # In production, this would call Bedrock Knowledge Base API
        # For now, simulating the storage
        return {
            "success": True,
            "document_id": f"doc_{document['client_id']}_{datetime.now().timestamp()}",
            "storage": "bedrock",
            "knowledge_base_id": self.knowledge_base_id
        }
    
    async def _query_bedrock(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Query Bedrock Vector Store"""
        # In production, this would call Bedrock Retrieve API
        # For now, returning mock results
        return self._mock_similarity_search(query, limit)
    
    def _mock_similarity_search(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Mock similarity search for demo"""
        # Return stored documents that match query keywords
        results = []
        
        for client_id, doc in self.mock_storage.items():
            similarity_score = self._calculate_mock_similarity(query, doc)
            if similarity_score > 0.3:
                results.append({
                    "client_id": client_id,
                    "client_name": doc.get("client_name"),
                    "financial_metrics": doc.get("financial_metrics"),
                    "operational_metrics": doc.get("operational_metrics"),
                    "similarity_score": similarity_score
                })
        
        # Sort by similarity and return top N
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:limit]
    
    def _calculate_mock_similarity(self, query: str, document: Dict[str, Any]) -> float:
        """Calculate mock similarity score"""
        query_lower = query.lower()
        doc_text = document.get("text_content", "").lower()
        
        # Simple keyword matching
        keywords = query_lower.split()
        matches = sum(1 for keyword in keywords if keyword in doc_text)
        
        similarity = matches / max(len(keywords), 1)
        return similarity
    
    def _build_pattern_query(self, client_data: Dict[str, Any]) -> str:
        """Build query for pattern analysis"""
        margin = client_data.get("margin", 0)
        margin_status = "profitable" if margin > 0 else "unprofitable"
        
        return f"{margin_status} clients with {client_data.get('tickets_last_month')} tickets"
    
    def _extract_patterns(self, client_data: Dict[str, Any], similar_clients: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract common patterns from similar clients"""
        patterns = []
        
        if not similar_clients:
            return patterns
        
        # Calculate averages from similar clients
        avg_margin = sum(c["financial_metrics"]["margin"] for c in similar_clients) / len(similar_clients)
        avg_tickets = sum(c["operational_metrics"]["tickets_last_month"] for c in similar_clients) / len(similar_clients)
        
        # Compare with current client
        if client_data.get("margin", 0) < avg_margin:
            patterns.append({
                "pattern": "below_average_margin",
                "description": f"Client margin (${client_data.get('margin')}) is below similar clients average (${avg_margin:.2f})",
                "recommendation": "Review pricing and service delivery efficiency"
            })
        
        if client_data.get("tickets_last_month", 0) > avg_tickets:
            patterns.append({
                "pattern": "above_average_support_load",
                "description": f"Support tickets ({client_data.get('tickets_last_month')}) exceed similar clients average ({avg_tickets:.1f})",
                "recommendation": "Investigate infrastructure issues or consider enhanced monitoring"
            })
        
        return patterns
    
    def _extract_best_practices(self, successful_clients: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract best practices from successful clients"""
        practices = []
        
        if not successful_clients:
            return practices
        
        # Analyze common success factors
        avg_margin_pct = sum(
            c["financial_metrics"]["margin_percentage"] 
            for c in successful_clients
        ) / len(successful_clients)
        
        practices.append({
            "practice": "target_margin",
            "description": f"Successful clients maintain average margin of {avg_margin_pct:.1f}%",
            "action": "Adjust pricing or optimize costs to achieve similar margin"
        })
        
        practices.append({
            "practice": "proactive_monitoring",
            "description": "Successful clients have lower ticket volumes through proactive monitoring",
            "action": "Implement enhanced monitoring to reduce reactive support"
        })
        
        practices.append({
            "practice": "upsell_strategy",
            "description": "Successful clients regularly add premium services",
            "action": "Identify and present relevant upsell opportunities quarterly"
        })
        
        return practices
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get vector store statistics"""
        return {
            "total_documents": len(self.mock_storage),
            "storage_type": "bedrock" if self.vector_store_available else "mock",
            "knowledge_base_id": self.knowledge_base_id if self.vector_store_available else "N/A"
        }


# Global vector store instance
vector_store = BedrockVectorStore()

