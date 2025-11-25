import { useQuery } from '@tanstack/react-query'
import { tickerApi } from '@/lib/api'

export const usePrediction = (symbol: string, _window = '1d') => {
  return useQuery({
    queryKey: ['prediction', symbol, _window],
    queryFn: () => tickerApi.getPrediction(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
