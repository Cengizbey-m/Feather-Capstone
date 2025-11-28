// src/hooks/useScreener.ts
import { useQuery } from '@tanstack/react-query'
import { screenerApi } from '@/lib/api'
import type { ScreenerResponse } from '@/lib/api'

export const useScreener = () => {
  return useQuery<ScreenerResponse>({
    queryKey: ['screener'],
    queryFn: screenerApi.getScreener,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
