// src/components/WatchlistTable.tsx
import { useState } from 'react'
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react'
import { useWatchlist } from '@/hooks/useWatchlist'
import { usePrediction } from '@/hooks/usePredictions'
import { TickerSearch } from './TickerSearch'

export const WatchlistTable = () => {
  const { items, isLoading, addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddSymbol = (symbol: string) => {
    addToWatchlist({ symbol })
    setShowAddForm(false)
  }

  const handleRemoveSymbol = (symbol: string) => {
    removeFromWatchlist(symbol)
  }

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Watchlist ({items.length})
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Symbol</span>
        </button>
      </div>

      {/* Add Symbol Form */}
      {showAddForm && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Add Symbol to Watchlist
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <TickerSearch onSelect={handleAddSymbol} />
        </div>
      )}

      {/* Watchlist Items */}
      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No symbols in your watchlist yet
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Symbol
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((symbol) => (
            <WatchlistItem
              key={symbol}
              symbol={symbol}
              onRemove={() => handleRemoveSymbol(symbol)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface WatchlistItemProps {
  symbol: string
  onRemove: () => void
}

const WatchlistItem = ({ symbol, onRemove }: WatchlistItemProps) => {
  const { data: prediction, isLoading } = usePrediction(symbol)

  return (
    <div className="card p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {symbol}
        </h3>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ) : prediction ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {prediction.prediction.direction === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`font-medium ${
                prediction.prediction.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {prediction.prediction.direction === 'up' ? '+' : ''}
              {prediction.prediction.deltaPct.toFixed(2)}%
            </span>
          </div>

          {/* Safely handle nullable confidence */}
          {(() => {
            const confidence = prediction.prediction.confidence ?? 0
            return (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(confidence * 100)}% confidence
              </div>
            )
          })()}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No prediction available
        </div>
      )}
    </div>
  )
}
