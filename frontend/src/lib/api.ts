// src/lib/api.ts
import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  User,
  PredictionResponse,
  NewsResponse,
  WatchlistResponse,
  WatchlistCreate,
  AlertResponse,
  AlertCreate,
  Alert,
  PriceCandle,
  PriceHistoryResponse,
  Quote,
} from '@/types'

// ----------------------------------------
// Local types for Screener
// ----------------------------------------
type ScreenerItem = {
  id: number
  ticker: string
  name: string
  sector: string
  current_price: number
}

export type ScreenerResponse = {
  results: ScreenerItem[]
  total: number
}

// ================================================
// Base URL Setup
// ================================================
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ================================================
// Interceptors
// ================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    if (!error.response) {
      console.error('Network Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// ================================================
// AUTH API
// ================================================
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Mock login (you can replace with real auth)
    console.log('Mock login with:', { email: data.email, password: '***' })
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'mock-jwt-token-for-development',
          token_type: 'bearer',
          user: {
            id: 1,
            email: data.email,
            is_active: true,
          },
        })
      }, 1000)
    })
  },

  getMe: (): Promise<User> => {
    return Promise.resolve({
      id: 1,
      email: 'demo@feather.com',
      is_active: true,
    })
  },
}

// ================================================
// TICKER API (Prediction + OHLCV History)
// ================================================
export const tickerApi = {
  // existing getPrediction...

  getPrediction: async (symbol: string): Promise<PredictionResponse> => {
    const res = await api.get(`/api/stocks/${symbol}/prediction`)
    const raw: any = res.data

    const targetPrice = Number(raw.predicted_price)
    const horizonDays = Number(raw.horizon_days ?? 0)

    return {
      symbol: (raw.ticker || symbol).toUpperCase(),
      asOf: raw.created_at || new Date().toISOString(),
      prediction: {
        deltaPct: 0,
        direction: 'up',
        confidence: 0.7,
        // @ts-ignore
        targetPrice,
        // @ts-ignore
        horizonDays,
      },
      model: {
        type: raw.model_name || 'RF+SVR_ensemble',
        version: '0.0.1',
      },
    }
  },

  // existing getHistory...

  getHistory: async (
    symbol: string,
    limit = 60
  ): Promise<PriceHistoryResponse> => {
    const res = await api.get<PriceCandle[]>(`/api/stocks/${symbol}/history`, {
      params: { limit },
    })

    return {
      symbol: symbol.toUpperCase(),
      items: res.data,
    }
  },

  // ✅ NEW: GET QUOTE
  getQuote: async (symbol: string): Promise<Quote> => {
    const res = await api.get<Quote>(`/api/stocks/${symbol}/quote`)
    return res.data
  },
}


// ================================================
// NEWS API
// ================================================
type BackendNewsItem = {
  title: string
  summary: string
  url: string
  source: string
  published_at: string
}

export const newsApi = {
  getSymbolNews: async (
    symbol: string,
    limit = 20
  ): Promise<NewsResponse> => {
    const res = await api.get<BackendNewsItem[]>(`/api/stocks/${symbol}/news`, {
      params: { limit },
    })

    const items = res.data.map((item, index) => ({
      id: `${symbol}-${index}-${item.published_at}`,
      headline: item.title,
      publishedAt: item.published_at,
      url: item.url,
      source: item.source,
      summary: item.summary,
      sentiment: 'Neutral' as const,
      sentimentScore: 0,
    }))

    return { items }
  },

  getGlobalNews: async (limit = 50): Promise<NewsResponse> => {
    return newsApi.getSymbolNews('SPY', limit)
  },
}

// ================================================
// SCREENER API
// ================================================
export const screenerApi = {
  getScreener: async (): Promise<ScreenerResponse> => {
    const res = await api.get<ScreenerResponse>('/api/screener')
    return res.data
  },
}

// ================================================
// WATCHLIST API
// ================================================
export const watchlistApi = {
  getWatchlist: async (): Promise<WatchlistResponse> => {
    const res = await api.get<WatchlistResponse>('/api/watchlist')
    return res.data
  },

  addToWatchlist: async (data: WatchlistCreate): Promise<void> => {
    await api.post('/api/watchlist', data)
  },

  removeFromWatchlist: async (symbol: string): Promise<void> => {
    await api.delete(`/api/watchlist/${symbol}`)
  },
}

// ================================================
// ALERTS API
// ================================================
export const alertsApi = {
  getAlerts: async (): Promise<AlertResponse> => {
    const res = await api.get<AlertResponse>('/api/alerts')
    return res.data
  },

  createAlert: async (data: AlertCreate): Promise<Alert> => {
    const res = await api.post<Alert>('/api/alerts', data)
    return res.data
  },

  deleteAlert: async (alertId: number): Promise<void> => {
    await api.delete(`/api/alerts/${alertId}`)
  },
}

// ================================================
// SYSTEM API
// ================================================
export const systemApi = {
  health: async (): Promise<any> => {
    const res = await api.get('/api/health')
    return res.data
  },
}

export default api
