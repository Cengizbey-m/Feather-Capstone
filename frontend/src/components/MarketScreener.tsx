// src/components/MarketScreener.tsx
import { useState } from 'react'
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import { AdvancedDataTable } from './AdvancedDataTable'
import { useScreener } from '@/hooks/useScreener'

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: string
  sector: string
  prediction: {
    direction: 'up' | 'down'
    confidence: number
    deltaPct: number
  }
  sentiment: number
  isWatched: boolean
}

export const MarketScreener = () => {
  const [filters, setFilters] = useState({
    sector: '',
    minPrice: '',
    maxPrice: '',
    minChange: '',
    maxChange: '',
    minVolume: '',
    sortBy: 'changePercent',
    sortOrder: 'desc' as 'asc' | 'desc',
  })

  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useScreener()

  // Map backend -> Stock[]
  const raw = data?.results ?? []

  const stocks: Stock[] = raw.map((item, index) => {
    const basePrice = Number(item.current_price)
    const idFactor = item.id || index + 1

    // Fake but deterministic change data based on id
    const changePercent = ((idFactor % 7) - 3) * 0.8 // -2.4 .. 3.2
    const change = Number((basePrice * (changePercent / 100)).toFixed(2))

    const volume = 10_000_000 + idFactor * 1_000_000 // 11M, 12M, ...
    const marketCapValue = basePrice * 1e7
    const marketCapLabel =
      marketCapValue >= 1e12
        ? `${(marketCapValue / 1e12).toFixed(1)}T`
        : `${(marketCapValue / 1e9).toFixed(1)}B`

    const direction: 'up' | 'down' = changePercent >= 0 ? 'up' : 'down'
    let confidence = 0.6 + ((idFactor % 3) * 0.1) // 0.6–0.8
    if (confidence > 0.95) confidence = 0.95

    let sentiment = 0.45 + ((idFactor % 5) * 0.07) // 0.45–0.73
    sentiment = Math.max(0, Math.min(1, sentiment))

    const deltaPct = Math.abs(changePercent) + 0.5

    return {
      symbol: item.ticker.toUpperCase(),
      name: item.name,
      price: basePrice,
      change,
      changePercent,
      volume,
      marketCap: marketCapLabel,
      sector: item.sector,
      prediction: {
        direction,
        confidence,
        deltaPct,
      },
      sentiment,
      isWatched: idFactor % 2 === 0,
    }
  })

  const sectors = [
    'All',
    ...Array.from(new Set(stocks.map((s) => s.sector))).sort(),
  ]

  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSector = !filters.sector || stock.sector === filters.sector
      const matchesPrice =
        (!filters.minPrice || stock.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || stock.price <= parseFloat(filters.maxPrice))
      const matchesChange =
        (!filters.minChange ||
          stock.changePercent >= parseFloat(filters.minChange)) &&
        (!filters.maxChange ||
          stock.changePercent <= parseFloat(filters.maxChange))
      const matchesVolume =
        !filters.minVolume || stock.volume >= parseInt(filters.minVolume)

      return (
        matchesSearch &&
        matchesSector &&
        matchesPrice &&
        matchesChange &&
        matchesVolume
      )
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Stock] as number
      const bValue = b[filters.sortBy as keyof Stock] as number
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.6) return 'text-green-600'
    if (sentiment >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 0.6) return 'bg-green-100 dark:bg-green-900'
    if (sentiment >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900'
    return 'bg-red-100 dark:bg-red-900'
  }

  // --------- Loading / Error ---------
  if (isLoading) {
    return (
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Loading screener data…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <p className="text-red-500">
          Failed to load screener data. Check the /screener endpoint.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Screener
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover stocks with advanced filtering and AI predictions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredStocks.length} stocks found
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Symbol or company name..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sector
            </label>
            <select
              value={filters.sector}
              onChange={(e) =>
                setFilters({ ...filters, sector: e.target.value })
              }
              className="input"
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector === 'All' ? '' : sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
                className="input flex-1"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
                className="input flex-1"
              />
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="input flex-1"
              >
                <option value="changePercent">Change %</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="sentiment">Sentiment</option>
              </select>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    sortOrder:
                      filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })
                }
                className="btn-outline px-3"
              >
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <AdvancedDataTable
        data={filteredStocks}
        columns={[
          {
            key: 'symbol',
            label: 'Symbol',
            sortable: true,
            render: (value, row) => (
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {row.name}
                </div>
              </div>
            ),
          },
          {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (value, row) => (
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  ${value.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {row.marketCap} market cap
                </div>
              </div>
            ),
          },
          {
            key: 'change',
            label: 'Change',
            sortable: true,
            render: (value, row) => (
              <div>
                <div
                  className={`font-semibold ${
                    value >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {value >= 0 ? '+' : ''}${value.toFixed(2)}
                </div>
                <div
                  className={`text-sm ${
                    row.changePercent >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {row.changePercent >= 0 ? '+' : ''}
                  {row.changePercent.toFixed(2)}%
                </div>
              </div>
            ),
          },
          {
            key: 'volume',
            label: 'Volume',
            sortable: true,
            render: (value) => (
              <div className="text-gray-900 dark:text-white">
                {(value / 1_000_000).toFixed(1)}M
              </div>
            ),
          },
          {
            key: 'prediction',
            label: 'Prediction',
            sortable: true,
            render: (value) => (
              <div className="flex items-center space-x-2">
                {value.direction === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <div
                    className={`font-semibold ${
                      value.direction === 'up'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {value.direction === 'up' ? '+' : ''}
                    {value.deltaPct.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {(value.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'sentiment',
            label: 'Sentiment',
            sortable: true,
            render: (value) => (
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentBg(
                  value
                )} ${getSentimentColor(value)}`}
              >
                {(value * 100).toFixed(0)}%
              </div>
            ),
          },
        ]}
        title="Market Screener Results"
        searchable={false}
        exportable={true}
        pagination={true}
        pageSize={10}
      />
    </div>
  )
}
