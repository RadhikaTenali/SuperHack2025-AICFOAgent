@echo off
echo ========================================
echo AI CFO Agent - SuperHack 2025 Setup
echo Team Lotus - Autonomous CFO with Digital Twin
echo ========================================
echo.

echo [1/5] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.9+ first.
    pause
    exit /b 1
)

echo [2/5] Setting up Python virtual environment...
cd src\backend
python -m venv venv
call venv\Scripts\activate

echo [3/5] Installing backend dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies.
    pause
    exit /b 1
)
echo Backend setup complete.

echo [4/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo [5/5] Installing frontend dependencies...
cd ..\frontend
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies.
    pause
    exit /b 1
)
echo Frontend setup complete.

cd ..\..

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo To start the AI CFO Agent:
echo.
echo 1. Backend API:
echo    cd src\backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. Frontend Dashboard (in new terminal):
echo    cd src\frontend  
echo    npm start
echo.
echo 3. Access the application:
echo    - Dashboard: http://localhost:3000
echo    - API Docs: http://localhost:8000/docs
echo.
echo For demo preparation, see docs\DEMO_GUIDE.md
echo.
pause