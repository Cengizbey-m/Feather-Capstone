import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useGlobalNews } from '@/hooks/useNews'
import { NewsList } from '@/components/NewsList'
import { TickerSearch } from '@/components/TickerSearch'

export const NewsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>()
  const [limit, setLimit] = useState(50)
  const { data: news, isLoading, error } = useGlobalNews(limit)

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol)
  }

  const handleClearFilter = () => {
    setSelectedSymbol(undefined)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market News
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated with the latest market news and sentiment analysis
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter News
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span>Advanced filtering</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Symbol Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Symbol
            </label>
            <TickerSearch
              onSelect={handleSymbolSelect}
              placeholder="Search for a specific symbol..."
            />
            {selectedSymbol && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Showing news for: <span className="font-medium">{selectedSymbol}</span>
                </span>
                <button
                  onClick={handleClearFilter}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Limit Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Articles
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="input"
            >
              <option value={20}>20 articles</option>
              <option value={50}>50 articles</option>
              <option value={100}>100 articles</option>
            </select>
          </div>

          {/* Search Stats */}
          <div className="flex items-end">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isLoading ? (
                <div className="animate-pulse">Loading...</div>
              ) : (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {news?.items.length || 0} articles
                  </div>
                  <div>
                    {selectedSymbol ? `for ${selectedSymbol}` : 'from all sources'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div>
        {error ? (
          <div className="card p-8 text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              Failed to load news
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Please try refreshing the page or check your connection.
            </p>
          </div>
        ) : (
          <NewsList
            items={news?.items || []}
            isLoading={isLoading}
            emptyMessage={
              selectedSymbol
                ? `No recent news found for ${selectedSymbol}`
                : 'No news available at the moment'
            }
          />
        )}
      </div>

      {/* Load More */}
      {news && news.items.length > 0 && news.items.length >= limit && (
        <div className="text-center">
          <button
            onClick={() => setLimit(limit + 20)}
            className="btn-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Articles'}
          </button>
        </div>
      )}
    </div>
  )
}
