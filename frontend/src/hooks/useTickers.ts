// src/hooks/useTickers.ts
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export type ScreenerItem = {
  id: number
  ticker: string
  name: string
  sector?: string
  current_price?: number
}

export const useTickers = () => {
  return useQuery<ScreenerItem[]>({
    queryKey: ['tickers'],
    queryFn: async () => {
      // Backend: GET /api/screener -> { results: [...], total: N }
      const res = await api.get<{ results: ScreenerItem[] }>('/api/screener')
      return res.data.results
    },
    staleTime: 5 * 60 * 1000, // cache 5 minutes
  })
}
