import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
} from 'lucide-react'

import { WatchlistTable } from '@/components/WatchlistTable'
import { TickerSearch } from '@/components/TickerSearch'
import { usePrediction } from '@/hooks/usePredictions'
import { useGlobalNews } from '@/hooks/useNews'
import { NewsList } from '@/components/NewsList'
import { PredictionCard } from '@/components/PredictionCard'
import { PriceChart } from '@/components/PriceChart'
import { PortfolioSummary } from '@/components/PortfolioSummary'
import { SentimentAnalyzer } from '@/components/SentimentAnalyzer'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { AIInsights } from '@/components/AIInsights'
import { SocialFeed } from '@/components/SocialFeed'
import { InteractiveChart } from '@/components/InteractiveChart'
import { FearGreedIndex } from '@/components/FearGreedIndex'
import { MarketOverview } from '@/components/MarketOverview'
import { PortfolioTracker } from '@/components/PortfolioTracker'
import { AIRecommendations } from '@/components/AIRecommendations'
import { usePriceHistory } from '@/hooks/useHistory'

export const DashboardPage = () => {
  // If nothing selected yet, treat SPY as the “home” symbol
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const currentSymbol = (selectedSymbol || 'SPY').toUpperCase()

  // Only fetch prediction when user has picked something (your old behaviour)
  const {
    data: prediction,
    isLoading: predictionLoading,
  } = usePrediction(selectedSymbol)

  const { data: news, isLoading: newsLoading } = useGlobalNews(10)

  // Real OHLCV history (used by PriceChart + InteractiveChart)
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = usePriceHistory(currentSymbol, 60)

  const candles = history?.items ?? []
  const hasHistory = candles.length > 0

  const last = hasHistory ? candles[candles.length - 1] : undefined
  const first = hasHistory ? candles[0] : undefined

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol.toUpperCase())
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market Insights Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get next-day predictions and market sentiment for your favorite stocks
        </p>
      </div>

      {/* Quick Search / Prediction */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Prediction Search
        </h2>
        <div className="max-w-md">
          <TickerSearch
            onSelect={handleSymbolSelect}
            placeholder="Search for a ticker symbol to get predictions..."
          />
        </div>
        {selectedSymbol && prediction && (
          <div className="mt-4">
            <PredictionCard data={prediction} isLoading={predictionLoading} />
          </div>
        )}
      </div>

      {/* Market Overview Cards (still mocked – fine for now) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bullish Predictions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                68%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <TrendingDown className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Bearish Predictions
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                32%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Avg Confidence
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                74%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist & Portfolio widgets (still mostly UI) */}
      <WatchlistTable />
      <PortfolioSummary />

      {/* REAL Price summary + mini chart */}
      {hasHistory && last && first && (
        <PriceChart
          symbol={currentSymbol}
          data={{
            price: last.close,
            change: last.close - first.close,
            changePercent: ((last.close - first.close) / first.close) * 100,
            volume: last.volume,
            high: Math.max(...candles.map((c) => c.high)),
            low: Math.min(...candles.map((c) => c.low)),
          }}
          isLoading={historyLoading}
        />
      )}

      {/* History loading / error states */}
      {historyLoading && (
        <div className="card p-4">Loading price history…</div>
      )}
      {historyError && (
        <div className="card p-4 text-red-600">
          Failed to load price history for {currentSymbol}.
        </div>
      )}

      {/* Full OHLCV Interactive chart */}
      {hasHistory && (
        <InteractiveChart
          symbol={currentSymbol}
          data={candles.map((candle) => ({
          // force to string + normalize
          time: new Date(candle.timestamp as any).toISOString(),
          price: candle.close,
          volume: candle.volume,
          high: candle.high,
          low: candle.low,
          open: candle.open,
          close: candle.close,
      }))}


          type="candlestick"
          height={400}
          showIndicators={true}
          showCrosshair={true}
        />
      )}

      {/* Sentiment / analytics / other widgets (still mostly UI) */}
      <SentimentAnalyzer symbol={currentSymbol} />
      <FearGreedIndex />
      <AnalyticsDashboard />
      <AIInsights symbol={currentSymbol} />
      <MarketOverview />
      <PortfolioTracker />
      <AIRecommendations />
      <SocialFeed />

      {/* Latest News (from backend) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Latest Market News
          </h2>
          <button className="btn-outline flex items-center space-x-2">
            <span>View All</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <NewsList items={news?.items || []} isLoading={newsLoading} />
      </div>
    </div>
  )
}
