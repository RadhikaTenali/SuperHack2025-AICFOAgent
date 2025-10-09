#!/bin/bash

# Function to print messages in color
print_message() {
    echo -e "\033[1;32m$1\033[0m"
}

print_message "Setting up AI CFO Agent..."

# Install backend dependencies
print_message "Setting up the backend..."
cd src/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
print_message "Backend setup complete."

# Install frontend dependencies
print_message "Setting up the frontend..."
cd ../frontend
npm install
print_message "Frontend setup complete."

cd ../..

print_message "Setup completed successfully! You can now run the backend and frontend servers."
print_message "To run the backend: cd src/backend && source venv/bin/activate && uvicorn app:app --reload"
print_message "To run the frontend: cd src/frontend && npm start"