# API Contracts

This document defines the API contracts for the Feather application.

## Authentication

### POST /auth/login
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_active": true
  }
}
```

### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "is_active": true
}
```

## Predictions

### GET /api/tickers/{symbol}/prediction
Get prediction for a ticker symbol.

**Parameters:**
- `symbol` (path): Ticker symbol (e.g., AAPL, NVDA)
- `window` (query): Prediction window (1d, 1w, 1m)

**Response (200):**
```json
{
  "symbol": "AAPL",
  "asOf": "2025-02-10T15:30:00Z",
  "prediction": {
    "deltaPct": 2.3,
    "direction": "up",
    "confidence": 0.71
  },
  "model": {
    "type": "svr_rf_ensemble",
    "version": "0.0.1-mock"
  }
}
```

## News

### GET /api/tickers/{symbol}/news
Get news for a specific ticker symbol.

**Parameters:**
- `symbol` (path): Ticker symbol
- `limit` (query): Maximum number of news items (1-100, default: 20)

**Response (200):**
```json
{
  "symbol": "AAPL",
  "items": [
    {
      "id": "n_123",
      "headline": "Apple beats earnings expectations",
      "publishedAt": "2025-02-10T12:00:00Z",
      "url": "https://example.com/news/n_123",
      "sentiment": "Positive",
      "sentimentScore": 0.64
    }
  ]
}
```

### GET /api/news
Get global news feed.

**Parameters:**
- `limit` (query): Maximum number of news items (1-100, default: 50)
- `symbol` (query, optional): Filter by symbol

**Response (200):**
```json
{
  "items": [
    {
      "id": "n_123",
      "headline": "Apple beats earnings expectations",
      "publishedAt": "2025-02-10T12:00:00Z",
      "url": "https://example.com/news/n_123",
      "sentiment": "Positive",
      "sentimentScore": 0.64
    }
  ]
}
```

## Watchlist

### GET /api/watchlist
Get user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "items": ["AAPL", "NVDA", "TSLA"]
}
```

### POST /api/watchlist
Add symbol to user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "symbol": "AAPL"
}
```

**Response (200):**
```json
{
  "message": "Symbol added to watchlist"
}
```

### DELETE /api/watchlist/{symbol}
Remove symbol from user's watchlist.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

## Alerts

### GET /api/alerts
Get user's alerts.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "items": [
    {
      "id": 1,
      "symbol": "AAPL",
      "rule": {
        "metric": "predictedDeltaPct",
        "op": "<=",
        "value": -5
      },
      "is_active": "active",
      "created_at": "2025-02-10T10:00:00Z",
      "triggered_at": null
    }
  ]
}
```

### POST /api/alerts
Create a new alert.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "symbol": "AAPL",
  "rule": {
    "metric": "predictedDeltaPct",
    "op": "<=",
    "value": -5
  }
}
```

**Response (200):**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "rule": {
    "metric": "predictedDeltaPct",
    "op": "<=",
    "value": -5
  },
  "is_active": "active",
  "created_at": "2025-02-10T10:00:00Z",
  "triggered_at": null
}
```

### DELETE /api/alerts/{alert_id}
Delete an alert.

**Headers:** `Authorization: Bearer <token>`

**Response (204):** No content

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "symbol required"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid request data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error

## Status Codes

- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error
