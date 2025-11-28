// src/hooks/useQuote.ts
import { useQuery } from '@tanstack/react-query'
import { tickerApi } from '@/lib/api'
import type { Quote } from '@/types'

export const useQuote = (symbol?: string) => {
  const upper = symbol?.toUpperCase()

  return useQuery<Quote>({
    queryKey: ['quote', upper],
    queryFn: () => tickerApi.getQuote(upper!),
    enabled: !!upper,           // don’t call API if no symbol
    staleTime: 60_000,          // 1 minute cache
  })
}
