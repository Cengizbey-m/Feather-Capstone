import { useState, useRef } from 'react'
import { Target } from 'lucide-react'

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
  onDataPointClick,
}: InteractiveChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartData | null>(null)
  const [selectedIndicator, setSelectedIndicator] =
    useState<'sma' | 'ema' | 'rsi' | 'macd'>('sma')
  const [timeframe, setTimeframe] =
    useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M')
  const chartRef = useRef<HTMLDivElement>(null)

  // ---- Mock data fallback ----
  const chartData: ChartData[] =
    data.length > 0
      ? data
      : Array.from({ length: 30 }, (_, i) => {
          const basePrice = 150
          const volatility = 0.02
          const trend = Math.sin(i / 5) * 0.1
          const random = (Math.random() - 0.5) * volatility
          const price = basePrice * (1 + trend + random)

          return {
            time: new Date(
              Date.now() - (29 - i) * 24 * 60 * 60 * 1000
            ).toISOString(),
            price,
            volume: Math.floor(Math.random() * 1000000) + 100000,
            high: price * (1 + Math.random() * 0.02),
            low: price * (1 - Math.random() * 0.02),
            open: price * (1 + (Math.random() - 0.5) * 0.01),
            close: price,
          }
        })

  if (chartData.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-gray-500 dark:text-gray-400">
          No chart data available for {symbol}.
        </p>
      </div>
    )
  }

  const maxPrice = Math.max(...chartData.map((d) => d.high))
  const minPrice = Math.min(...chartData.map((d) => d.low))
  const priceRange = maxPrice - minPrice || 1

  // ---- Indicators (fixed EMA!) ----
  const getSMA = (period: number): (number | null)[] => {
    return chartData.map((_, i) => {
      if (i < period - 1) return null
      const slice = chartData.slice(i - period + 1, i + 1)
      return slice.reduce((sum, d) => sum + d.close, 0) / period
    })
  }

  const getEMA = (period: number): (number | null)[] => {
    const multiplier = 2 / (period + 1)
    const ema: (number | null)[] = []

    chartData.forEach((d, i) => {
      if (i === 0) {
        ema.push(d.close)
      } else {
        const prev = ema[i - 1] ?? d.close
        ema.push((d.close - prev) * multiplier + prev)
      }
    })

    return ema
  }

  const getRSI = (period: number = 14): (number | null)[] => {
    const gains: number[] = []
    const losses: number[] = []

    for (let i = 1; i < chartData.length; i++) {
      const change = chartData[i].close - chartData[i - 1].close
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }

    return gains.map((_, i) => {
      if (i < period - 1) return null
      const avgGain =
        gains.slice(i - period + 1, i + 1).reduce((sum, g) => sum + g, 0) /
        period
      const avgLoss =
        losses.slice(i - period + 1, i + 1).reduce((sum, l) => sum + l, 0) /
        period
      if (avgLoss === 0) return 100
      const rs = avgGain / avgLoss
      return 100 - 100 / (1 + rs)
    })
  }

  const sma20 = getSMA(20)
  const ema12 = getEMA(12)
  const rsi = getRSI(14)

  const renderLineChart = () => {
    const width = 800
    const svgHeight = height
    const padding = 40

    const points = chartData
      .map((d, i) => {
        const x =
          (i / (chartData.length - 1 || 1)) * (width - 2 * padding) + padding
        const y =
          svgHeight -
          padding -
          ((d.price - minPrice) / priceRange) * (svgHeight - 2 * padding)
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="overflow-visible"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.1"
            />
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
          points={`${padding},${svgHeight - padding} ${points} ${
            width - padding
          },${svgHeight - padding}`}
          fill="url(#gradient)"
          opacity="0.1"
        />

        {/* Indicator dots */}
        {showIndicators && selectedIndicator === 'sma' &&
          sma20.map((value, i) => {
            if (value == null) return null
            const x =
              (i / (chartData.length - 1 || 1)) * (width - 2 * padding) +
              padding
            const y =
              svgHeight -
              padding -
              ((value - minPrice) / priceRange) * (svgHeight - 2 * padding)
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

        {showIndicators && selectedIndicator === 'ema' &&
          ema12.map((value, i) => {
            if (value == null) return null
            const x =
              (i / (chartData.length - 1 || 1)) * (width - 2 * padding) +
              padding
            const y =
              svgHeight -
              padding -
              ((value - minPrice) / priceRange) * (svgHeight - 2 * padding)
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

        {showIndicators && selectedIndicator === 'rsi' &&
          rsi.map((value, i) => {
            if (value == null) return null
            const x =
              (i / (chartData.length - 1 || 1)) * (width - 2 * padding) +
              padding
            const y =
              svgHeight -
              padding -
              (value / 100) * (svgHeight - 2 * padding)
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

        <defs>
          <linearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    )
  }

  const renderCandlestickChart = () => {
    const width = 800
    const svgHeight = height
    const padding = 40
    const barWidth = ((width - 2 * padding) / chartData.length) * 0.8

    return (
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="overflow-visible"
      >
        {chartData.map((d, i) => {
          const x =
            (i / (chartData.length - 1 || 1)) * (width - 2 * padding) + padding
          const openY =
            svgHeight -
            padding -
            ((d.open - minPrice) / priceRange) * (svgHeight - 2 * padding)
          const closeY =
            svgHeight -
            padding -
            ((d.close - minPrice) / priceRange) * (svgHeight - 2 * padding)
          const highY =
            svgHeight -
            padding -
            ((d.high - minPrice) / priceRange) * (svgHeight - 2 * padding)
          const lowY =
            svgHeight -
            padding -
            ((d.low - minPrice) / priceRange) * (svgHeight - 2 * padding)
          const isGreen = d.close > d.open

          return (
            <g key={i}>
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={isGreen ? '#10b981' : '#ef4444'}
                strokeWidth="1"
              />
              <rect
                x={x - barWidth / 2}
                y={Math.min(openY, closeY)}
                width={barWidth}
                height={Math.max(Math.abs(closeY - openY), 1)}
                fill={isGreen ? '#10b981' : '#ef4444'}
                opacity={0.8}
              />
            </g>
          )
        })}
      </svg>
    )
  }

  const renderVolumeChart = () => {
    const width = 800
    const svgHeight = 200
    const padding = 40
    const maxVolume = Math.max(...chartData.map((d) => d.volume)) || 1

    return (
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="overflow-visible"
      >
        {chartData.map((d, i) => {
          const x =
            (i / (chartData.length - 1 || 1)) * (width - 2 * padding) + padding
          const barHeight =
            (d.volume / maxVolume) * (svgHeight - 2 * padding)
          const y = svgHeight - padding - barHeight

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
      {/* Header */}
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
            onChange={(e) =>
              setSelectedIndicator(e.target.value as any)
            }
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
      <div className="relative" ref={chartRef}>
        {type === 'line' && renderLineChart()}
        {type === 'candlestick' && renderCandlestickChart()}
        {type === 'volume' && renderVolumeChart()}
      </div>
    </div>
  )
}
