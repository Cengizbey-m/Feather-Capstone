// src/hooks/useNews.ts
import { useQuery } from '@tanstack/react-query'
import { newsApi } from '@/lib/api'
import type { NewsResponse } from '@/types'

export const useGlobalNews = (limit: number, symbol?: string) =>
  useQuery<NewsResponse>({
    queryKey: ['globalNews', { limit, symbol }],
    queryFn: () =>
      symbol
        ? newsApi.getSymbolNews(symbol, limit)
        : newsApi.getGlobalNews(limit),
  })
export const useSymbolNews = (
  symbol: string | undefined,
  limit = 20
) =>
  useQuery<NewsResponse>({
    queryKey: ['symbolNews', { symbol, limit }],
    enabled: !!symbol,
    queryFn: () =>
      symbol
        ? newsApi.getSymbolNews(symbol, limit)
        : Promise.resolve({ items: [] }),
  })
