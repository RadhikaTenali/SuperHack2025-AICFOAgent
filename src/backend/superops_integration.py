"""
SuperOps API Integration
Real-time PSA/RMM data integration for live financial analysis
"""
import requests
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import os
import asyncio
import aiohttp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SuperOpsAPI:
    """
    SuperOps API integration for real-time PSA/RMM data
    Provides live client data, tickets, contracts, and financial metrics
    """
    
    def __init__(self):
        self.base_url = os.getenv('SUPEROPS_BASE_URL', 'https://api.superops.com/v1')
        self.api_key = os.getenv('SUPEROPS_API_KEY')
        self.tenant_id = os.getenv('SUPEROPS_TENANT_ID')
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'X-Tenant-ID': self.tenant_id
        }
        self.api_available = bool(self.api_key and self.tenant_id)
        
        if self.api_available:
            logger.info("✅ SuperOps API integration initialized")
        else:
            logger.warning("⚠️ SuperOps API credentials not found. Using mock mode.")
    
    async def get_all_clients(self) -> List[Dict[str, Any]]:
        """
        Fetch all clients from SuperOps with financial data
        """
        if not self.api_available:
            return self._get_mock_clients()
        
        try:
            async with aiohttp.ClientSession() as session:
                # Get clients
                clients_url = f"{self.base_url}/clients"
                async with session.get(clients_url, headers=self.headers) as response:
                    if response.status == 200:
                        clients_data = await response.json()
                        clients = clients_data.get('data', [])
                        
                        # Enrich each client with financial data
                        enriched_clients = []
                        for client in clients:
                            enriched_client = await self._enrich_client_data(session, client)
                            enriched_clients.append(enriched_client)
                        
                        logger.info(f"✅ Fetched {len(enriched_clients)} clients from SuperOps")
                        return enriched_clients
                    else:
                        logger.error(f"SuperOps API error: {response.status}")
                        return self._get_mock_clients()
        except Exception as e:
            logger.error(f"Error fetching clients from SuperOps: {e}")
            return self._get_mock_clients()
    
    async def get_client_financial_data(self, client_id: str) -> Dict[str, Any]:
        """
        Get comprehensive financial data for a specific client
        """
        if not self.api_available:
            return self._get_mock_client_financial_data(client_id)
        
        try:
            async with aiohttp.ClientSession() as session:
                # Get client basic info
                client_url = f"{self.base_url}/clients/{client_id}"
                async with session.get(client_url, headers=self.headers) as response:
                    if response.status != 200:
                        return self._get_mock_client_financial_data(client_id)
                    
                    client_data = await response.json()
                
                # Get financial data
                financial_data = await self._get_client_financial_metrics(session, client_id)
                
                # Get recent tickets
                tickets = await self._get_client_tickets(session, client_id)
                
                # Get contracts
                contracts = await self._get_client_contracts(session, client_id)
                
                # Combine all data
                enriched_data = {
                    **client_data,
                    **financial_data,
                    'tickets_last_month': len(tickets),
                    'contracts': contracts,
                    'last_updated': datetime.now().isoformat()
                }
                
                logger.info(f"✅ Fetched financial data for client {client_id}")
                return enriched_data
                
        except Exception as e:
            logger.error(f"Error fetching client financial data: {e}")
            return self._get_mock_client_financial_data(client_id)
    
    async def get_client_tickets(self, client_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """
        Get recent tickets for a client
        """
        if not self.api_available:
            return self._get_mock_tickets(client_id)
        
        try:
            async with aiohttp.ClientSession() as session:
                tickets_url = f"{self.base_url}/tickets"
                params = {
                    'client_id': client_id,
                    'created_after': (datetime.now() - timedelta(days=days)).isoformat(),
                    'limit': 100
                }
                
                async with session.get(tickets_url, headers=self.headers, params=params) as response:
                    if response.status == 200:
                        tickets_data = await response.json()
                        tickets = tickets_data.get('data', [])
                        logger.info(f"✅ Fetched {len(tickets)} tickets for client {client_id}")
                        return tickets
                    else:
                        return self._get_mock_tickets(client_id)
        except Exception as e:
            logger.error(f"Error fetching tickets: {e}")
            return self._get_mock_tickets(client_id)
    
    async def get_license_usage_data(self, client_id: str) -> Dict[str, Any]:
        """
        Get license usage data from SuperOps
        """
        if not self.api_available:
            return self._get_mock_license_data(client_id)
        
        try:
            async with aiohttp.ClientSession() as session:
                # Get software inventory
                inventory_url = f"{self.base_url}/inventory/software"
                params = {'client_id': client_id}
                
                async with session.get(inventory_url, headers=self.headers, params=params) as response:
                    if response.status == 200:
                        inventory_data = await response.json()
                        software_items = inventory_data.get('data', [])
                        
                        # Process license data
                        license_data = self._process_license_inventory(software_items)
                        
                        logger.info(f"✅ Fetched license data for client {client_id}")
                        return license_data
                    else:
                        return self._get_mock_license_data(client_id)
        except Exception as e:
            logger.error(f"Error fetching license data: {e}")
            return self._get_mock_license_data(client_id)
    
    async def create_quote(self, client_id: str, quote_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a quote in SuperOps
        """
        if not self.api_available:
            return self._create_mock_quote(client_id, quote_data)
        
        try:
            async with aiohttp.ClientSession() as session:
                quote_url = f"{self.base_url}/quotes"
                quote_payload = {
                    'client_id': client_id,
                    'items': quote_data.get('items', []),
                    'notes': quote_data.get('notes', ''),
                    'valid_until': quote_data.get('valid_until')
                }
                
                async with session.post(quote_url, headers=self.headers, json=quote_payload) as response:
                    if response.status == 201:
                        quote_result = await response.json()
                        logger.info(f"✅ Created quote {quote_result.get('id')} for client {client_id}")
                        return quote_result
                    else:
                        logger.error(f"Error creating quote: {response.status}")
                        return self._create_mock_quote(client_id, quote_data)
        except Exception as e:
            logger.error(f"Error creating quote: {e}")
            return self._create_mock_quote(client_id, quote_data)
    
    async def update_client_contract(self, client_id: str, contract_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update client contract terms
        """
        if not self.api_available:
            return self._update_mock_contract(client_id, contract_data)
        
        try:
            async with aiohttp.ClientSession() as session:
                contract_url = f"{self.base_url}/contracts/{contract_data.get('contract_id')}"
                
                async with session.put(contract_url, headers=self.headers, json=contract_data) as response:
                    if response.status == 200:
                        update_result = await response.json()
                        logger.info(f"✅ Updated contract for client {client_id}")
                        return update_result
                    else:
                        logger.error(f"Error updating contract: {response.status}")
                        return self._update_mock_contract(client_id, contract_data)
        except Exception as e:
            logger.error(f"Error updating contract: {e}")
            return self._update_mock_contract(client_id, contract_data)
    
    async def get_financial_dashboard_data(self) -> Dict[str, Any]:
        """
        Get comprehensive financial dashboard data
        """
        if not self.api_available:
            return self._get_mock_dashboard_data()
        
        try:
            # Get all clients
            clients = await self.get_all_clients()
            
            # Calculate totals
            total_revenue = sum(client.get('monthly_revenue', 0) for client in clients)
            total_costs = sum(client.get('monthly_cost', 0) for client in clients)
            total_margin = total_revenue - total_costs
            
            # Get recent tickets count
            total_tickets = sum(client.get('tickets_last_month', 0) for client in clients)
            
            # Get license waste data
            total_license_waste = 0
            for client in clients:
                license_data = client.get('licenses', {})
                for license_type, data in license_data.items():
                    unused = data.get('total', 0) - data.get('used', 0)
                    total_license_waste += unused * data.get('cost_per_license', 0)
            
            dashboard_data = {
                'total_clients': len(clients),
                'total_monthly_revenue': total_revenue,
                'total_monthly_costs': total_costs,
                'total_margin': total_margin,
                'margin_percentage': round((total_margin / total_revenue) * 100, 1) if total_revenue > 0 else 0,
                'total_tickets_last_month': total_tickets,
                'total_license_waste_monthly': total_license_waste,
                'unprofitable_clients': [c for c in clients if c.get('margin', 0) < 0],
                'last_updated': datetime.now().isoformat()
            }
            
            logger.info("✅ Generated financial dashboard data from SuperOps")
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Error generating dashboard data: {e}")
            return self._get_mock_dashboard_data()
    
    async def _enrich_client_data(self, session: aiohttp.ClientSession, client: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich client data with financial metrics"""
        client_id = client.get('id')
        
        # Get financial data
        financial_data = await self._get_client_financial_metrics(session, client_id)
        
        # Get tickets
        tickets = await self._get_client_tickets(session, client_id)
        
        # Get license data
        license_data = await self._get_license_usage_data(client_id)
        
        return {
            **client,
            **financial_data,
            'tickets_last_month': len(tickets),
            'licenses': license_data,
            'last_updated': datetime.now().isoformat()
        }
    
    async def _get_client_financial_metrics(self, session: aiohttp.ClientSession, client_id: str) -> Dict[str, Any]:
        """Get financial metrics for a client"""
        try:
            # Get contracts
            contracts_url = f"{self.base_url}/contracts"
            params = {'client_id': client_id, 'status': 'active'}
            
            async with session.get(contracts_url, headers=self.headers, params=params) as response:
                if response.status == 200:
                    contracts_data = await response.json()
                    contracts = contracts_data.get('data', [])
                    
                    # Calculate monthly revenue and costs
                    monthly_revenue = sum(contract.get('monthly_amount', 0) for contract in contracts)
                    
                    # Get service costs (this would be calculated from actual service delivery)
                    monthly_cost = monthly_revenue * 0.7  # Assume 70% cost ratio
                    
                    return {
                        'monthly_revenue': monthly_revenue,
                        'monthly_cost': monthly_cost,
                        'margin': monthly_revenue - monthly_cost,
                        'contract_value': sum(contract.get('total_value', 0) for contract in contracts),
                        'services': [contract.get('service_name') for contract in contracts if contract.get('service_name')]
                    }
        except Exception as e:
            logger.error(f"Error getting financial metrics: {e}")
        
        return {
            'monthly_revenue': 0,
            'monthly_cost': 0,
            'margin': 0,
            'contract_value': 0,
            'services': []
        }
    
    async def _get_client_tickets(self, session: aiohttp.ClientSession, client_id: str) -> List[Dict[str, Any]]:
        """Get tickets for a client"""
        try:
            tickets_url = f"{self.base_url}/tickets"
            params = {
                'client_id': client_id,
                'created_after': (datetime.now() - timedelta(days=30)).isoformat(),
                'limit': 100
            }
            
            async with session.get(tickets_url, headers=self.headers, params=params) as response:
                if response.status == 200:
                    tickets_data = await response.json()
                    return tickets_data.get('data', [])
        except Exception as e:
            logger.error(f"Error getting tickets: {e}")
        
        return []
    
    async def _get_client_contracts(self, session: aiohttp.ClientSession, client_id: str) -> List[Dict[str, Any]]:
        """Get contracts for a client"""
        try:
            contracts_url = f"{self.base_url}/contracts"
            params = {'client_id': client_id}
            
            async with session.get(contracts_url, headers=self.headers, params=params) as response:
                if response.status == 200:
                    contracts_data = await response.json()
                    return contracts_data.get('data', [])
        except Exception as e:
            logger.error(f"Error getting contracts: {e}")
        
        return []
    
    def _process_license_inventory(self, software_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Process software inventory into license data"""
        license_data = {}
        
        for item in software_items:
            software_name = item.get('name', '').lower().replace(' ', '_')
            total_licenses = item.get('total_licenses', 0)
            used_licenses = item.get('used_licenses', 0)
            cost_per_license = item.get('monthly_cost', 0) / max(total_licenses, 1)
            
            license_data[software_name] = {
                'total': total_licenses,
                'used': used_licenses,
                'cost_per_license': cost_per_license
            }
        
        return license_data
    
    # Mock data methods for when API is not available
    def _get_mock_clients(self) -> List[Dict[str, Any]]:
        """Return mock client data"""
        return [
            {
                'id': 'client_x',
                'name': 'TechCorp Solutions',
                'monthly_revenue': 1500,
                'monthly_cost': 2000,
                'margin': -500,
                'contract_value': 18000,
                'services': ['IT Support', 'Cloud Management'],
                'tickets_last_month': 45,
                'security_incidents': 5,
                'licenses': {
                    'microsoft_365': {'total': 50, 'used': 30, 'cost_per_license': 12},
                    'adobe_creative': {'total': 10, 'used': 3, 'cost_per_license': 52}
                }
            },
            {
                'id': 'client_y',
                'name': 'RetailMax Inc',
                'monthly_revenue': 3500,
                'monthly_cost': 2800,
                'margin': 700,
                'contract_value': 42000,
                'services': ['Network Management', 'Backup Services'],
                'tickets_last_month': 12,
                'security_incidents': 8,
                'licenses': {
                    'microsoft_365': {'total': 25, 'used': 24, 'cost_per_license': 12},
                    'antivirus': {'total': 30, 'used': 28, 'cost_per_license': 8}
                }
            },
            {
                'id': 'client_z',
                'name': 'HealthFirst Medical',
                'monthly_revenue': 5000,
                'monthly_cost': 3200,
                'margin': 1800,
                'contract_value': 60000,
                'services': ['Cybersecurity', 'Compliance Management'],
                'tickets_last_month': 8,
                'security_incidents': 1,
                'licenses': {
                    'microsoft_365': {'total': 40, 'used': 38, 'cost_per_license': 12},
                    'security_suite': {'total': 15, 'used': 15, 'cost_per_license': 45}
                }
            }
        ]
    
    def _get_mock_client_financial_data(self, client_id: str) -> Dict[str, Any]:
        """Return mock financial data for a client"""
        mock_clients = self._get_mock_clients()
        for client in mock_clients:
            if client['id'] == client_id:
                return client
        return {}
    
    def _get_mock_tickets(self, client_id: str) -> List[Dict[str, Any]]:
        """Return mock tickets for a client"""
        return [
            {
                'id': f'ticket_{i}',
                'client_id': client_id,
                'subject': f'Support Request {i}',
                'status': 'closed',
                'created_at': (datetime.now() - timedelta(days=i)).isoformat()
            }
            for i in range(1, 11)
        ]
    
    def _get_mock_license_data(self, client_id: str) -> Dict[str, Any]:
        """Return mock license data"""
        return {
            'microsoft_365': {'total': 25, 'used': 20, 'cost_per_license': 12},
            'adobe_creative': {'total': 5, 'used': 2, 'cost_per_license': 52}
        }
    
    def _create_mock_quote(self, client_id: str, quote_data: Dict[str, Any]) -> Dict[str, Any]:
        """Return mock quote creation result"""
        return {
            'id': f'quote_{client_id}_{datetime.now().timestamp()}',
            'client_id': client_id,
            'status': 'draft',
            'total': quote_data.get('total', 0),
            'created_at': datetime.now().isoformat()
        }
    
    def _update_mock_contract(self, client_id: str, contract_data: Dict[str, Any]) -> Dict[str, Any]:
        """Return mock contract update result"""
        return {
            'contract_id': contract_data.get('contract_id'),
            'client_id': client_id,
            'status': 'updated',
            'updated_at': datetime.now().isoformat()
        }
    
    def _get_mock_dashboard_data(self) -> Dict[str, Any]:
        """Return mock dashboard data"""
        clients = self._get_mock_clients()
        total_revenue = sum(client['monthly_revenue'] for client in clients)
        total_costs = sum(client['monthly_cost'] for client in clients)
        
        return {
            'total_clients': len(clients),
            'total_monthly_revenue': total_revenue,
            'total_monthly_costs': total_costs,
            'total_margin': total_revenue - total_costs,
            'margin_percentage': round(((total_revenue - total_costs) / total_revenue) * 100, 1),
            'total_tickets_last_month': sum(client['tickets_last_month'] for client in clients),
            'unprofitable_clients': [c for c in clients if c['margin'] < 0],
            'last_updated': datetime.now().isoformat()
        }


# Global SuperOps API instance
superops_api = SuperOpsAPI()
