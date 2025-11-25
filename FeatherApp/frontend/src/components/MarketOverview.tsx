import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  high: number
  low: number
  open: number
  previousClose: number
}

interface MarketOverviewData {
  indices: MarketData[]
}

export const MarketOverview = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D')

  // Mock index data only - rest of the market views have been intentionally removed per scope
  const marketData: MarketOverviewData = {
    indices: [
      {
        symbol: 'SPX',
        name: 'S&P 500',
        price: 4521.54,
        change: 52.34,
        changePercent: 1.17,
        volume: 3250000000,
        marketCap: 0,
        high: 4530.25,
        low: 4480.15,
        open: 4495.20,
        previousClose: 4469.20
      },
      {
        symbol: 'DJI',
        name: 'Dow Jones',
        price: 35225.16,
        change: 425.78,
        changePercent: 1.22,
        volume: 2850000000,
        marketCap: 0,
        high: 35280.45,
        low: 34850.30,
        open: 34950.25,
        previousClose: 34799.38
      },
      {
        symbol: 'IXIC',
        name: 'NASDAQ',
        price: 14098.01,
        change: 198.45,
        changePercent: 1.43,
        volume: 4250000000,
        marketCap: 0,
        high: 14125.60,
        low: 13950.30,
        open: 13980.25,
        previousClose: 13899.56
      },
      {
        symbol: 'RUT',
        name: 'Russell 2000',
        price: 1856.42,
        change: 23.15,
        changePercent: 1.26,
        volume: 1850000000,
        marketCap: 0,
        high: 1865.30,
        low: 1835.20,
        open: 1840.25,
        previousClose: 1833.27
      }
    ]
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeBg = (change: number) => {
    return change >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(2)
  }

  const renderIndices = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {marketData.indices.map((index) => (
        <div key={index.symbol} className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{index.symbol}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{index.name}</p>
            </div>
            <div className={`p-2 rounded-full ${getChangeBg(index.change)}`}>
              {getChangeIcon(index.change)}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {index.price.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
            </span>
            <span className={`text-sm font-medium ${getChangeColor(index.change)}`}>
              ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Vol: {formatNumber(index.volume)}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Market Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time market data and analysis
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="input"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
          </select>
        </div>
      </div>

      {/* Content - Only showing Indices */}
      <div>
        {renderIndices()}
      </div>
    </div>
  )
}
