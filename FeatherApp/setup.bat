@echo off
REM Feather Project Setup Script for Windows
REM This script sets up the development environment for the Feather application

echo 🪶 Setting up Feather Development Environment
echo ==============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.11+ from https://python.org/
    pause
    exit /b 1
)

echo [SUCCESS] Requirements check passed
echo.

REM Setup backend
echo [INFO] Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo [INFO] Installing Python dependencies...
call venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

REM Copy environment file
if not exist ".env" (
    echo [INFO] Creating backend environment file...
    copy env.example .env
    echo [WARNING] Please review and update backend\.env with your settings
)

REM Initialize database
echo [INFO] Initializing database...
python -c "from app.db.init_db import init_db; init_db()"

cd ..
echo [SUCCESS] Backend setup completed
echo.

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend

REM Install dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Copy environment file
if not exist ".env" (
    echo [INFO] Creating frontend environment file...
    copy env.example .env
    echo [WARNING] Please review and update frontend\.env with your settings
)

cd ..
echo [SUCCESS] Frontend setup completed
echo.

echo [SUCCESS] 🎉 Feather project setup completed successfully!
echo.
echo Next steps:
echo 1. Start the backend:
echo    cd backend ^&^& venv\Scripts\activate ^&^& uvicorn app.main:app --reload
echo.
echo 2. Start the frontend (in a new terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Access the application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo For Docker setup:
echo    docker-compose up --build
echo.
pause
