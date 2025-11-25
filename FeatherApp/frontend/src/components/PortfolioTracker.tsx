import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Target, AlertTriangle, Star, Plus, Trash2, Edit3 } from 'lucide-react'

interface PortfolioHolding {
  id: string
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  marketValue: number
  costBasis: number
  gainLoss: number
  gainLossPercent: number
  dayChange: number
  dayChangePercent: number
  allocation: number
  sector: string
  isWatchlist: boolean
}

interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGainLoss: number
  totalGainLossPercent: number
  dayChange: number
  dayChangePercent: number
  cash: number
  invested: number
  availableCash: number
}

interface PortfolioData {
  summary: PortfolioSummary
  holdings: PortfolioHolding[]
  performance: {
    daily: number
    weekly: number
    monthly: number
    yearly: number
    allTime: number
  }
  allocation: {
    sector: string
    value: number
    percentage: number
    color: string
  }[]
}

export const PortfolioTracker = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1D')
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'allocation' | 'symbol'>('value')
  const [showAddHolding, setShowAddHolding] = useState(false)

  // Mock portfolio data
  const portfolioData: PortfolioData = {
    summary: {
      totalValue: 125430.50,
      totalCost: 115000.00,
      totalGainLoss: 10430.50,
      totalGainLossPercent: 9.07,
      dayChange: 2847.32,
      dayChangePercent: 2.32,
      cash: 15000.00,
      invested: 110430.50,
      availableCash: 15000.00
    },
    holdings: [
      {
        id: '1',
        symbol: 'AAPL',
        name: 'Apple Inc',
        shares: 50,
        avgPrice: 150.00,
        currentPrice: 175.25,
        marketValue: 8762.50,
        costBasis: 7500.00,
        gainLoss: 1262.50,
        gainLossPercent: 16.83,
        dayChange: 125.00,
        dayChangePercent: 1.45,
        allocation: 7.93,
        sector: 'Technology',
        isWatchlist: true
      },
      {
        id: '2',
        symbol: 'GOOGL',
        name: 'Alphabet Inc',
        shares: 25,
        avgPrice: 120.00,
        currentPrice: 148.75,
        marketValue: 3718.75,
        costBasis: 3000.00,
        gainLoss: 718.75,
        gainLossPercent: 23.96,
        dayChange: 75.00,
        dayChangePercent: 2.06,
        allocation: 3.36,
        sector: 'Technology',
        isWatchlist: true
      },
      {
        id: '3',
        symbol: 'TSLA',
        name: 'Tesla Inc',
        shares: 15,
        avgPrice: 200.00,
        currentPrice: 285.75,
        marketValue: 4286.25,
        costBasis: 3000.00,
        gainLoss: 1286.25,
        gainLossPercent: 42.88,
        dayChange: 225.00,
        dayChangePercent: 5.66,
        allocation: 3.88,
        sector: 'Consumer Discretionary',
        isWatchlist: true
      },
      {
        id: '4',
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co',
        shares: 100,
        avgPrice: 140.00,
        currentPrice: 145.50,
        marketValue: 14550.00,
        costBasis: 14000.00,
        gainLoss: 550.00,
        gainLossPercent: 3.93,
        dayChange: 200.00,
        dayChangePercent: 1.39,
        allocation: 13.17,
        sector: 'Financials',
        isWatchlist: false
      },
      {
        id: '5',
        symbol: 'NVDA',
        name: 'NVIDIA Corp',
        shares: 20,
        avgPrice: 350.00,
        currentPrice: 425.30,
        marketValue: 8506.00,
        costBasis: 7000.00,
        gainLoss: 1506.00,
        gainLossPercent: 21.51,
        dayChange: 400.00,
        dayChangePercent: 6.36,
        allocation: 7.70,
        sector: 'Technology',
        isWatchlist: true
      }
    ],
    performance: {
      daily: 2.32,
      weekly: 5.45,
      monthly: 12.15,
      yearly: 28.75,
      allTime: 45.20
    },
    allocation: [
      { sector: 'Technology', value: 21000.00, percentage: 19.0, color: '#3b82f6' },
      { sector: 'Financials', value: 18000.00, percentage: 16.3, color: '#ef4444' },
      { sector: 'Healthcare', value: 15000.00, percentage: 13.6, color: '#10b981' },
      { sector: 'Consumer Discretionary', value: 12000.00, percentage: 10.9, color: '#f59e0b' },
      { sector: 'Energy', value: 8000.00, percentage: 7.2, color: '#8b5cf6' },
      { sector: 'Industrials', value: 6000.00, percentage: 5.4, color: '#06b6d4' },
      { sector: 'Other', value: 3000.00, percentage: 2.7, color: '#6b7280' }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const sortedHoldings = [...portfolioData.holdings].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.marketValue - a.marketValue
      case 'gainLoss':
        return b.gainLoss - a.gainLoss
      case 'allocation':
        return b.allocation - a.allocation
      case 'symbol':
        return a.symbol.localeCompare(b.symbol)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your investments and performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="input"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
            <option value="ALL">All Time</option>
          </select>
          <button
            onClick={() => setShowAddHolding(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Holding</span>
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(portfolioData.summary.totalValue)}
          </div>
          <div className={`text-sm ${getChangeColor(portfolioData.summary.dayChange)}`}>
            {formatCurrency(portfolioData.summary.dayChange)} ({formatPercent(portfolioData.summary.dayChangePercent)})
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Gain/Loss</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(portfolioData.summary.totalGainLoss)}
          </div>
          <div className={`text-sm ${getChangeColor(portfolioData.summary.totalGainLoss)}`}>
            {formatPercent(portfolioData.summary.totalGainLossPercent)}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Invested</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(portfolioData.summary.invested)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(portfolioData.summary.cash)} cash
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPercent(portfolioData.performance.daily)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Today
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <div className="space-y-4">
            {Object.entries(portfolioData.performance).map(([period, value]) => (
              <div key={period} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {period.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${value >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(Math.abs(value) * 2, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getChangeColor(value)}`}>
                    {formatPercent(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sector Allocation
          </h3>
          <div className="space-y-3">
            {portfolioData.allocation.map((sector, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {sector.sector}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(sector.value)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {sector.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Holdings
          </h3>
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input"
            >
              <option value="value">Sort by Value</option>
              <option value="gainLoss">Sort by Gain/Loss</option>
              <option value="allocation">Sort by Allocation</option>
              <option value="symbol">Sort by Symbol</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Symbol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Shares</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Avg Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Current Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Market Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Gain/Loss</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Allocation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding) => (
                <tr key={holding.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">{holding.symbol}</span>
                      {holding.isWatchlist && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{holding.name}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{holding.shares}</td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{formatCurrency(holding.avgPrice)}</td>
                  <td className="py-4 px-4">
                    <div className="text-gray-900 dark:text-white">{formatCurrency(holding.currentPrice)}</div>
                    <div className={`text-sm ${getChangeColor(holding.dayChange)}`}>
                      {formatCurrency(holding.dayChange)} ({formatPercent(holding.dayChangePercent)})
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{formatCurrency(holding.marketValue)}</td>
                  <td className="py-4 px-4">
                    <div className={`font-medium ${getChangeColor(holding.gainLoss)}`}>
                      {formatCurrency(holding.gainLoss)}
                    </div>
                    <div className={`text-sm ${getChangeColor(holding.gainLoss)}`}>
                      {formatPercent(holding.gainLossPercent)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-white">{holding.allocation.toFixed(1)}%</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
