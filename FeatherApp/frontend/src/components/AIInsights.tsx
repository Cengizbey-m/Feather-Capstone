import { useState, useEffect } from 'react'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap, Star } from 'lucide-react'

interface AIInsight {
  id: string
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timeframe: 'short' | 'medium' | 'long'
  actionable: boolean
  relatedSymbols: string[]
  createdAt: Date
}

export const AIInsights = ({ symbol }: { symbol?: string }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M'>('1W')
  const [filterType, setFilterType] = useState<'all' | 'opportunity' | 'risk' | 'trend' | 'recommendation'>('all')

  // Mock AI insights data
  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'Strong Buy Signal Detected',
      description: 'Technical analysis shows a bullish pattern forming with 85% confidence. RSI indicates oversold conditions with potential for significant upside.',
      confidence: 85,
      impact: 'high',
      timeframe: 'short',
      actionable: true,
      relatedSymbols: ['AAPL', 'GOOGL'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'risk',
      title: 'Market Volatility Warning',
      description: 'High volatility detected in tech sector. Consider reducing position sizes or implementing stop-loss orders to protect capital.',
      confidence: 78,
      impact: 'high',
      timeframe: 'short',
      actionable: true,
      relatedSymbols: ['TSLA', 'NVDA', 'META'],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'trend',
      title: 'Sector Rotation Emerging',
      description: 'Money flow analysis indicates rotation from growth to value stocks. Healthcare and utilities showing increased institutional interest.',
      confidence: 72,
      impact: 'medium',
      timeframe: 'medium',
      actionable: true,
      relatedSymbols: ['JNJ', 'PG', 'KO'],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Portfolio Rebalancing Suggested',
      description: 'Current portfolio allocation shows 40% tech exposure. AI recommends reducing to 30% and increasing diversification across sectors.',
      confidence: 88,
      impact: 'medium',
      timeframe: 'long',
      actionable: true,
      relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: '5',
      type: 'opportunity',
      title: 'Earnings Surprise Potential',
      description: 'Sentiment analysis of recent news and social media indicates potential positive earnings surprise for upcoming quarterly results.',
      confidence: 65,
      impact: 'medium',
      timeframe: 'short',
      actionable: true,
      relatedSymbols: ['TSLA'],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  ]

  const filteredInsights = insights.filter(insight => {
    if (filterType !== 'all' && insight.type !== filterType) return false
    if (symbol && !insight.relatedSymbols.includes(symbol)) return false
    return true
  })

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'trend':
        return <Target className="h-5 w-5 text-blue-500" />
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
    }
  }

  const getInsightBg = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
      case 'risk':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
      case 'trend':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      case 'recommendation':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
    }
  }

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
  }

  const getTimeframeColor = (timeframe: AIInsight['timeframe']) => {
    switch (timeframe) {
      case 'short':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'long':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>AI Insights</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {symbol ? `AI-powered insights for ${symbol}` : 'AI-powered market insights and recommendations'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="input"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Filter by type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="input"
          >
            <option value="all">All Insights</option>
            <option value="opportunity">Opportunities</option>
            <option value="risk">Risks</option>
            <option value="trend">Trends</option>
            <option value="recommendation">Recommendations</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredInsights.length} insights found
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="card p-8 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No insights available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {symbol ? `No AI insights found for ${symbol}` : 'No AI insights available at the moment'}
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className={`card p-6 border-l-4 ${getInsightBg(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(insight.createdAt)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(insight.timeframe)}`}>
                    {insight.timeframe} term
                  </span>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {insight.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Related symbols:</span>
                    <div className="flex space-x-1">
                      {insight.relatedSymbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {insight.actionable && (
                    <button className="btn-primary text-sm">
                      Take Action
                    </button>
                  )}
                  <button className="btn-outline text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Summary */}
      <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {insights.filter(i => i.type === 'opportunity').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Opportunities
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {insights.filter(i => i.type === 'risk').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Risks Identified
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {insights.filter(i => i.actionable).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Actionable Insights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
