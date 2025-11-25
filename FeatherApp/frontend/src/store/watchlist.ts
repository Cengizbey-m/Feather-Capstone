import { create } from 'zustand'

interface WatchlistState {
  items: string[]
  isLoading: boolean
  setWatchlist: (items: string[]) => void
  addItem: (symbol: string) => void
  removeItem: (symbol: string) => void
  setLoading: (loading: boolean) => void
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  // TEMPORARY: Mock watchlist data for development
  items: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
  isLoading: false,
  setWatchlist: (items: string[]) => set({ items }),
  addItem: (symbol: string) =>
    set((state) => ({
      items: [...state.items, symbol.toUpperCase()],
    })),
  removeItem: (symbol: string) =>
    set((state) => ({
      items: state.items.filter((item) => item !== symbol.toUpperCase()),
    })),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

