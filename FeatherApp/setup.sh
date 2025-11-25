#!/bin/bash

# Feather Project Setup Script
# This script sets up the development environment for the Feather application

set -e

echo "🪶 Setting up Feather Development Environment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ from https://python.org/"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    if [[ "$PYTHON_VERSION" < "3.11" ]]; then
        print_warning "Python 3.11+ is recommended. Current version: $PYTHON_VERSION"
    fi
    
    print_success "Requirements check passed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Copy environment file
    if [ ! -f ".env" ]; then
        print_status "Creating backend environment file..."
        cp env.example .env
        print_warning "Please review and update backend/.env with your settings"
    fi
    
    # Initialize database
    print_status "Initializing database..."
    python -c "from app.db.init_db import init_db; init_db()"
    
    cd ..
    print_success "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f ".env" ]; then
        print_status "Creating frontend environment file..."
        cp env.example .env
        print_warning "Please review and update frontend/.env with your settings"
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Backend tests
    print_status "Running backend tests..."
    cd backend
    source venv/bin/activate
    python -m pytest --tb=short
    cd ..
    
    # Frontend tests
    print_status "Running frontend tests..."
    cd frontend
    npm run test -- --run
    cd ..
    
    print_success "All tests passed"
}

# Main setup function
main() {
    echo ""
    print_status "Starting Feather project setup..."
    echo ""
    
    # Check requirements
    check_requirements
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Run tests
    if [ "$1" = "--test" ]; then
        run_tests
    fi
    
    echo ""
    print_success "🎉 Feather project setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend:"
    echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
    echo ""
    echo "2. Start the frontend (in a new terminal):"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "3. Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    echo "For Docker setup:"
    echo "   docker-compose up --build"
    echo ""
}

# Run main function with all arguments
main "$@"
