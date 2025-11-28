import { useQuery } from '@tanstack/react-query'
import { newsApi } from '@/lib/api'

export const useSymbolNews = (symbol: string, limit = 20) => {
  return useQuery({
    queryKey: ['news', 'symbol', symbol, limit],
    queryFn: () => newsApi.getSymbolNews(symbol, limit),
    enabled: !!symbol,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useGlobalNews = (limit = 50) => {
  return useQuery({
    queryKey: ['news', 'global', limit],
    queryFn: () => newsApi.getGlobalNews(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
