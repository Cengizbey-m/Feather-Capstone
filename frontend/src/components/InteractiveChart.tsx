import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from 'lucide-react'

interface ChartData {
  time: string
  price: number
  volume: number
  high: number
  low: number
  open: number
  close: number
}

interface InteractiveChartProps {
  symbol: string
  data?: ChartData[]
  type?: 'line' | 'candlestick' | 'volume' | 'area'
  height?: number
  showIndicators?: boolean
  showCrosshair?: boolean
  onDataPointClick?: (data: ChartData) => void
}

export const InteractiveChart = ({
  symbol,
  data = [],
  type = 'line',
  height = 400,
  showIndicators = true,
  showCrosshair = true,
  onDataPointClick
}: InteractiveChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartData | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<'sma' | 'ema' | 'rsi' | 'macd'>('sma')
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M')
  const chartRef = useRef<HTMLDivElement>(null)

  // Generate mock data if none provided
  const chartData: ChartData[] = data.length > 0 ? data : Array.from({ length: 30 }, (_, i) => {
    const basePrice = 150
    const volatility = 0.02
    const trend = Math.sin(i / 5) * 0.1
    const random = (Math.random() - 0.5) * volatility
    const price = basePrice * (1 + trend + random)
    
    return {
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      price: price,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: price * (1 + Math.random() * 0.02),
      low: price * (1 - Math.random() * 0.02),
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      close: price
    }
  })

  const maxPrice = Math.max(...chartData.map(d => d.high))
  const minPrice = Math.min(...chartData.map(d => d.low))
  const priceRange = maxPrice - minPrice

  const getSMA = (period: number) => {
    return chartData.map((_, i) => {
      if (i < period - 1) return null
      const slice = chartData.slice(i - period + 1, i + 1)
      return slice.reduce((sum, d) => sum + d.close, 0) / period
    })
  }

  const getEMA = (period: number): number[] => {
    const multiplier = 2 / (period + 1)
    return chartData.map((d, i) => {
      if (i === 0) return d.close
      const prevEMAs = getEMA(period)
      const prevEMA: number = prevEMAs[i - 1] || d.close
      return (d.close - prevEMA) * multiplier + prevEMA
    })
  }

  const getRSI = (period: number = 14) => {
    const gains: number[] = []
    const losses: number[] = []
    
    for (let i = 1; i < chartData.length; i++) {
      const change = chartData[i].close - chartData[i - 1].close
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }
    
    return gains.map((_, i) => {
      if (i < period - 1) return null
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((sum, g) => sum + g, 0) / period
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((sum, l) => sum + l, 0) / period
      const rs = avgGain / avgLoss
      return 100 - (100 / (1 + rs))
    })
  }

  const sma20 = getSMA(20)
  const ema12 = getEMA(12)
  const rsi = getRSI(14)

  const renderLineChart = () => {
    const width = 800
    const height = 400
    const padding = 40
    
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
      const y = height - padding - ((d.price - minPrice) / priceRange) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Price line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={points}
          className="drop-shadow-sm"
        />
        
        {/* Area under curve */}
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#gradient)"
          opacity="0.1"
        />
        
        {/* SMA Line */}
        {selectedIndicator === 'sma' && sma20.map((value, i) => {
          if (!value) return null
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const y = height - padding - ((value - minPrice) / priceRange) * (height - 2 * padding)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#ef4444"
              className="hover:r-4 transition-all"
            />
          )
        })}
        
        {/* EMA Line */}
        {selectedIndicator === 'ema' && ema12.map((value, i) => {
          if (!value) return null
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const y = height - padding - ((value - minPrice) / priceRange) * (height - 2 * padding)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#10b981"
              className="hover:r-4 transition-all"
            />
          )
        })}
        
        {/* RSI Line */}
        {selectedIndicator === 'rsi' && rsi.map((value, i) => {
          if (!value) return null
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const y = height - padding - (value / 100) * (height - 2 * padding)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#f59e0b"
              className="hover:r-4 transition-all"
            />
          )
        })}
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Hover indicator */}
        {hoveredPoint && (
          <g>
            <line
              x1={(chartData.indexOf(hoveredPoint) / (chartData.length - 1)) * (width - 2 * padding) + padding}
              y1={padding}
              x2={(chartData.indexOf(hoveredPoint) / (chartData.length - 1)) * (width - 2 * padding) + padding}
              y2={height - padding}
              stroke="#6b7280"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <circle
              cx={(chartData.indexOf(hoveredPoint) / (chartData.length - 1)) * (width - 2 * padding) + padding}
              cy={height - padding - ((hoveredPoint.price - minPrice) / priceRange) * (height - 2 * padding)}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    )
  }

  const renderCandlestickChart = () => {
    const width = 800
    const height = 400
    const padding = 40
    const barWidth = (width - 2 * padding) / chartData.length * 0.8

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const openY = height - padding - ((d.open - minPrice) / priceRange) * (height - 2 * padding)
          const closeY = height - padding - ((d.close - minPrice) / priceRange) * (height - 2 * padding)
          const highY = height - padding - ((d.high - minPrice) / priceRange) * (height - 2 * padding)
          const lowY = height - padding - ((d.low - minPrice) / priceRange) * (height - 2 * padding)
          const isGreen = d.close > d.open

          return (
            <g key={i}>
              {/* High-Low line */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x - barWidth / 2}
                y={Math.min(openY, closeY)}
                width={barWidth}
                height={Math.abs(closeY - openY)}
                fill={isGreen ? "#10b981" : "#ef4444"}
                opacity={isGreen ? 0.8 : 0.8}
              />
            </g>
          )
        })}
      </svg>
    )
  }

  const renderVolumeChart = () => {
    const width = 800
    const height = 200
    const padding = 40
    const maxVolume = Math.max(...chartData.map(d => d.volume))

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const barHeight = (d.volume / maxVolume) * (height - 2 * padding)
          const y = height - padding - barHeight

          return (
            <rect
              key={i}
              x={x - 2}
              y={y}
              width="4"
              height={barHeight}
              fill="#6b7280"
              opacity="0.7"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <div className="card p-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {symbol} Chart
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex space-x-2">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
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
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value as any)}
            className="input"
          >
            <option value="sma">SMA 20</option>
            <option value="ema">EMA 12</option>
            <option value="rsi">RSI 14</option>
            <option value="macd">MACD</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {type === 'line' && renderLineChart()}
        {type === 'candlestick' && renderCandlestickChart()}
        {type === 'volume' && renderVolumeChart()}
        
        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 min-w-[200px]">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              {new Date(hoveredPoint.time).toLocaleDateString()}
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Price:</span>
                <span className="font-medium">${hoveredPoint.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">High:</span>
                <span className="font-medium">${hoveredPoint.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Low:</span>
                <span className="font-medium">${hoveredPoint.low.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Volume:</span>
                <span className="font-medium">{(hoveredPoint.volume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            ${maxPrice.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            ${minPrice.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Change</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {((chartData[chartData.length - 1]?.price - chartData[0]?.price) / chartData[0]?.price * 100).toFixed(2)}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(1)}M
          </div>
        </div>
      </div>
    </div>
  )
}
