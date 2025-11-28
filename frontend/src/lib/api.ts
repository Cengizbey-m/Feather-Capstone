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
} from '@/types'

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'

console.log('API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Removed withCredentials to fix CORS wildcard issue
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // TEMPORARY: Mock login for development
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
          }
        })
      }, 1000)
    })
  },

  getMe: (): Promise<User> => {
    // TEMPORARY: Mock user for development
    return Promise.resolve({
      id: 1,
      email: 'demo@feather.com',
      is_active: true,
    })
  },
}

// Ticker API
export const tickerApi = {
  getPrediction: (symbol: string): Promise<PredictionResponse> => {
    // TEMPORARY: Mock prediction for development
    return Promise.resolve({
      symbol: symbol.toUpperCase(),
      asOf: new Date().toISOString(),
      prediction: {
        deltaPct: (Math.random() - 0.5) * 5,
        direction: Math.random() > 0.5 ? 'up' : 'down',
        confidence: Math.random() * 0.3 + 0.7,
      },
      model: {
        type: 'Mock SVR Model',
        version: '1.0.0',
      }
    })
  },
}

// News API
export const newsApi = {
  getSymbolNews: (symbol: string, limit = 20): Promise<NewsResponse> => {
    // TEMPORARY: Mock news for development
    const mockNews = Array.from({ length: limit }, (_, i) => ({
      id: `news-${i + 1}`,
      headline: `${symbol} ${i % 2 === 0 ? 'surges' : 'drops'} on ${i % 3 === 0 ? 'earnings' : 'market'} news`,
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      url: `https://example.com/news/${symbol}-${i}`,
      sentiment: ['Positive', 'Negative', 'Neutral'][i % 3] as 'Positive' | 'Negative' | 'Neutral',
      sentimentScore: Math.random() * 2 - 1, // -1 to 1
    }))
    return Promise.resolve({ items: mockNews })
  },

  getGlobalNews: (limit = 50): Promise<NewsResponse> => {
    // TEMPORARY: Mock global news for development
    const mockNews = Array.from({ length: limit }, (_, i) => ({
      id: `global-news-${i + 1}`,
      headline: `Market ${i % 2 === 0 ? 'gains' : 'declines'} as ${i % 3 === 0 ? 'tech' : 'finance'} stocks ${i % 2 === 0 ? 'rise' : 'fall'}`,
      publishedAt: new Date(Date.now() - i * 1800000).toISOString(),
      url: `https://example.com/news/global-${i}`,
      sentiment: ['Positive', 'Negative', 'Neutral'][i % 3] as 'Positive' | 'Negative' | 'Neutral',
      sentimentScore: Math.random() * 2 - 1, // -1 to 1
    }))
    return Promise.resolve({ items: mockNews })
  },
}

// Watchlist API
export const watchlistApi = {
  getWatchlist: (): Promise<WatchlistResponse> => {
    // TEMPORARY: Mock watchlist for development
    return Promise.resolve({
      items: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']
    })
  },

  addToWatchlist: (data: WatchlistCreate): Promise<void> => {
    // TEMPORARY: Mock add to watchlist for development
    console.log('Mock adding to watchlist:', data)
    return Promise.resolve()
  },

  removeFromWatchlist: (symbol: string): Promise<void> => {
    // TEMPORARY: Mock remove from watchlist for development
    console.log('Mock removing from watchlist:', symbol)
    return Promise.resolve()
  },
}

// Alerts API
export const alertsApi = {
  getAlerts: (): Promise<AlertResponse> => {
    // TEMPORARY: Mock alerts for development
    const mockAlerts = [
      {
        id: 1,
        symbol: 'AAPL',
        rule: {
          metric: 'price',
          op: '>=' as const,
          value: 150.00,
        },
        is_active: 'active' as const,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        symbol: 'TSLA',
        rule: {
          metric: 'price',
          op: '<=' as const,
          value: 200.00,
        },
        is_active: 'active' as const,
        created_at: new Date().toISOString(),
      }
    ]
    return Promise.resolve({ items: mockAlerts })
  },

  createAlert: (data: AlertCreate): Promise<Alert> => {
    // TEMPORARY: Mock create alert for development
    console.log('Mock creating alert:', data)
    return Promise.resolve({
      id: Math.floor(Math.random() * 1000),
      symbol: data.symbol,
      rule: data.rule,
      is_active: 'active',
      created_at: new Date().toISOString(),
    })
  },

  deleteAlert: (alertId: number): Promise<void> => {
    // TEMPORARY: Mock delete alert for development
    console.log('Mock deleting alert:', alertId)
    return Promise.resolve()
  },
}

export default api

