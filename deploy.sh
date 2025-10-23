#!/bin/bash

# AI CFO Agent Deployment Script
echo "🚀 Starting AI CFO Agent Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the application
echo "🔨 Building the application..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if the application is running
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ AI CFO Agent is running successfully!"
    echo "🌐 Frontend: http://localhost:8000"
    echo "📊 API Docs: http://localhost:8000/docs"
    echo "❤️ Health Check: http://localhost:8000/health"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
