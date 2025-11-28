import { useState } from 'react'
import { TickerSearch } from '@/components/TickerSearch'
import { PriceChart } from '@/components/PriceChart'
import { InteractiveChart } from '@/components/InteractiveChart'
import { usePriceHistory } from '@/hooks/useHistory'

export const ChartsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')

  const { data: history, isLoading, error } = usePriceHistory(selectedSymbol, 60)

  // Raw candles from API (Neon via backend)
  const rawCandles = history?.items ?? []

  // ✅ Ensure candles are sorted oldest -> newest so:
  // - left side of chart = earliest
  // - right side of chart = latest
  const candles = [...rawCandles].sort((a, b) => {
    const ta =
      typeof a.timestamp === 'number'
        ? a.timestamp
        : Date.parse(a.timestamp) / 1000

    const tb =
      typeof b.timestamp === 'number'
        ? b.timestamp
        : Date.parse(b.timestamp) / 1000

    return ta - tb
  })

  const hasData = candles.length > 0

  // Map backend -> InteractiveChart shape
  const chartData = candles.map((candle) => {
    let tsMs: number

    if (typeof candle.timestamp === 'number') {
      // Neon bigint seconds → ms
      tsMs = candle.timestamp * 1000
    } else {
      const parsed = Date.parse(candle.timestamp)
      tsMs = Number.isNaN(parsed) ? Date.now() : parsed
    }

    return {
      time: new Date(tsMs).toISOString(),
      price: candle.close,
      volume: candle.volume,
      high: candle.high,
      low: candle.low,
      open: candle.open,
      close: candle.close,
    }
  })

  const last = hasData ? candles[candles.length - 1] : undefined   // newest
  const first = hasData ? candles[0] : undefined                    // oldest

  return (
    <div className="space-y-6">
      {/* Symbol selection */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Select Symbol
        </h2>
        <div className="max-w-md">
          <TickerSearch
            onSelect={setSelectedSymbol}
            placeholder="Search for a ticker symbol..."
          />
        </div>
      </div>

      {/* Loading / error states */}
      {isLoading && (
        <div className="card p-6">
          <p className="text-gray-500 dark:text-gray-400">
            Loading price history…
          </p>
        </div>
      )}

      {error && (
        <div className="card p-6">
          <p className="text-red-500">
            Failed to load history for {selectedSymbol}
          </p>
        </div>
      )}

      {/* Only show charts when we *actually* have candles */}
      {hasData && last && first && (
        <>
          {/* Summary card powered by real candles */}
          <PriceChart
            symbol={selectedSymbol}
            data={{
              price: last.close,  // latest close
              change: last.close - first.close,
              changePercent: ((last.close - first.close) / first.close) * 100,
              volume: last.volume,
              high: Math.max(...candles.map((c) => c.high)),
              low: Math.min(...candles.map((c) => c.low)),
            }}
            isLoading={isLoading}
          />

          {/* Real OHLCV chart with candles + indicators */}
          <InteractiveChart
            symbol={selectedSymbol}
            data={chartData}
            type="candlestick"
            showIndicators={true}
            showCrosshair={true}
          />
        </>
      )}

      {/* Optional: if not loading and no data, show a friendly message */}
      {!isLoading && !error && !hasData && (
        <div className="card p-6">
          <p className="text-gray-500 dark:text-gray-400">
            No history data available for {selectedSymbol}.
          </p>
        </div>
      )}
    </div>
  )
}
