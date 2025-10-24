#!/bin/bash

# AWS Elastic Beanstalk Deployment Script for AI CFO Agent

echo "🚀 Deploying AI CFO Agent to AWS Elastic Beanstalk..."

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI not found. Installing..."
    pip install awsebcli
fi

# Initialize EB application (if not already done)
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
    echo "📝 Initializing Elastic Beanstalk application..."
    eb init ai-cfo-agent --platform python-3.11 --region us-east-1
fi

# Create environment (if not already done)
echo "🌍 Creating Elastic Beanstalk environment..."
eb create ai-cfo-agent-env --instance-type t3.small

# Set environment variables
echo "⚙️ Setting environment variables..."
eb setenv ENVIRONMENT=production
eb setenv CORS_ORIGINS=https://ai-cfo-agent-env.us-east-1.elasticbeanstalk.com

# Deploy the application
echo "🚀 Deploying application..."
eb deploy

echo "✅ Deployment complete!"
echo "🌐 Your AI CFO Agent is now live at:"
eb status
