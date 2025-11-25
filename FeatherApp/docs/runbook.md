# Feather Runbook

This document provides operational guidance for running and maintaining the Feather application.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd feather
```

2. **Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
uvicorn app.main:app --reload
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
cp env.example .env
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Environment Configuration

### Backend Environment Variables
```bash
# .env file
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./feather.db
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Environment Variables
```bash
# .env file
VITE_API_BASE_URL=http://localhost:8000
```

## Common Operations

### Database Management

**Initialize database:**
```bash
cd backend
python -c "from app.db.init_db import init_db; init_db()"
```

**Reset database:**
```bash
rm backend/feather.db
# Database will be recreated on next startup
```

**View database:**
```bash
sqlite3 backend/feather.db
.tables
.schema users
```

### User Management

**Create demo user:**
```bash
# Users are created automatically on first login
# Use any email/password combination
```

**Reset user data:**
```bash
# Delete database file to reset all user data
rm backend/feather.db
```

### Service Management

**Start backend service:**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Start frontend service:**
```bash
cd frontend
npm run dev
```

**Run tests:**
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

## Troubleshooting

### Common Issues

#### Backend Issues

**Port already in use:**
```bash
# Find process using port 8000
lsof -i :8000
# Kill process
kill -9 <PID>
```

**Database connection errors:**
```bash
# Check if database file exists
ls -la backend/feather.db
# Recreate database
rm backend/feather.db
# Restart backend
```

**Import errors:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate
# Reinstall dependencies
pip install -r requirements.txt
```

#### Frontend Issues

**Port already in use:**
```bash
# Vite will automatically use next available port
# Or specify port explicitly
npm run dev -- --port 3000
```

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit
# Fix linting issues
npm run lint:fix
```

### Performance Issues

**Slow API responses:**
- Check database file size
- Monitor memory usage
- Check for blocking operations

**Frontend performance:**
- Check browser dev tools
- Monitor bundle size
- Use React DevTools profiler

### Logging and Debugging

**Backend logs:**
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
uvicorn app.main:app --reload --log-level debug
```

**Frontend debugging:**
- Use browser dev tools
- Check network tab for API calls
- Use React DevTools

## Development Workflow

### Code Quality

**Linting:**
```bash
# Backend
cd backend
ruff check .
black .

# Frontend
cd frontend
npm run lint
npm run format
```

**Testing:**
```bash
# Backend
cd backend
pytest --cov=app

# Frontend
cd frontend
npm run test:coverage
```

### Git Workflow

**Conventional Commits:**
```bash
# Feature
git commit -m "feat: add user authentication"

# Bug fix
git commit -m "fix: resolve login validation issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: improve error handling"
```

## Production Deployment

### Docker Deployment

**Build backend image:**
```bash
cd backend
docker build -t feather-backend .
```

**Run with Docker Compose:**
```bash
# Create docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=production-secret-key
      - DATABASE_URL=sqlite:///./feather.db
    volumes:
      - ./data:/app/data
```

### Environment-Specific Configuration

**Production environment variables:**
```bash
SECRET_KEY=<strong-random-key>
DATABASE_URL=postgresql://user:pass@localhost/feather
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=https://yourdomain.com
```

## Monitoring and Maintenance

### Health Checks

**Backend health:**
```bash
curl http://localhost:8000/health
```

**API documentation:**
```bash
# Open in browser
http://localhost:8000/docs
```

### Backup and Recovery

**Database backup:**
```bash
cp backend/feather.db backend/feather.db.backup
```

**Database restore:**
```bash
cp backend/feather.db.backup backend/feather.db
```

### Updates and Upgrades

**Backend dependencies:**
```bash
cd backend
pip install --upgrade -r requirements.txt
```

**Frontend dependencies:**
```bash
cd frontend
npm update
```

## Security Considerations

### Authentication
- Use strong SECRET_KEY in production
- Implement proper password policies
- Consider rate limiting for login attempts

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement proper CORS policies

### API Security
- Validate all input data
- Implement request size limits
- Use proper HTTP status codes

## Support and Resources

### Documentation
- API Documentation: http://localhost:8000/docs
- Architecture: docs/architecture.md
- API Contracts: docs/api-contracts.md

### Development Tools
- Backend: FastAPI with automatic OpenAPI docs
- Frontend: Vite with hot reload
- Testing: pytest (backend), Vitest (frontend)
- Linting: ruff/black (backend), ESLint/Prettier (frontend)

### Getting Help
- Check logs for error messages
- Review API documentation
- Test individual endpoints with curl/Postman
- Use browser dev tools for frontend issues
