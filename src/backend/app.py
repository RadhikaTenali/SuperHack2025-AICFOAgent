from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS Bedrock client
try:
    bedrock_client = boto3.client(
        service_name='bedrock-agent-runtime',
        region_name=os.getenv('AWS_REGION', 'us-west-2'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
except Exception as e:
    print(f"Warning: Could not initialize AWS Bedrock client: {e}")
    bedrock_client = None

@app.get("/")
def read_root():
    return {"message": "Welcome to AI CFO Agent"}

@app.get("/predictive-insights/{client_id}")
def get_predictive_insights(client_id: str):
    try:
        # Placeholder for actual logic to fetch predictive insights
        insights = {
            "client_id": client_id,
            "current_margin": "-$500/month",
            "cashflow_risk": "$15K gap in 3 months if churns",
            "recommendation": "renegotiate contract or offer additional services"
        }
        return insights
    except ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "bedrock_available": bedrock_client is not None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)