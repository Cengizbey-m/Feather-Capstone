import { useState } from 'react'
import { TrendingUp, TrendingDown, Activity, Plus, BarChart3, PieChart, Zap } from 'lucide-react'
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

export const DashboardPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const { data: prediction, isLoading: predictionLoading } = usePrediction(selectedSymbol)
  const { data: news, isLoading: newsLoading } = useGlobalNews(10)

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol)
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

      {/* Quick Search */}
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

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
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
            <div className="flex-shrink-0">
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
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
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
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

      {/* Watchlist */}
      <div>
        <WatchlistTable />
      </div>

      {/* Portfolio Summary */}
      <div>
        <PortfolioSummary />
      </div>

      {/* Price Chart for Selected Symbol */}
      {selectedSymbol && (
        <div>
          <PriceChart 
            symbol={selectedSymbol}
            data={{
              price: 150.25,
              change: 2.45,
              changePercent: 1.66,
              volume: 45234567,
              high: 152.30,
              low: 148.90
            }}
          />
        </div>
      )}

      {/* Sentiment Analysis */}
      <div>
        <SentimentAnalyzer symbol={selectedSymbol} />
      </div>

      {/* Interactive Chart */}
      {selectedSymbol && (
        <div>
          <InteractiveChart 
            symbol={selectedSymbol}
            type="line"
            showIndicators={true}
            showCrosshair={true}
          />
        </div>
      )}

      {/* Fear & Greed Index */}
      <div>
        <FearGreedIndex />
      </div>

      {/* Analytics Dashboard */}
      <div>
        <AnalyticsDashboard />
      </div>

      {/* AI Insights */}
      <div>
        <AIInsights symbol={selectedSymbol} />
      </div>

      {/* Market Overview */}
      <div>
        <MarketOverview />
      </div>

      {/* Portfolio Tracker */}
      <div>
        <PortfolioTracker />
      </div>

      {/* AI Recommendations */}
      <div>
        <AIRecommendations />
      </div>

      {/* Social Feed */}
      <div>
        <SocialFeed />
      </div>

      {/* Latest News */}
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
