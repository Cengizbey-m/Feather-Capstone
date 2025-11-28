import { useQuery } from '@tanstack/react-query'
import { tickerApi, } from '@/lib/api'
import { PriceHistoryResponse } from '@/types'

export const usePriceHistory = (symbol: string, limit = 60) => {
  return useQuery<PriceHistoryResponse>({
    queryKey: ['price-history', symbol, limit],
    queryFn: () => tickerApi.getHistory(symbol, limit),
    enabled: !!symbol, // only run when a symbol is selected
    staleTime: 60_000, // optional
  })
}
