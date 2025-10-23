@echo off
echo 🚀 Starting AI CFO Agent Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Build the application
echo 🔨 Building the application...
docker-compose build

REM Start the services
echo 🚀 Starting services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check if the application is running
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ AI CFO Agent is running successfully!
    echo 🌐 Frontend: http://localhost:8000
    echo 📊 API Docs: http://localhost:8000/docs
    echo ❤️ Health Check: http://localhost:8000/health
) else (
    echo ❌ Application failed to start. Check logs with: docker-compose logs
    exit /b 1
)

echo 🎉 Deployment completed successfully!
