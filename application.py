# AWS Elastic Beanstalk entry point
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src', 'backend'))

# Import the FastAPI app
from app import app

# Create WSGI application for Elastic Beanstalk
application = app
