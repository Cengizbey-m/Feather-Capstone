import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistApi } from '@/lib/api'
import { useWatchlistStore } from '@/store/watchlist'
import type { WatchlistCreate } from '@/types'

export const useWatchlist = () => {
  const queryClient = useQueryClient()
  const { setWatchlist, addItem, removeItem, setLoading } = useWatchlistStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistApi.getWatchlist,
  })

  // Update watchlist store when data changes
  React.useEffect(() => {
    if (data?.items) {
      setWatchlist(data.items)
    }
  }, [data, setWatchlist])

  const addMutation = useMutation({
    mutationFn: watchlistApi.addToWatchlist,
    onSuccess: (_, variables) => {
      addItem(variables.symbol)
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
    onError: () => {
      setLoading(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: watchlistApi.removeFromWatchlist,
    onSuccess: (_, symbol) => {
      removeItem(symbol)
      queryClient.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })

  const addToWatchlist = (data: WatchlistCreate) => {
    setLoading(true)
    addMutation.mutate(data)
  }

  const removeFromWatchlist = (symbol: string) => {
    removeMutation.mutate(symbol)
  }

  return {
    items: data?.items || [],
    isLoading: isLoading || addMutation.isPending || removeMutation.isPending,
    error: error || addMutation.error || removeMutation.error,
    addToWatchlist,
    removeFromWatchlist,
  }
}
