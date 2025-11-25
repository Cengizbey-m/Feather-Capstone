import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Settings, Download, Maximize2, Minimize2, RotateCcw } from 'lucide-react'

interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface TechnicalIndicator {
  name: string
  type: 'overlay' | 'oscillator'
  enabled: boolean
  color: string
  period: number
}

interface DrawingTool {
  name: string
  icon: string
  active: boolean
}

export const AdvancedChart = ({ 
  symbol, 
  data = [], 
  height = 600 
}: { 
  symbol: string
  data?: ChartData[]
  height?: number 
}) => {
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area' | 'volume'>('candlestick')
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M'>('1d')
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([
    { name: 'SMA 20', type: 'overlay', enabled: true, color: '#3b82f6', period: 20 },
    { name: 'SMA 50', type: 'overlay', enabled: true, color: '#ef4444', period: 50 },
    { name: 'EMA 12', type: 'overlay', enabled: false, color: '#10b981', period: 12 },
    { name: 'EMA 26', type: 'overlay', enabled: false, color: '#f59e0b', period: 26 },
    { name: 'RSI', type: 'oscillator', enabled: false, color: '#8b5cf6', period: 14 },
    { name: 'MACD', type: 'oscillator', enabled: false, color: '#06b6d4', period: 12 },
    { name: 'Bollinger Bands', type: 'overlay', enabled: false, color: '#84cc16', period: 20 }
  ])
  const [drawingTools, setDrawingTools] = useState<DrawingTool[]>([
    { name: 'Trend Line', icon: '📈', active: false },
    { name: 'Horizontal Line', icon: '➖', active: false },
    { name: 'Fibonacci', icon: '🌀', active: false },
    { name: 'Rectangle', icon: '⬜', active: false },
    { name: 'Text', icon: '📝', active: false }
  ])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  // Generate mock data if none provided
  const chartData: ChartData[] = data.length > 0 ? data : Array.from({ length: 100 }, (_, i) => {
    const basePrice = 150
    const volatility = 0.02
    const trend = Math.sin(i / 20) * 0.1
    const random = (Math.random() - 0.5) * volatility
    const price = basePrice * (1 + trend + random)
    
    const open = price * (1 + (Math.random() - 0.5) * 0.01)
    const close = price * (1 + (Math.random() - 0.5) * 0.01)
    const high = Math.max(open, close) * (1 + Math.random() * 0.02)
    const low = Math.min(open, close) * (1 - Math.random() * 0.02)
    
    return {
      time: new Date(Date.now() - (99 - i) * 24 * 60 * 60 * 1000).toISOString(),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000) + 100000
    }
  })

  const maxPrice = Math.max(...chartData.map(d => d.high))
  const minPrice = Math.min(...chartData.map(d => d.low))
  const priceRange = maxPrice - minPrice

  const calculateSMA = (period: number) => {
    return chartData.map((_, i) => {
      if (i < period - 1) return null
      const slice = chartData.slice(i - period + 1, i + 1)
      return slice.reduce((sum, d) => sum + d.close, 0) / period
    })
  }

  const calculateEMA = (period: number): number[] => {
    const multiplier = 2 / (period + 1)
    return chartData.map((d, i) => {
      if (i === 0) return d.close
      const prevEMAs = calculateEMA(period)
      const prevEMA: number = prevEMAs[i - 1] || d.close
      return (d.close - prevEMA) * multiplier + prevEMA
    })
  }

  const calculateRSI = (period: number = 14) => {
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

  const calculateBollingerBands = (period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(period)
    return sma.map((smaValue, i) => {
      if (!smaValue) return null
      const slice = chartData.slice(i - period + 1, i + 1)
      const variance = slice.reduce((sum, d) => sum + Math.pow(d.close - smaValue, 2), 0) / period
      const std = Math.sqrt(variance)
      return {
        upper: smaValue + (std * stdDev),
        middle: smaValue,
        lower: smaValue - (std * stdDev)
      }
    })
  }

  const renderCandlestickChart = () => {
    const width = 1200
    const height = 400
    const padding = 60
    const barWidth = (width - 2 * padding) / chartData.length * 0.8

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Candlesticks */}
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
        
        {/* Technical Indicators */}
        {indicators.filter(ind => ind.enabled).map((indicator, indIndex) => {
          if (indicator.name.startsWith('SMA')) {
            const sma = calculateSMA(indicator.period)
            return sma.map((value, i) => {
              if (!value) return null
              const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
              const y = height - padding - ((value - minPrice) / priceRange) * (height - 2 * padding)
              return (
                <circle
                  key={`${indIndex}-${i}`}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={indicator.color}
                  className="hover:r-4 transition-all"
                />
              )
            })
          }
          if (indicator.name.startsWith('EMA')) {
            const ema = calculateEMA(indicator.period)
            return ema.map((value, i) => {
              if (!value) return null
              const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
              const y = height - padding - ((value - minPrice) / priceRange) * (height - 2 * padding)
              return (
                <circle
                  key={`${indIndex}-${i}`}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={indicator.color}
                  className="hover:r-4 transition-all"
                />
              )
            })
          }
          if (indicator.name === 'Bollinger Bands') {
            const bb = calculateBollingerBands(indicator.period)
            return bb.map((value, i) => {
              if (!value) return null
              const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
              const upperY = height - padding - ((value.upper - minPrice) / priceRange) * (height - 2 * padding)
              const middleY = height - padding - ((value.middle - minPrice) / priceRange) * (height - 2 * padding)
              const lowerY = height - padding - ((value.lower - minPrice) / priceRange) * (height - 2 * padding)
              return (
                <g key={`${indIndex}-${i}`}>
                  <line x1={x} y1={upperY} x2={x} y2={lowerY} stroke={indicator.color} strokeWidth="1" opacity="0.5" />
                  <circle cx={x} cy={middleY} r="1" fill={indicator.color} />
                </g>
              )
            })
          }
          return null
        })}
      </svg>
    )
  }

  const renderVolumeChart = () => {
    const width = 1200
    const height = 150
    const padding = 40
    const maxVolume = Math.max(...chartData.map(d => d.volume))

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const barHeight = (d.volume / maxVolume) * (height - 2 * padding)
          const y = height - padding - barHeight
          const isGreen = d.close > d.open

          return (
            <rect
              key={i}
              x={x - 2}
              y={y}
              width="4"
              height={barHeight}
              fill={isGreen ? "#10b981" : "#ef4444"}
              opacity="0.7"
            />
          )
        })}
      </svg>
    )
  }

  const renderRSIChart = () => {
    const width = 1200
    const height = 150
    const padding = 40
    const rsi = calculateRSI(14)

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* RSI levels */}
        <line x1={padding} y1={height - padding - (70 / 100) * (height - 2 * padding)} x2={width - padding} y2={height - padding - (70 / 100) * (height - 2 * padding)} stroke="#ef4444" strokeWidth="1" strokeDasharray="5,5" />
        <line x1={padding} y1={height - padding - (30 / 100) * (height - 2 * padding)} x2={width - padding} y2={height - padding - (30 / 100) * (height - 2 * padding)} stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" />
        <line x1={padding} y1={height - padding - (50 / 100) * (height - 2 * padding)} x2={width - padding} y2={height - padding - (50 / 100) * (height - 2 * padding)} stroke="#6b7280" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* RSI line */}
        {rsi.map((value, i) => {
          if (!value) return null
          const x = (i / (chartData.length - 1)) * (width - 2 * padding) + padding
          const y = height - padding - (value / 100) * (height - 2 * padding)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#8b5cf6"
              className="hover:r-4 transition-all"
            />
          )
        })}
      </svg>
    )
  }

  const toggleIndicator = (index: number) => {
    const newIndicators = [...indicators]
    newIndicators[index].enabled = !newIndicators[index].enabled
    setIndicators(newIndicators)
  }

  const toggleDrawingTool = (index: number) => {
    const newTools = drawingTools.map((tool, i) => ({
      ...tool,
      active: i === index ? !tool.active : false
    }))
    setDrawingTools(newTools)
  }

  return (
    <div className={`card ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {symbol} Advanced Chart
          </h3>
          <div className="flex space-x-2">
            {['1m', '5m', '15m', '1h', '4h', '1d', '1w', '1M'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === tf
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Chart Type */}
          <div className="flex space-x-2">
            {[
              { key: 'candlestick', label: 'Candlestick', icon: '📊' },
              { key: 'line', label: 'Line', icon: '📈' },
              { key: 'area', label: 'Area', icon: '📉' },
              { key: 'volume', label: 'Volume', icon: '📊' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setChartType(key as any)}
                className={`flex items-center space-x-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartType === key
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Drawing Tools */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Drawing:</span>
            {drawingTools.map((tool, index) => (
              <button
                key={index}
                onClick={() => toggleDrawingTool(index)}
                className={`p-2 rounded-md transition-colors ${
                  tool.active
                    ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title={tool.name}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Technical Indicators</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={indicator.enabled}
                  onChange={() => toggleIndicator(index)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{indicator.name}</span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: indicator.color }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        {chartType === 'candlestick' && renderCandlestickChart()}
        {chartType === 'line' && renderCandlestickChart()}
        {chartType === 'area' && renderCandlestickChart()}
        {chartType === 'volume' && renderVolumeChart()}
        
        {/* RSI Chart */}
        {indicators.find(ind => ind.name === 'RSI' && ind.enabled) && (
          <div className="absolute bottom-0 left-0 right-0" style={{ height: '150px' }}>
            {renderRSIChart()}
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              ${maxPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              ${minPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Change</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {((chartData[chartData.length - 1]?.close - chartData[0]?.close) / chartData[0]?.close * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
