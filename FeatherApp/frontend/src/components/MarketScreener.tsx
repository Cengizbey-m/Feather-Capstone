import { useState } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, Star, StarOff } from 'lucide-react'
import { AdvancedDataTable } from './AdvancedDataTable'

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
    sortOrder: 'desc' as 'asc' | 'desc'
  })

  const [searchQuery, setSearchQuery] = useState('')

  // Mock stock data
  const stocks: Stock[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.25,
      change: 2.45,
      changePercent: 1.42,
      volume: 45234567,
      marketCap: '2.8T',
      sector: 'Technology',
      prediction: { direction: 'up', confidence: 0.78, deltaPct: 2.3 },
      sentiment: 0.65,
      isWatched: true
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 248.50,
      change: -5.25,
      changePercent: -2.07,
      volume: 23456789,
      marketCap: '789B',
      sector: 'Automotive',
      prediction: { direction: 'down', confidence: 0.72, deltaPct: -1.8 },
      sentiment: 0.58,
      isWatched: false
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.30,
      change: 3.20,
      changePercent: 2.30,
      volume: 12345678,
      marketCap: '1.8T',
      sector: 'Technology',
      prediction: { direction: 'up', confidence: 0.85, deltaPct: 3.1 },
      sentiment: 0.72,
      isWatched: true
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 378.90,
      change: 1.85,
      changePercent: 0.49,
      volume: 9876543,
      marketCap: '2.8T',
      sector: 'Technology',
      prediction: { direction: 'up', confidence: 0.68, deltaPct: 1.2 },
      sentiment: 0.61,
      isWatched: false
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: 324.15,
      change: -2.10,
      changePercent: -0.64,
      volume: 8765432,
      marketCap: '1.7T',
      sector: 'Consumer Discretionary',
      prediction: { direction: 'down', confidence: 0.55, deltaPct: -0.8 },
      sentiment: 0.48,
      isWatched: true
    }
  ]

  const sectors = ['All', 'Technology', 'Healthcare', 'Financial', 'Consumer Discretionary', 'Automotive']

  const filteredStocks = stocks
    .filter(stock => {
      const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSector = !filters.sector || stock.sector === filters.sector
      const matchesPrice = (!filters.minPrice || stock.price >= parseFloat(filters.minPrice)) &&
                          (!filters.maxPrice || stock.price <= parseFloat(filters.maxPrice))
      const matchesChange = (!filters.minChange || stock.changePercent >= parseFloat(filters.minChange)) &&
                           (!filters.maxChange || stock.changePercent <= parseFloat(filters.maxChange))
      const matchesVolume = !filters.minVolume || stock.volume >= parseInt(filters.minVolume)

      return matchesSearch && matchesSector && matchesPrice && matchesChange && matchesVolume
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Stock] as number
      const bValue = b[filters.sortBy as keyof Stock] as number
      return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    })

  const toggleWatch = (symbol: string) => {
    // In a real app, this would update the watchlist
    console.log(`Toggling watch for ${symbol}`)
  }

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
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className="input"
            >
              {sectors.map(sector => (
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
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="input flex-1"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
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
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="input flex-1"
              >
                <option value="changePercent">Change %</option>
                <option value="price">Price</option>
                <option value="volume">Volume</option>
                <option value="sentiment">Sentiment</option>
              </select>
              <button
                onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
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
            )
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
            )
          },
          {
            key: 'change',
            label: 'Change',
            sortable: true,
            render: (value, row) => (
              <div>
                <div className={`font-semibold ${
                  value >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {value >= 0 ? '+' : ''}${value.toFixed(2)}
                </div>
                <div className={`text-sm ${
                  row.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {row.changePercent >= 0 ? '+' : ''}{row.changePercent.toFixed(2)}%
                </div>
              </div>
            )
          },
          {
            key: 'volume',
            label: 'Volume',
            sortable: true,
            render: (value) => (
              <div className="text-gray-900 dark:text-white">
                {(value / 1000000).toFixed(1)}M
              </div>
            )
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
                  <div className={`font-semibold ${
                    value.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {value.direction === 'up' ? '+' : ''}{value.deltaPct.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {(value.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>
            )
          },
          {
            key: 'sentiment',
            label: 'Sentiment',
            sortable: true,
            render: (value) => (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentBg(value)} ${getSentimentColor(value)}`}>
                {(value * 100).toFixed(0)}%
              </div>
            )
          }
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
