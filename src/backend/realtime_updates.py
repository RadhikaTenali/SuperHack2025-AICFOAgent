"""
Real-time Updates and WebSocket Support
Live dashboard updates and real-time data synchronization
"""
import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Set
from datetime import datetime, timedelta
import websockets
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.websockets import WebSocketState
import uvicorn
from threading import Thread
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Manages WebSocket connections for real-time updates
    """
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_subscriptions: Dict[WebSocket, Set[str]] = {}
        self.data_cache = {}
        self.last_update = {}
        self.update_interval = 30  # seconds
        self.is_running = False
        self.update_thread = None
        
    async def connect(self, websocket: WebSocket, subscriptions: List[str] = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_subscriptions[websocket] = set(subscriptions or [])
        logger.info(f"✅ WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_subscriptions:
            del self.connection_subscriptions[websocket]
        logger.info(f"❌ WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to a specific WebSocket"""
        try:
            if websocket.client_state == WebSocketState.CONNECTED:
                await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)
    
    async def broadcast(self, message: str, subscription_type: str = None):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return
        
        disconnected = []
        for connection in self.active_connections:
            try:
                # Check if client is subscribed to this type of update
                if subscription_type and connection in self.connection_subscriptions:
                    subscriptions = self.connection_subscriptions[connection]
                    if subscription_type not in subscriptions and "all" not in subscriptions:
                        continue
                
                if connection.client_state == WebSocketState.CONNECTED:
                    await connection.send_text(message)
                else:
                    disconnected.append(connection)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection)
    
    def update_subscription(self, websocket: WebSocket, subscriptions: List[str]):
        """Update subscription preferences for a connection"""
        if websocket in self.connection_subscriptions:
            self.connection_subscriptions[websocket] = set(subscriptions)
            logger.info(f"Updated subscriptions: {subscriptions}")
    
    def start_background_updates(self):
        """Start background thread for periodic updates"""
        if not self.is_running:
            self.is_running = True
            self.update_thread = Thread(target=self._background_update_loop, daemon=True)
            self.update_thread.start()
            logger.info("🔄 Started background update thread")
    
    def stop_background_updates(self):
        """Stop background update thread"""
        self.is_running = False
        if self.update_thread:
            self.update_thread.join()
        logger.info("⏹️ Stopped background update thread")
    
    def _background_update_loop(self):
        """Background loop for periodic data updates"""
        while self.is_running:
            try:
                # Run the async update in a new event loop
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(self._perform_background_update())
                loop.close()
            except Exception as e:
                logger.error(f"Error in background update: {e}")
            
            time.sleep(self.update_interval)
    
    async def _perform_background_update(self):
        """Perform background data update and broadcast"""
        try:
            # Update financial data
            await self._update_financial_data()
            
            # Update license data
            await self._update_license_data()
            
            # Update anomaly data
            await self._update_anomaly_data()
            
            # Update upsell opportunities
            await self._update_upsell_data()
            
        except Exception as e:
            logger.error(f"Error in background update: {e}")
    
    async def _update_financial_data(self):
        """Update financial dashboard data"""
        from superops_integration import superops_api
        
        try:
            dashboard_data = await superops_api.get_financial_dashboard_data()
            
            # Check if data has changed
            data_key = "financial_dashboard"
            if self._has_data_changed(data_key, dashboard_data):
                self.data_cache[data_key] = dashboard_data
                self.last_update[data_key] = datetime.now()
                
                message = {
                    "type": "financial_update",
                    "data": dashboard_data,
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.broadcast(json.dumps(message), "financial")
                logger.info("📊 Broadcasted financial data update")
        except Exception as e:
            logger.error(f"Error updating financial data: {e}")
    
    async def _update_license_data(self):
        """Update license optimization data"""
        from superops_integration import superops_api
        
        try:
            clients = await superops_api.get_all_clients()
            license_optimizations = []
            total_savings = 0
            
            for client in clients:
                client_optimizations = []
                for license_type, license_data in client.get('licenses', {}).items():
                    unused = license_data.get('total', 0) - license_data.get('used', 0)
                    if unused > 0:
                        monthly_savings = unused * license_data.get('cost_per_license', 0)
                        total_savings += monthly_savings * 12
                        
                        client_optimizations.append({
                            "license_type": license_type,
                            "unused_licenses": unused,
                            "monthly_savings": monthly_savings,
                            "annual_savings": monthly_savings * 12
                        })
                
                if client_optimizations:
                    license_optimizations.append({
                        "client_id": client.get('id'),
                        "client_name": client.get('name'),
                        "optimizations": client_optimizations
                    })
            
            data_key = "license_optimizations"
            optimization_data = {
                "optimizations": license_optimizations,
                "total_annual_savings": total_savings
            }
            
            if self._has_data_changed(data_key, optimization_data):
                self.data_cache[data_key] = optimization_data
                self.last_update[data_key] = datetime.now()
                
                message = {
                    "type": "license_update",
                    "data": optimization_data,
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.broadcast(json.dumps(message), "licenses")
                logger.info("🔑 Broadcasted license optimization update")
        except Exception as e:
            logger.error(f"Error updating license data: {e}")
    
    async def _update_anomaly_data(self):
        """Update anomaly detection data"""
        from superops_integration import superops_api
        
        try:
            clients = await superops_api.get_all_clients()
            anomalies = []
            
            for client in clients:
                # Check for low margin anomaly
                if client.get('margin', 0) < 0:
                    anomalies.append({
                        "type": "low_margin",
                        "severity": "high",
                        "client_id": client.get('id'),
                        "client_name": client.get('name'),
                        "description": f"Client operating at {client.get('margin')} monthly loss",
                        "impact": f"${abs(client.get('margin')) * 12} annual loss"
                    })
                
                # Check for high ticket volume
                if client.get('tickets_last_month', 0) > 30:
                    anomalies.append({
                        "type": "high_support_load",
                        "severity": "medium",
                        "client_id": client.get('id'),
                        "client_name": client.get('name'),
                        "description": f"{client.get('tickets_last_month')} tickets last month",
                        "impact": "Increased support costs"
                    })
            
            data_key = "anomalies"
            anomaly_data = {"anomalies": anomalies}
            
            if self._has_data_changed(data_key, anomaly_data):
                self.data_cache[data_key] = anomaly_data
                self.last_update[data_key] = datetime.now()
                
                message = {
                    "type": "anomaly_update",
                    "data": anomaly_data,
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.broadcast(json.dumps(message), "anomalies")
                logger.info(f"🔍 Broadcasted {len(anomalies)} anomalies")
        except Exception as e:
            logger.error(f"Error updating anomaly data: {e}")
    
    async def _update_upsell_data(self):
        """Update upsell opportunities data"""
        from superops_integration import superops_api
        
        try:
            clients = await superops_api.get_all_clients()
            opportunities = []
            
            for client in clients:
                client_opportunities = []
                
                # Security upsell based on incidents
                if client.get('security_incidents', 0) >= 5:
                    client_opportunities.append({
                        "service": "Premium Cybersecurity Package",
                        "monthly_value": 2000,
                        "annual_value": 24000,
                        "confidence": 85,
                        "reason": f"{client.get('security_incidents')} security incidents"
                    })
                
                # Support upsell based on tickets
                if client.get('tickets_last_month', 0) > 20:
                    client_opportunities.append({
                        "service": "Enhanced Support & Monitoring",
                        "monthly_value": 1200,
                        "annual_value": 14400,
                        "confidence": 75,
                        "reason": f"{client.get('tickets_last_month')} support tickets"
                    })
                
                if client_opportunities:
                    opportunities.append({
                        "client_id": client.get('id'),
                        "client_name": client.get('name'),
                        "opportunities": client_opportunities,
                        "total_potential_annual": sum(o['annual_value'] for o in client_opportunities)
                    })
            
            data_key = "upsell_opportunities"
            upsell_data = {"opportunities": opportunities}
            
            if self._has_data_changed(data_key, upsell_data):
                self.data_cache[data_key] = upsell_data
                self.last_update[data_key] = datetime.now()
                
                message = {
                    "type": "upsell_update",
                    "data": upsell_data,
                    "timestamp": datetime.now().isoformat()
                }
                
                await self.broadcast(json.dumps(message), "upsells")
                logger.info(f"📈 Broadcasted {len(opportunities)} upsell opportunities")
        except Exception as e:
            logger.error(f"Error updating upsell data: {e}")
    
    def _has_data_changed(self, data_key: str, new_data: Dict[str, Any]) -> bool:
        """Check if data has changed since last update"""
        if data_key not in self.data_cache:
            return True
        
        old_data = self.data_cache[data_key]
        
        # Simple comparison - in production, use more sophisticated diff
        return json.dumps(old_data, sort_keys=True) != json.dumps(new_data, sort_keys=True)
    
    async def send_immediate_update(self, update_type: str, data: Dict[str, Any]):
        """Send immediate update to all connected clients"""
        message = {
            "type": update_type,
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "immediate": True
        }
        
        await self.broadcast(json.dumps(message))
        logger.info(f"⚡ Sent immediate update: {update_type}")
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        return {
            "active_connections": len(self.active_connections),
            "subscription_types": list(set(
                sub for subs in self.connection_subscriptions.values() 
                for sub in subs
            )),
            "cached_data_keys": list(self.data_cache.keys()),
            "last_updates": {
                key: value.isoformat() 
                for key, value in self.last_update.items()
            },
            "update_interval": self.update_interval,
            "is_running": self.is_running
        }


# Global connection manager
connection_manager = ConnectionManager()


class RealtimeDataService:
    """
    Service for managing real-time data updates
    """
    
    def __init__(self):
        self.manager = connection_manager
        self.start_time = datetime.now()
        self.update_count = 0
    
    async def start_service(self):
        """Start the real-time data service"""
        self.manager.start_background_updates()
        logger.info("🚀 Real-time data service started")
    
    async def stop_service(self):
        """Stop the real-time data service"""
        self.manager.stop_background_updates()
        logger.info("⏹️ Real-time data service stopped")
    
    async def trigger_manual_update(self, update_type: str = "all"):
        """Manually trigger a data update"""
        try:
            if update_type == "all" or update_type == "financial":
                await self.manager._update_financial_data()
            
            if update_type == "all" or update_type == "licenses":
                await self.manager._update_license_data()
            
            if update_type == "all" or update_type == "anomalies":
                await self.manager._update_anomaly_data()
            
            if update_type == "all" or update_type == "upsells":
                await self.manager._update_upsell_data()
            
            self.update_count += 1
            logger.info(f"🔄 Manual update triggered: {update_type}")
            
        except Exception as e:
            logger.error(f"Error in manual update: {e}")
    
    async def send_custom_alert(self, alert_type: str, message: str, data: Dict[str, Any] = None):
        """Send a custom alert to all connected clients"""
        alert_data = {
            "alert_type": alert_type,
            "message": message,
            "data": data or {},
            "timestamp": datetime.now().isoformat()
        }
        
        await self.manager.send_immediate_update("custom_alert", alert_data)
        logger.info(f"🚨 Custom alert sent: {alert_type}")
    
    def get_service_stats(self) -> Dict[str, Any]:
        """Get service statistics"""
        return {
            "uptime_seconds": (datetime.now() - self.start_time).total_seconds(),
            "total_updates": self.update_count,
            "connection_stats": self.manager.get_connection_stats()
        }


# Global real-time service
realtime_service = RealtimeDataService()
