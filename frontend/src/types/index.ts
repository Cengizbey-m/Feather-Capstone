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
  // old fields (still there so other code compiles)
  deltaPct: number
  direction: 'up' | 'down'
  confidence: number | null

  // new fields from backend
  targetPrice?: number       // maps predicted_price
  horizonDays?: number       // maps horizon_days
}


// Price history types
export interface PriceCandle {
  // extra fields we get back from Neon
  id?: number
  ticker?: string
  created_at?: string

  // Neon timestamp is a bigint (seconds) which becomes a JS number in JSON,
  // but we might also get a string in some cases, so support both.
  timestamp: number | string

  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface PriceHistoryResponse {
  symbol: string
  items: PriceCandle[]
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

// Quote types (NEW)
export interface Quote {
  ticker: string
  current_price: number
  change: number
  percent_change: number
  last_updated: string
}

// News types
export interface NewsItem {
  id: string
  headline: string
  publishedAt: string
  url: string
  sentiment: 'Positive' | 'Negative' | 'Neutral'
  sentimentScore: number

  // Optional backend fields
  source?: string
  summary?: string
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
