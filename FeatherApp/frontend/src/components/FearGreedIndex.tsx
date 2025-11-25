import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle, Smile, Frown, Meh } from 'lucide-react'

interface FearGreedData {
  current: number
  previous: number
  weekAgo: number
  monthAgo: number
  yearAgo: number
  lastUpdated: string
  indicators: {
    name: string
    value: number
    description: string
  }[]
}

export const FearGreedIndex = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D')
  const [showDetails, setShowDetails] = useState(false)

  // Mock Fear & Greed data
  const fearGreedData: FearGreedData = {
    current: 31,
    previous: 26,
    weekAgo: 29,
    monthAgo: 62,
    yearAgo: 72,
    lastUpdated: new Date().toISOString(),
    indicators: [
      { name: 'Market Momentum', value: 25, description: 'S&P 500 vs 125-day average' },
      { name: 'Stock Price Strength', value: 30, description: 'Stocks hitting 52-week highs vs lows' },
      { name: 'Stock Price Breadth', value: 35, description: 'Volume in rising vs declining stocks' },
      { name: 'Put and Call Options', value: 20, description: 'Put/call ratio and options volume' },
      { name: 'Junk Bond Demand', value: 40, description: 'High yield bond demand vs treasuries' },
      { name: 'Market Volatility', value: 25, description: 'VIX volatility index' },
      { name: 'Safe Haven Demand', value: 30, description: 'Treasury vs stock performance' }
    ]
  }

  const getIndexLevel = (value: number) => {
    if (value <= 25) return { level: 'Extreme Fear', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900' }
    if (value <= 45) return { level: 'Fear', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900' }
    if (value <= 55) return { level: 'Neutral', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900' }
    if (value <= 75) return { level: 'Greed', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' }
    return { level: 'Extreme Greed', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900' }
  }

  const getIndexIcon = (value: number) => {
    if (value <= 25) return <Frown className="h-6 w-6 text-red-500" />
    if (value <= 45) return <AlertTriangle className="h-6 w-6 text-orange-500" />
    if (value <= 55) return <Meh className="h-6 w-6 text-yellow-500" />
    if (value <= 75) return <Smile className="h-6 w-6 text-green-500" />
    return <TrendingUp className="h-6 w-6 text-green-500" />
  }

  const getGaugeColor = (value: number) => {
    if (value <= 25) return '#ef4444'
    if (value <= 45) return '#f97316'
    if (value <= 55) return '#eab308'
    if (value <= 75) return '#22c55e'
    return '#16a34a'
  }

  const renderGauge = () => {
    const size = 200
    const strokeWidth = 20
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const progress = (fearGreedData.current / 100) * circumference
    const color = getGaugeColor(fearGreedData.current)

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {fearGreedData.current}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            {getIndexLevel(fearGreedData.current).level}
          </div>
        </div>
      </div>
    )
  }

  const getHistoricalChange = (current: number, historical: number) => {
    const change = current - historical
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : 'down',
      color: change > 0 ? 'text-green-600' : 'text-red-600'
    }
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Fear & Greed Index
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            What emotion is driving the market now?
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getIndexIcon(fearGreedData.current)}
          <span className={`text-sm font-medium ${getIndexLevel(fearGreedData.current).color}`}>
            {getIndexLevel(fearGreedData.current).level}
          </span>
        </div>
      </div>

      {/* Main Gauge */}
      <div className="flex items-center justify-center mb-6">
        {renderGauge()}
      </div>

      {/* Current Status */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {getIndexLevel(fearGreedData.current).level} is driving the US market
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated {new Date(fearGreedData.lastUpdated).toLocaleString()}
        </p>
      </div>

      {/* Historical Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Previous Close</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {fearGreedData.previous}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getIndexLevel(fearGreedData.previous).level}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">1 Week Ago</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {fearGreedData.weekAgo}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getIndexLevel(fearGreedData.weekAgo).level}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">1 Month Ago</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {fearGreedData.monthAgo}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getIndexLevel(fearGreedData.monthAgo).level}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">1 Year Ago</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {fearGreedData.yearAgo}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getIndexLevel(fearGreedData.yearAgo).level}
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            7 Fear & Greed Indicators
          </h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {showDetails && (
          <div className="space-y-3">
            {fearGreedData.indicators.map((indicator, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {indicator.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {indicator.description}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${indicator.value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {indicator.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market Interpretation */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Market Interpretation
        </h5>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {fearGreedData.current <= 25 
            ? "Extreme fear may indicate a buying opportunity, but be cautious of further declines."
            : fearGreedData.current <= 45
            ? "Fear suggests cautious sentiment. Consider defensive positions and quality stocks."
            : fearGreedData.current <= 55
            ? "Neutral sentiment indicates balanced market conditions. Focus on fundamentals."
            : fearGreedData.current <= 75
            ? "Greed suggests optimism but watch for overvaluation. Consider taking some profits."
            : "Extreme greed indicates potential market top. Consider reducing risk exposure."
          }
        </p>
      </div>
    </div>
  )
}
