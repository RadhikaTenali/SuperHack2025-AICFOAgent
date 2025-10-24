# 🚀 AWS Deployment Guide for AI CFO Agent

## 🎯 **AWS Deployment Options**

### **Option 1: AWS Elastic Beanstalk (Recommended)**
**Best for**: Easy deployment, automatic scaling, AWS integration

### **Option 2: AWS Amplify + Lambda**
**Best for**: Serverless architecture, cost-effective

### **Option 3: AWS ECS + Fargate**
**Best for**: Full container control, production workloads

---

## 🚀 **Option 1: AWS Elastic Beanstalk**

### **Prerequisites**
- AWS Account
- AWS CLI installed
- EB CLI installed

### **Step 1: Install AWS EB CLI**
```bash
pip install awsebcli
```

### **Step 2: Configure AWS CLI**
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

### **Step 3: Deploy to Elastic Beanstalk**
```bash
# Initialize EB application
eb init ai-cfo-agent --platform python-3.11 --region us-east-1

# Create environment
eb create ai-cfo-agent-env --instance-type t3.small

# Set environment variables
eb setenv ENVIRONMENT=production
eb setenv CORS_ORIGINS=https://ai-cfo-agent-env.us-east-1.elasticbeanstalk.com
eb setenv AWS_ACCESS_KEY_ID=your-aws-access-key
eb setenv AWS_SECRET_ACCESS_KEY=your-aws-secret-key
eb setenv AWS_DEFAULT_REGION=us-east-1

# Deploy
eb deploy
```

### **Step 4: Get Your URL**
```bash
eb status
# Your URL will be: https://ai-cfo-agent-env.us-east-1.elasticbeanstalk.com
```

---

## 🔄 **Option 2: AWS Amplify + Lambda**

### **Frontend (Amplify)**
1. **Go to**: AWS Amplify Console
2. **Click**: "New app" → "Host web app"
3. **Connect**: Your GitHub repository
4. **Configure**:
   - **Build Command**: `cd src/frontend && npm run build`
   - **Output Directory**: `src/frontend/build`
   - **Base Directory**: `src/frontend`

### **Backend (Lambda + API Gateway)**
1. **Create Lambda function**:
   - Runtime: Python 3.11
   - Handler: `app.lambda_handler`

2. **Create API Gateway**:
   - REST API
   - Integrate with Lambda
   - Deploy to production

---

## ☁️ **Option 3: AWS ECS + Fargate**

### **Step 1: Create ECR Repository**
```bash
aws ecr create-repository --repository-name ai-cfo-agent
```

### **Step 2: Build and Push Docker Image**
```bash
# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t ai-cfo-agent .

# Tag image
docker tag ai-cfo-agent:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-cfo-agent:latest

# Push image
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-cfo-agent:latest
```

### **Step 3: Create ECS Cluster and Service**
```bash
# Create cluster
aws ecs create-cluster --cluster-name ai-cfo-agent-cluster

# Create task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service --cluster ai-cfo-agent-cluster --service-name ai-cfo-agent-service --task-definition ai-cfo-agent:1 --desired-count 1
```

---

## ⚙️ **Environment Variables for AWS**

### **Required Variables**
```env
ENVIRONMENT=production
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1
```

### **Optional Variables**
```env
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SuperOps Integration
SUPEROPS_API_KEY=your-superops-api-key

# Slack Integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

---

## 🎯 **Quick Start (Elastic Beanstalk)**

### **1. Run the deployment script**
```bash
chmod +x aws-deploy.sh
./aws-deploy.sh
```

### **2. Your app will be live at**
`https://ai-cfo-agent-env.us-east-1.elasticbeanstalk.com`

---

## 🔧 **AWS Integration Benefits**

### **✅ Native AWS Services**
- **AWS Bedrock**: AI reasoning and analysis
- **AWS S3**: File storage and reports
- **AWS Lambda**: Serverless functions
- **AWS API Gateway**: API management
- **AWS CloudWatch**: Monitoring and logging

### **✅ Cost Optimization**
- **Free Tier**: 750 hours/month for t2.micro
- **Pay-as-you-scale**: Only pay for what you use
- **Auto-scaling**: Automatic resource adjustment

### **✅ Security**
- **IAM Roles**: Secure access control
- **VPC**: Network isolation
- **SSL/TLS**: Encrypted communication

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### 1. EB CLI Not Found
```bash
pip install awsebcli
```

#### 2. AWS Credentials Not Set
```bash
aws configure
```

#### 3. Deployment Fails
```bash
eb logs
eb health
```

#### 4. Environment Variables Not Loading
```bash
eb setenv VARIABLE_NAME=value
```

---

## 🎉 **Success Checklist**

- [ ] AWS CLI configured
- [ ] EB CLI installed
- [ ] Application deployed
- [ ] Environment variables set
- [ ] Health check passing
- [ ] API endpoints working
- [ ] AWS services integrated

---

**Your AI CFO Agent is now running on AWS! 🚀**
