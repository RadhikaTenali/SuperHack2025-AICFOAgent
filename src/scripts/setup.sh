#!/bin/bash

echo "Setting up AI CFO Agent..."

# Backend setup
echo "Setting up backend..."
cd src/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ../..

# Frontend setup
echo "Setting up frontend..."
cd src/frontend
npm install
cd ../..

echo "Setup complete!"
echo "To run the backend: cd src/backend && uvicorn app:app --reload"
echo "To run the frontend: cd src/frontend && npm start"