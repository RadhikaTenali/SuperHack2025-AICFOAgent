# AWS Lambda handler for AI CFO Agent
from mangum import Mangum
from app import app

# Create Lambda handler
handler = Mangum(app, lifespan="off")

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
