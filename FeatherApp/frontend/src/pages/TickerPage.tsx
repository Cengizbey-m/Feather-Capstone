import { useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePrediction } from '@/hooks/usePredictions'
import { useSymbolNews } from '@/hooks/useNews'
import { PredictionCard } from '@/components/PredictionCard'
import { NewsList } from '@/components/NewsList'
import { useWatchlist } from '@/hooks/useWatchlist'
import { Plus, Check } from 'lucide-react'
import { PriceChart } from '@/components/PriceChart'
import { SentimentAnalyzer } from '@/components/SentimentAnalyzer'

export const TickerPage = () => {
  const { symbol } = useParams<{ symbol: string }>()
  const { data: prediction, isLoading: predictionLoading } = usePrediction(symbol || '')
  const { data: news, isLoading: newsLoading } = useSymbolNews(symbol || '', 20)
  const { items: watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

  if (!symbol) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No Symbol Selected
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please select a ticker symbol to view its details.
        </p>
        <Link to="/" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const isInWatchlist = watchlist.includes(symbol.toUpperCase())
  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(symbol)
    } else {
      addToWatchlist({ symbol: symbol.toUpperCase() })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {symbol.toUpperCase()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Market insights and predictions
            </p>
          </div>
        </div>
        
        <button
          onClick={handleWatchlistToggle}
          className={`btn flex items-center space-x-2 ${
            isInWatchlist
              ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
              : 'btn-outline'
          }`}
        >
          {isInWatchlist ? (
            <Check className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
        </button>
      </div>

      {/* Price Chart */}
      <div>
        <PriceChart 
          symbol={symbol}
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

      {/* Prediction Card */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Prediction Analysis
        </h2>
        {prediction && <PredictionCard data={prediction} isLoading={predictionLoading} />}
      </div>

      {/* Sentiment Analysis */}
      <div>
        <SentimentAnalyzer symbol={symbol} />
      </div>

      {/* News Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Latest News for {symbol.toUpperCase()}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {news?.items.length || 0} articles
          </div>
        </div>
        <NewsList
          items={news?.items || []}
          isLoading={newsLoading}
          emptyMessage={`No recent news found for ${symbol.toUpperCase()}`}
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            About This Symbol
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <p>
              This prediction is generated using our SVR/RF ensemble model with 
              sentiment analysis from recent news and market data.
            </p>
            <p>
              The confidence score indicates how reliable we believe this prediction to be 
              based on historical accuracy and current market conditions.
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Model Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Model Type:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {prediction?.model.type || 'SVR/RF Ensemble'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {prediction?.model.version || '0.0.1-mock'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {prediction ? new Date(prediction.asOf).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
