import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target } from 'lucide-react'

interface PortfolioSummaryProps {
  isLoading?: boolean
}

export const PortfolioSummary = ({ isLoading }: PortfolioSummaryProps) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D')
  
  // Mock portfolio data
  const portfolioData = {
    totalValue: 125430.50,
    dayChange: 2847.32,
    dayChangePercent: 2.32,
    positions: [
      { symbol: 'AAPL', shares: 50, value: 8750.00, change: 125.50, changePercent: 1.46 },
      { symbol: 'GOOGL', shares: 25, value: 31250.00, change: 450.25, changePercent: 1.46 },
      { symbol: 'MSFT', shares: 30, value: 10200.00, change: -75.30, changePercent: -0.73 },
      { symbol: 'TSLA', shares: 15, value: 3750.00, change: 125.75, changePercent: 3.47 },
      { symbol: 'AMZN', shares: 20, value: 6480.50, change: 89.25, changePercent: 1.39 },
    ],
    allocation: [
      { symbol: 'AAPL', percentage: 25.0, color: 'bg-blue-500' },
      { symbol: 'GOOGL', percentage: 35.0, color: 'bg-green-500' },
      { symbol: 'MSFT', percentage: 20.0, color: 'bg-purple-500' },
      { symbol: 'TSLA', percentage: 12.0, color: 'bg-red-500' },
      { symbol: 'AMZN', percentage: 8.0, color: 'bg-yellow-500' },
    ]
  }

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const isPositive = portfolioData.dayChange >= 0

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Summary
          </h3>
          <div className="flex space-x-2">
            {(['1D', '1W', '1M', '1Y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === period
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Total Value */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ${portfolioData.totalValue.toLocaleString()}
          </div>
          <div className={`flex items-center justify-center space-x-2 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="text-lg font-semibold">
              {isPositive ? '+' : ''}${portfolioData.dayChange.toLocaleString()} ({isPositive ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Portfolio Allocation
          </h4>
          <div className="flex h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {portfolioData.allocation.map((item, index) => (
              <div
                key={item.symbol}
                className={`${item.color} transition-all duration-300`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.symbol}: ${item.percentage}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            {portfolioData.allocation.map((item) => (
              <span key={item.symbol}>{item.symbol}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Positions */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Positions
          </h4>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {portfolioData.positions.map((position) => {
            const isPosPositive = position.change >= 0
            return (
              <div key={position.symbol} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-900 dark:text-primary-100">
                      {position.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {position.symbol}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {position.shares} shares
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${position.value.toLocaleString()}
                  </div>
                  <div className={`text-sm flex items-center space-x-1 ${
                    isPosPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPosPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {isPosPositive ? '+' : ''}${position.change.toFixed(2)} ({isPosPositive ? '+' : ''}{position.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Return
            </span>
          </div>
          <div className="text-xl font-bold text-green-600">
            +$12,847.32
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            +11.4% all time
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Best Performer
            </span>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            TSLA
          </div>
          <div className="text-sm text-green-600">
            +$1,250.75 (+3.47%)
          </div>
        </div>
      </div>
    </div>
  )
}
