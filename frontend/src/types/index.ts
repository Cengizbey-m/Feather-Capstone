// Auth types
export interface User {
  id: number
  email: string
  is_active: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

// Prediction types
export interface Prediction {
  deltaPct: number
  direction: 'up' | 'down'
  confidence: number
}

export interface PredictionModel {
  type: string
  version: string
}

export interface PredictionResponse {
  symbol: string
  asOf: string
  prediction: Prediction
  model: PredictionModel
}

// News types
export interface NewsItem {
  id: string
  headline: string
  publishedAt: string
  url: string
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  sentimentScore: number
}

export interface NewsResponse {
  symbol?: string
  items: NewsItem[]
}

// Watchlist types
export interface WatchlistResponse {
  items: string[]
}

export interface WatchlistCreate {
  symbol: string
}

// Alert types
export interface AlertRule {
  metric: string
  op: '<=' | '>=' | '<' | '>' | '==' | '!='
  value: number
}

export interface Alert {
  id: number
  symbol: string
  rule: AlertRule
  is_active: 'active' | 'triggered' | 'disabled'
  created_at: string
  triggered_at?: string
}

export interface AlertResponse {
  items: Alert[]
}

export interface AlertCreate {
  symbol: string
  rule: AlertRule
}

// Error types
export interface ApiError {
  error: {
    code: string
    message: string
  }
}

