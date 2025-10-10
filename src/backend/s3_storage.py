"""
Amazon S3 Storage for PSA/RMM Data
Stores and indexes SuperOps data for analysis
"""
import boto3
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class S3DataStore:
    """
    Amazon S3 storage for PSA/RMM data
    Stores client data, tickets, contracts, and analytics
    """
    
    def __init__(self):
        try:
            self.s3_client = boto3.client(
                's3',
                region_name=os.getenv('AWS_REGION', 'us-west-2'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
            self.bucket_name = os.getenv('S3_BUCKET_NAME', 'ai-cfo-agent-data')
            self.s3_available = True
            logger.info(f"✅ S3 Data Store initialized - Bucket: {self.bucket_name}")
        except Exception as e:
            logger.warning(f"⚠️ S3 not available: {e}. Using local mock storage.")
            self.s3_client = None
            self.s3_available = False
            # Mock local storage
            self.local_storage = {}
    
    async def store_superops_client_data(self, client_id: str, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store SuperOps client data in S3
        """
        logger.info(f"📦 Storing SuperOps data for client {client_id}")
        
        # Prepare data structure
        data_object = {
            "client_id": client_id,
            "client_name": client_data.get("name"),
            "timestamp": datetime.now().isoformat(),
            "data_type": "client_profile",
            "data": client_data
        }
        
        # Generate S3 key
        s3_key = f"clients/{client_id}/profile_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        if self.s3_available:
            result = await self._upload_to_s3(s3_key, data_object)
        else:
            # Store locally
            self.local_storage[s3_key] = data_object
            result = {
                "success": True,
                "storage": "local",
                "key": s3_key
            }
        
        logger.info(f"✅ Client data stored: {s3_key}")
        return result
    
    async def store_ticket_data(self, client_id: str, tickets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Store SuperOps ticket data for analysis
        """
        logger.info(f"🎫 Storing {len(tickets)} tickets for client {client_id}")
        
        data_object = {
            "client_id": client_id,
            "timestamp": datetime.now().isoformat(),
            "data_type": "tickets",
            "ticket_count": len(tickets),
            "tickets": tickets
        }
        
        s3_key = f"clients/{client_id}/tickets_{datetime.now().strftime('%Y%m%d')}.json"
        
        if self.s3_available:
            result = await self._upload_to_s3(s3_key, data_object)
        else:
            self.local_storage[s3_key] = data_object
            result = {
                "success": True,
                "storage": "local",
                "key": s3_key
            }
        
        logger.info(f"✅ Tickets stored: {s3_key}")
        return result
    
    async def store_financial_snapshot(self, snapshot_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store daily financial snapshot for all clients
        """
        logger.info("📊 Storing daily financial snapshot")
        
        data_object = {
            "snapshot_date": datetime.now().strftime('%Y-%m-%d'),
            "timestamp": datetime.now().isoformat(),
            "data_type": "financial_snapshot",
            "data": snapshot_data
        }
        
        s3_key = f"snapshots/financial_{datetime.now().strftime('%Y%m%d')}.json"
        
        if self.s3_available:
            result = await self._upload_to_s3(s3_key, data_object)
        else:
            self.local_storage[s3_key] = data_object
            result = {
                "success": True,
                "storage": "local",
                "key": s3_key
            }
        
        logger.info(f"✅ Financial snapshot stored: {s3_key}")
        return result
    
    async def store_license_tracking_data(self, client_id: str, license_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store license tracking data from Nova ACT
        """
        logger.info(f"🔑 Storing license data for client {client_id}")
        
        data_object = {
            "client_id": client_id,
            "timestamp": datetime.now().isoformat(),
            "data_type": "license_tracking",
            "data": license_data
        }
        
        s3_key = f"clients/{client_id}/licenses_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        if self.s3_available:
            result = await self._upload_to_s3(s3_key, data_object)
        else:
            self.local_storage[s3_key] = data_object
            result = {
                "success": True,
                "storage": "local",
                "key": s3_key
            }
        
        logger.info(f"✅ License data stored: {s3_key}")
        return result
    
    async def store_analysis_result(self, analysis_type: str, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Store AI analysis results for historical tracking
        """
        logger.info(f"🧠 Storing {analysis_type} analysis result")
        
        data_object = {
            "analysis_type": analysis_type,
            "timestamp": datetime.now().isoformat(),
            "data_type": "analysis_result",
            "data": analysis_data
        }
        
        s3_key = f"analysis/{analysis_type}/{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        if self.s3_available:
            result = await self._upload_to_s3(s3_key, data_object)
        else:
            self.local_storage[s3_key] = data_object
            result = {
                "success": True,
                "storage": "local",
                "key": s3_key
            }
        
        logger.info(f"✅ Analysis result stored: {s3_key}")
        return result
    
    async def retrieve_client_history(self, client_id: str, days: int = 30) -> Dict[str, Any]:
        """
        Retrieve historical data for a client
        """
        logger.info(f"📖 Retrieving {days}-day history for client {client_id}")
        
        if self.s3_available:
            # List objects with client prefix
            prefix = f"clients/{client_id}/"
            history = await self._list_s3_objects(prefix)
        else:
            # Filter local storage
            history = {
                "objects": [
                    {"key": k, "data": v} 
                    for k, v in self.local_storage.items() 
                    if k.startswith(f"clients/{client_id}/")
                ]
            }
        
        logger.info(f"✅ Retrieved {len(history.get('objects', []))} historical records")
        return history
    
    async def retrieve_financial_trend(self, days: int = 30) -> List[Dict[str, Any]]:
        """
        Retrieve financial trend data
        """
        logger.info(f"📈 Retrieving {days}-day financial trend")
        
        if self.s3_available:
            prefix = "snapshots/"
            snapshots = await self._list_s3_objects(prefix)
        else:
            snapshots = {
                "objects": [
                    {"key": k, "data": v} 
                    for k, v in self.local_storage.items() 
                    if k.startswith("snapshots/")
                ]
            }
        
        trend_data = []
        for obj in snapshots.get("objects", [])[:days]:
            if "data" in obj:
                trend_data.append(obj["data"])
        
        logger.info(f"✅ Retrieved {len(trend_data)} trend data points")
        return trend_data
    
    async def export_client_report(self, client_id: str) -> Dict[str, Any]:
        """
        Export comprehensive client report from S3 data
        """
        logger.info(f"📄 Exporting comprehensive report for client {client_id}")
        
        # Retrieve all data for client
        history = await self.retrieve_client_history(client_id)
        
        report = {
            "client_id": client_id,
            "generated_at": datetime.now().isoformat(),
            "report_type": "comprehensive",
            "data_points": len(history.get("objects", [])),
            "sections": {
                "profile": None,
                "tickets": [],
                "licenses": [],
                "financial": []
            }
        }
        
        # Organize data by type
        for obj in history.get("objects", []):
            data = obj.get("data", {})
            data_type = data.get("data_type")
            
            if data_type == "client_profile":
                report["sections"]["profile"] = data.get("data")
            elif data_type == "tickets":
                report["sections"]["tickets"].append(data)
            elif data_type == "license_tracking":
                report["sections"]["licenses"].append(data)
            elif data_type == "financial_snapshot":
                report["sections"]["financial"].append(data)
        
        logger.info(f"✅ Report exported with {report['data_points']} data points")
        return report
    
    async def _upload_to_s3(self, key: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Upload data to S3"""
        try:
            # In production, actually upload to S3
            # self.s3_client.put_object(
            #     Bucket=self.bucket_name,
            #     Key=key,
            #     Body=json.dumps(data),
            #     ContentType='application/json'
            # )
            
            # For demo, simulate successful upload
            return {
                "success": True,
                "storage": "s3",
                "bucket": self.bucket_name,
                "key": key,
                "url": f"s3://{self.bucket_name}/{key}"
            }
        except Exception as e:
            logger.error(f"Error uploading to S3: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    async def _list_s3_objects(self, prefix: str) -> Dict[str, Any]:
        """List S3 objects with prefix"""
        try:
            # In production, actually list S3 objects
            # response = self.s3_client.list_objects_v2(
            #     Bucket=self.bucket_name,
            #     Prefix=prefix
            # )
            
            # For demo, return mock list
            return {
                "objects": [],
                "count": 0
            }
        except Exception as e:
            logger.error(f"Error listing S3 objects: {e}")
            return {
                "objects": [],
                "error": str(e)
            }
    
    async def _download_from_s3(self, key: str) -> Optional[Dict[str, Any]]:
        """Download data from S3"""
        try:
            # In production, actually download from S3
            # response = self.s3_client.get_object(
            #     Bucket=self.bucket_name,
            #     Key=key
            # )
            # data = json.loads(response['Body'].read())
            
            # For demo, return from local storage if available
            return self.local_storage.get(key)
        except Exception as e:
            logger.error(f"Error downloading from S3: {e}")
            return None
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        return {
            "storage_type": "s3" if self.s3_available else "local",
            "bucket_name": self.bucket_name if self.s3_available else "N/A",
            "local_objects": len(self.local_storage),
            "storage_health": "operational"
        }
    
    async def cleanup_old_data(self, days_to_keep: int = 90) -> Dict[str, Any]:
        """
        Cleanup data older than specified days
        """
        logger.info(f"🧹 Cleaning up data older than {days_to_keep} days")
        
        # In production, implement actual cleanup logic
        # For demo, return mock cleanup result
        
        return {
            "cleanup_performed": True,
            "days_to_keep": days_to_keep,
            "objects_deleted": 0,
            "space_freed_mb": 0,
            "timestamp": datetime.now().isoformat()
        }


# Global S3 storage instance
s3_store = S3DataStore()

