import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, BarChart3, Zap } from 'lucide-react'

interface SentimentAnalyzerProps {
  symbol?: string
  isLoading?: boolean
}

export const SentimentAnalyzer = ({ symbol, isLoading }: SentimentAnalyzerProps) => {
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D' | '1W'>('1D')
  
  // Mock sentiment data
  const sentimentData = {
    overall: {
      score: 0.65,
      trend: 'positive',
      confidence: 0.78,
      change: 0.12
    },
    sources: [
      { name: 'Reuters', score: 0.72, weight: 0.25, articles: 15 },
      { name: 'Bloomberg', score: 0.58, weight: 0.20, articles: 12 },
      { name: 'CNBC', score: 0.68, weight: 0.18, articles: 8 },
      { name: 'MarketWatch', score: 0.61, weight: 0.15, articles: 6 },
      { name: 'Yahoo Finance', score: 0.70, weight: 0.22, articles: 10 }
    ],
    keywords: [
      { word: 'bullish', count: 23, sentiment: 0.8 },
      { word: 'growth', count: 18, sentiment: 0.7 },
      { word: 'earnings', count: 15, sentiment: 0.6 },
      { word: 'volatility', count: 12, sentiment: -0.3 },
      { word: 'uncertainty', count: 8, sentiment: -0.5 }
    ],
    timeline: [
      { time: '09:00', score: 0.45, volume: 12 },
      { time: '10:00', score: 0.52, volume: 18 },
      { time: '11:00', score: 0.58, volume: 22 },
      { time: '12:00', score: 0.61, volume: 15 },
      { time: '13:00', score: 0.65, volume: 28 },
      { time: '14:00', score: 0.68, volume: 25 },
      { time: '15:00', score: 0.70, volume: 30 },
      { time: '16:00', score: 0.65, volume: 20 }
    ]
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return 'text-green-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSentimentBg = (score: number) => {
    if (score >= 0.6) return 'bg-green-100 dark:bg-green-900'
    if (score >= 0.4) return 'bg-yellow-100 dark:bg-yellow-900'
    return 'bg-red-100 dark:bg-red-900'
  }

  const getSentimentText = (score: number) => {
    if (score >= 0.7) return 'Very Positive'
    if (score >= 0.6) return 'Positive'
    if (score >= 0.4) return 'Neutral'
    if (score >= 0.3) return 'Negative'
    return 'Very Negative'
  }

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {symbol ? `${symbol} ` : ''}Sentiment Analysis
          </h3>
          <div className="flex space-x-2">
            {(['1H', '4H', '1D', '1W'] as const).map((period) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sentiment Score */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getSentimentBg(sentimentData.overall.score)} mb-4`}>
              <span className={`text-2xl font-bold ${getSentimentColor(sentimentData.overall.score)}`}>
                {(sentimentData.overall.score * 100).toFixed(0)}
              </span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {getSentimentText(sentimentData.overall.score)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Confidence: {(sentimentData.overall.confidence * 100).toFixed(0)}%
            </div>
          </div>

          {/* Trend */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {sentimentData.overall.trend === 'positive' ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {sentimentData.overall.trend === 'positive' ? 'Improving' : 'Declining'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {sentimentData.overall.change > 0 ? '+' : ''}{(sentimentData.overall.change * 100).toFixed(1)}% change
            </div>
          </div>

          {/* Activity */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              High Activity
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              51 articles analyzed
            </div>
          </div>
        </div>
      </div>

      {/* Source Breakdown */}
      <div className="card p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Source Analysis
        </h4>
        <div className="space-y-3">
          {sentimentData.sources.map((source) => (
            <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-900 dark:text-primary-100">
                    {source.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {source.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {source.articles} articles
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getSentimentColor(source.score)}`}>
                  {(source.score * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Weight: {(source.weight * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="card p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Terms
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {sentimentData.keywords.map((keyword) => (
            <div key={keyword.word} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {keyword.word}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({keyword.count})
                </span>
              </div>
              <div className={`text-sm font-semibold ${getSentimentColor(keyword.sentiment)}`}>
                {keyword.sentiment > 0 ? '+' : ''}{(keyword.sentiment * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sentiment Timeline
          </h4>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          {sentimentData.timeline.map((point, index) => (
            <div key={point.time} className="flex items-center space-x-3">
              <div className="w-12 text-sm text-gray-500 dark:text-gray-400">
                {point.time}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    point.score >= 0.6 ? 'bg-green-500' : 
                    point.score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${point.score * 100}%` }}
                />
              </div>
              <div className="w-16 text-sm text-gray-500 dark:text-gray-400 text-right">
                {(point.score * 100).toFixed(0)}%
              </div>
              <div className="w-8 text-sm text-gray-500 dark:text-gray-400 text-right">
                {point.volume}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
