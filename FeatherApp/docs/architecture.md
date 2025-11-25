# Architecture Overview

This document describes the architecture of the Feather application.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React + TS)  │◄──►│   (FastAPI)     │◄──►│   (SQLite)      │
│                 │    │                 │    │                 │
│ • React Router  │    │ • REST API      │    │ • Users         │
│ • TanStack Query│    │ • JWT Auth      │    │ • Watchlist     │
│ • Zustand       │    │ • Mock Services │    │ • Alerts        │
│ • Tailwind CSS  │    │ • SQLAlchemy    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App
├── AuthGuard
└── AppLayout
    ├── NavBar
    ├── Sidebar
    └── Routes
        ├── DashboardPage
        │   ├── WatchlistTable
        │   ├── PredictionCard
        │   └── NewsList
        ├── TickerPage
        │   ├── PredictionCard
        │   └── NewsList
        ├── NewsPage
        │   └── NewsList
        └── AlertsPage
            ├── AlertForm
            └── AlertList
```

### State Management
- **Zustand Stores:**
  - `authStore`: User authentication state
  - `watchlistStore`: User's watchlist items
- **TanStack Query:** Server state caching and synchronization
- **Local State:** Component-level state with React hooks

### Data Flow
1. User interactions trigger API calls through custom hooks
2. TanStack Query manages caching and background updates
3. Zustand stores handle global application state
4. Components re-render based on state changes

## Backend Architecture

### API Structure
```
FastAPI Application
├── Core
│   ├── config.py          # Configuration management
│   ├── security.py         # JWT authentication
│   └── deps.py            # Dependency injection
├── API Routes
│   ├── auth.py            # Authentication endpoints
│   ├── tickers.py         # Prediction endpoints
│   ├── news.py            # News endpoints
│   ├── watchlist.py       # Watchlist management
│   └── alerts.py          # Alert management
├── Models
│   ├── user.py            # User model
│   ├── watchlist.py       # Watchlist model
│   └── alert.py           # Alert model
├── Schemas
│   ├── auth.py            # Auth schemas
│   ├── prediction.py      # Prediction schemas
│   ├── news.py            # News schemas
│   ├── watchlist.py       # Watchlist schemas
│   └── alert.py           # Alert schemas
└── Services
    ├── prediction_service.py  # ML prediction logic
    ├── sentiment_service.py   # Sentiment analysis
    └── news_service.py        # News aggregation
```

### Service Layer
- **PredictionService:** Mock SVR/RF ensemble predictions
- **SentimentService:** Keyword-based sentiment analysis
- **NewsService:** Mock news aggregation with sentiment scoring

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Watchlist Table
```sql
CREATE TABLE watchlist_items (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Alerts Table
```sql
CREATE TABLE alerts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    symbol VARCHAR NOT NULL,
    rule JSON NOT NULL,
    is_active VARCHAR DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    triggered_at DATETIME
);
```

## API Design Patterns

### RESTful Endpoints
- **GET** for retrieving data
- **POST** for creating resources
- **DELETE** for removing resources
- **PATCH/PUT** for updates (future)

### Authentication
- JWT tokens for stateless authentication
- Bearer token in Authorization header
- Automatic token refresh handling

### Error Handling
- Consistent error response format
- HTTP status codes for different error types
- Client-side error boundary handling

## Mock Services Architecture

### Prediction Service
```python
class PredictionService:
    def get_prediction(symbol: str, window: str) -> Dict:
        # Deterministic pseudo-random predictions
        # Seeded by symbol + date for consistency
        # Returns: deltaPct, direction, confidence
```

### Sentiment Service
```python
class SentimentService:
    def analyze_sentiment(headline: str) -> Dict:
        # Keyword-based sentiment analysis
        # Returns: sentiment, sentimentScore
```

### News Service
```python
class NewsService:
    def get_news(symbol: Optional[str], limit: int) -> List[Dict]:
        # Mock news with deterministic filtering
        # Returns: news items with sentiment scores
```

## Deployment Architecture

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Uvicorn dev server (port 8000)
- Database: SQLite file

### Production (Future)
- Frontend: Static files served by CDN
- Backend: Containerized FastAPI with Gunicorn
- Database: PostgreSQL with connection pooling
- Load Balancer: Nginx or cloud load balancer

## Security Considerations

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- CORS configuration for cross-origin requests

### Data Protection
- SQL injection prevention through SQLAlchemy ORM
- Input validation with Pydantic schemas
- XSS protection through React's built-in escaping

### API Security
- Rate limiting (future implementation)
- Request validation and sanitization
- Secure headers and CORS policies

## Scalability Considerations

### Current Limitations
- SQLite database (single-user)
- In-memory mock services
- No caching layer

### Future Improvements
- PostgreSQL for multi-user support
- Redis for caching and session storage
- Real ML model integration
- Microservices architecture for service separation
- Message queues for async processing
- CDN for static asset delivery

## Monitoring and Observability

### Current
- Basic error logging
- API response times
- Test coverage reporting

### Future
- Application performance monitoring (APM)
- Structured logging with correlation IDs
- Health check endpoints
- Metrics collection and dashboards
- Distributed tracing
