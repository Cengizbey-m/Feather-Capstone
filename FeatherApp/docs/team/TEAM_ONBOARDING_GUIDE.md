# 👥 Feather App - Team Onboarding Guide

## 🎯 Welcome to the Feather Team!

This guide will help you understand everything about our **Feather** market insights and investment platform. Whether you're working on frontend, backend, AI/ML, or DevOps, this guide covers everything you need to know.

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features & Components](#features--components)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Development Setup](#development-setup)
8. [Team Roles & Responsibilities](#team-roles--responsibilities)
9. [Code Standards](#code-standards)
10. [Deployment](#deployment)

## 🎯 Project Overview

### **What is Feather?**
Feather is a **comprehensive market insights and investment platform** that provides:
- Real-time market data and analysis
- AI-powered investment recommendations
- Portfolio tracking and risk management
- Advanced charting with technical indicators
- Strategy backtesting and optimization
- Professional news and sentiment analysis

### **Target Users**
- **Individual Investors** - Personal portfolio management
- **Day Traders** - Real-time market analysis and trading tools
- **Financial Advisors** - Client portfolio management and recommendations
- **Institutional Investors** - Advanced analytics and risk management

### **Key Value Propositions**
1. **AI-Powered Insights** - Machine learning recommendations
2. **Professional Tools** - Bloomberg/TradingView-inspired interface
3. **Risk Management** - Comprehensive risk analysis and optimization
4. **Real-time Data** - Live market data and updates
5. **Strategy Testing** - Backtesting and optimization tools

## 🏗️ Technology Stack

### **Frontend Stack**
```
React 18 + TypeScript + Vite
├── UI Framework: React 18 (Latest stable)
├── Language: TypeScript (Type safety)
├── Build Tool: Vite (Fast development)
├── Routing: React Router v6
├── State Management: Zustand + TanStack Query
├── Styling: Tailwind CSS
├── Icons: Lucide React
├── Testing: Vitest + Testing Library
└── Linting: ESLint + Prettier
```

**Why these technologies?**
- **React 18**: Latest features, concurrent rendering, better performance
- **TypeScript**: Type safety, better developer experience, fewer bugs
- **Vite**: Faster than Webpack, better HMR, modern build tool
- **Tailwind CSS**: Utility-first, consistent design, responsive
- **Zustand**: Lightweight state management, easier than Redux

### **Backend Stack**
```
FastAPI + Python 3.11
├── Web Framework: FastAPI (Modern, fast, auto-docs)
├── Language: Python 3.11 (Latest stable)
├── ORM: SQLAlchemy (Database abstraction)
├── Migrations: Alembic (Database versioning)
├── Validation: Pydantic (Data validation)
├── Authentication: JWT + bcrypt
├── Testing: pytest
├── Linting: ruff + black
└── Database: SQLite (dev) / PostgreSQL (prod)
```

**Why these technologies?**
- **FastAPI**: Auto-generated docs, type hints, async support
- **SQLAlchemy**: Powerful ORM, database agnostic
- **Pydantic**: Data validation, serialization, type safety
- **JWT**: Stateless authentication, scalable

### **DevOps & Deployment**
```
Docker + Docker Compose
├── Containerization: Docker
├── Orchestration: Docker Compose
├── CI/CD: GitHub Actions
├── Database: PostgreSQL (production)
├── Web Server: Nginx (frontend)
├── ASGI Server: Uvicorn (backend)
└── Monitoring: (To be implemented)
```

## 🏛️ Architecture

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   External APIs  │    │   Redis Cache   │
│   (Reverse      │    │   (Market Data)  │    │   (Optional)    │
│   Proxy)        │    │                  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── store/              # State management (Zustand)
├── lib/                # Utilities and API client
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

### **Backend Architecture**
```
app/
├── api/                # API routes
│   ├── auth.py         # Authentication endpoints
│   ├── tickers.py      # Market data endpoints
│   ├── news.py         # News endpoints
│   ├── watchlist.py    # Portfolio endpoints
│   └── alerts.py       # Alert endpoints
├── core/               # Core functionality
│   ├── config.py       # Configuration
│   ├── security.py     # Security utilities
│   └── deps.py         # Dependencies
├── models/             # Database models
├── schemas/            # Pydantic schemas
├── services/           # Business logic
└── db/                 # Database configuration
```

## 🚀 Features & Components

### **1. Authentication System**
**What it does**: User registration, login, session management
**Technologies**: JWT, bcrypt, FastAPI
**Components**: `LoginPage`, `AuthGuard`, `useAuth` hook

### **2. Market Data & Analysis**
**What it does**: Real-time market data, stock predictions, sentiment analysis
**Technologies**: FastAPI, SQLAlchemy, ML models
**Components**: `MarketOverview`, `PredictionCard`, `SentimentAnalyzer`

### **3. Portfolio Management**
**What it does**: Track investments, performance metrics, allocation
**Technologies**: React, TypeScript, Zustand
**Components**: `PortfolioTracker`, `WatchlistTable`, `PortfolioSummary`

### **4. Advanced Charting**
**What it does**: Professional charts with technical indicators
**Technologies**: SVG, Canvas, React
**Components**: `AdvancedChart`, `InteractiveChart`, `PriceChart`

### **5. Risk Management**
**What it does**: Risk analysis, portfolio optimization, scenario testing
**Technologies**: Python, mathematical libraries
**Components**: `RiskManagement`, `PortfolioOptimizer`

### **6. Strategy Backtesting**
**What it does**: Test trading strategies with historical data
**Technologies**: Python, pandas, numpy
**Components**: `Backtesting`, `StrategyTester`

### **7. AI-Powered Features**
**What it does**: Investment recommendations, sentiment analysis
**Technologies**: Machine learning, NLP
**Components**: `AIRecommendations`, `LLMNewsAnalysis`

## 📡 API Documentation

### **Authentication Endpoints**
```python
# User Registration
POST /auth/register
{
  "email": "user@example.com",
  "password": "secure_password"
}

# User Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "secure_password"
}

# Get Current User
GET /auth/me
Authorization: Bearer <jwt_token>
```

### **Market Data Endpoints**
```python
# Get Stock Prediction
GET /api/tickers/{symbol}/prediction
Response: {
  "symbol": "AAPL",
  "prediction": {
    "deltaPct": 2.5,
    "direction": "up",
    "confidence": 0.85
  },
  "model": {
    "type": "SVR",
    "version": "1.0.0"
  }
}

# Get Global News
GET /api/news?limit=20
Response: {
  "items": [
    {
      "id": "news-1",
      "headline": "Market gains on tech rally",
      "publishedAt": "2024-01-01T10:00:00Z",
      "sentiment": "Positive",
      "sentimentScore": 0.8
    }
  ]
}
```

### **Portfolio Endpoints**
```python
# Get Watchlist
GET /api/watchlist
Response: {
  "items": ["AAPL", "GOOGL", "MSFT"]
}

# Add to Watchlist
POST /api/watchlist
{
  "symbol": "TSLA"
}

# Remove from Watchlist
DELETE /api/watchlist/{symbol}
```

### **Alert Endpoints**
```python
# Get Alerts
GET /api/alerts
Response: {
  "items": [
    {
      "id": 1,
      "symbol": "AAPL",
      "rule": {
        "metric": "price",
        "op": ">=",
        "value": 150.00
      },
      "is_active": "active"
    }
  ]
}

# Create Alert
POST /api/alerts
{
  "symbol": "AAPL",
  "rule": {
    "metric": "price",
    "op": ">=",
    "value": 150.00
  }
}
```

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Watchlist Table**
```sql
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, symbol)
);
```

### **Alerts Table**
```sql
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR(10) NOT NULL,
    rule JSONB NOT NULL,
    is_active VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    triggered_at TIMESTAMP NULL
);
```

## 🛠️ Development Setup

### **Prerequisites**
- Node.js 18+ (Frontend)
- Python 3.11+ (Backend)
- Docker & Docker Compose (Optional)
- Git

### **Frontend Setup**
```bash
# Navigate to frontend directory
cd FeatherApp/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### **Backend Setup**
```bash
# Navigate to backend directory
cd FeatherApp/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### **Docker Setup**
```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 👥 Team Roles & Responsibilities

### **Frontend Developer**
**Responsibilities:**
- React components and pages
- UI/UX implementation
- State management
- API integration
- Testing

**Key Files:**
- `src/components/` - UI components
- `src/pages/` - Page components
- `src/hooks/` - Custom hooks
- `src/store/` - State management

### **Backend Developer**
**Responsibilities:**
- API endpoints
- Database models
- Business logic
- Authentication
- Testing

**Key Files:**
- `app/api/` - API routes
- `app/models/` - Database models
- `app/services/` - Business logic
- `app/core/` - Core functionality

### **AI/ML Engineer**
**Responsibilities:**
- Machine learning models
- Prediction algorithms
- Sentiment analysis
- Data processing
- Model optimization

**Key Files:**
- `app/services/prediction_service.py`
- `app/services/sentiment_service.py`
- `app/services/news_service.py`

### **DevOps Engineer**
**Responsibilities:**
- Docker configuration
- CI/CD pipelines
- Deployment
- Monitoring
- Security

**Key Files:**
- `Dockerfile`
- `docker-compose.yml`
- `.github/workflows/`

## 📝 Code Standards

### **Frontend Standards**
```typescript
// Use TypeScript for type safety
interface User {
  id: number;
  email: string;
  is_active: boolean;
}

// Use functional components with hooks
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="card p-4">
      <h2>{user.email}</h2>
    </div>
  );
};

// Use custom hooks for logic
const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  // ... logic
  return { user, setUser };
};
```

### **Backend Standards**
```python
# Use type hints
from typing import List, Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool

# Use async/await
@router.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate):
    # ... implementation
    return user
```

### **Git Standards**
```bash
# Use conventional commits
feat: add user authentication
fix: resolve CORS issue
docs: update API documentation
test: add unit tests for auth
```

## 🚀 Deployment

### **Development Environment**
```bash
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: http://localhost:5432
```

### **Production Environment**
```bash
# Use Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Environment variables
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/feather
CORS_ORIGINS=https://yourdomain.com
```

### **Environment Variables**
```bash
# Backend (.env)
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/feather
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000
```

## 🔧 Common Tasks

### **Adding a New Feature**
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement frontend components
3. Add backend API endpoints
4. Update database schema if needed
5. Write tests
6. Create pull request

### **Debugging Issues**
1. Check browser console for frontend errors
2. Check backend logs: `docker-compose logs backend`
3. Check database: `docker-compose exec db psql -U user -d feather`
4. Use debugging tools: React DevTools, FastAPI docs

### **Testing**
```bash
# Frontend tests
npm run test

# Backend tests
pytest

# E2E tests (recommended)
npm run test:e2e
```

## 📚 Learning Resources

### **Frontend**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

### **Backend**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Tutorial](https://docs.sqlalchemy.org/en/20/tutorial/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

### **DevOps**
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🆘 Getting Help

### **Common Issues**
1. **CORS Errors**: Check backend CORS configuration
2. **Database Connection**: Verify database URL and credentials
3. **Build Errors**: Check Node.js and Python versions
4. **Docker Issues**: Check Docker daemon is running

### **Team Communication**
- **Daily Standups**: 15-minute daily meetings
- **Code Reviews**: All PRs require review
- **Documentation**: Update docs with changes
- **Testing**: Write tests for new features

## 🎯 Next Steps

### **Immediate Tasks**
1. **Set up development environment**
2. **Review codebase and documentation**
3. **Run the application locally**
4. **Understand your role and responsibilities**
5. **Start contributing to the project**

### **Learning Path**
1. **Week 1**: Set up environment, understand codebase
2. **Week 2**: Make small contributions, fix bugs
3. **Week 3**: Implement new features
4. **Week 4**: Lead feature development

## 📞 Contact & Support

- **Project Lead**: [Your Name]
- **Technical Lead**: [Technical Lead Name]
- **Slack Channel**: #feather-dev
- **GitHub**: [Repository URL]
- **Documentation**: [Documentation URL]

---

**Welcome to the Feather team! 🚀**

*This guide will be updated as the project evolves. Please contribute improvements and suggestions.*
