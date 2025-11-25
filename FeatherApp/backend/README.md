# Feather Backend

FastAPI backend for the Feather market insights application.

## Quick Start

### Development Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment:
```bash
cp env.example .env
# Edit .env with your settings
```

4. Run the application:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`.

### Testing

```bash
pytest
```

### Linting and Formatting

```bash
ruff check .
black .
```

### Docker

```bash
docker build -t feather-backend .
docker run -p 8000:8000 feather-backend
```

## API Endpoints

- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user
- `GET /api/tickers/{symbol}/prediction` - Get prediction for symbol
- `GET /api/tickers/{symbol}/news` - Get news for symbol
- `GET /api/news` - Get global news feed
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add symbol to watchlist
- `DELETE /api/watchlist/{symbol}` - Remove symbol from watchlist
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert

## Environment Variables

- `SECRET_KEY` - JWT secret key
- `DATABASE_URL` - Database connection string
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `CORS_ORIGINS` - Allowed CORS origins

## Database

The application uses SQLite by default. The database file will be created automatically on first run.

## Mock Services

The application includes mock implementations for:
- Prediction service (SVR/RF ensemble)
- Sentiment analysis service
- News service

These can be replaced with real implementations by updating the service classes.

