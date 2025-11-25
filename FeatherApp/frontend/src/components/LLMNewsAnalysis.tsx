import { useState } from 'react'
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Zap, Target, BarChart3 } from 'lucide-react'

interface LLMAnalysis {
  id: string
  newsId: string
  headline: string
  summary: string
  keyPoints: string[]
  sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timeframe: 'short' | 'medium' | 'long'
  affectedSectors: string[]
  relatedStocks: string[]
  priceTargets: {
    symbol: string
    currentPrice: number
    targetPrice: number
    upside: number
    timeframe: string
  }[]
  riskFactors: string[]
  opportunities: string[]
  recommendations: {
    action: 'buy' | 'sell' | 'hold' | 'watch'
    reasoning: string
    confidence: number
  }[]
  marketContext: string
  createdAt: string
}

export const LLMNewsAnalysis = ({ newsId }: { newsId?: string }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null)
  const [filterBy, setFilterBy] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all')

  // Mock LLM analysis data
  const llmAnalyses: LLMAnalysis[] = [
    {
      id: '1',
      newsId: 'news-1',
      headline: 'Fed Signals Potential Rate Cuts Amid Economic Uncertainty',
      summary: 'The Federal Reserve hints at possible interest rate reductions to stimulate economic growth, signaling a dovish monetary policy shift.',
      keyPoints: [
        'Fed officials express concerns about economic growth',
        'Potential 0.25-0.50% rate cut in next quarter',
        'Dovish stance could boost equity markets',
        'Bond yields expected to decline further'
      ],
      sentiment: 'bullish',
      confidence: 85,
      impact: 'high',
      timeframe: 'short',
      affectedSectors: ['Financials', 'Technology', 'Real Estate'],
      relatedStocks: ['JPM', 'BAC', 'AAPL', 'MSFT', 'AMZN'],
      priceTargets: [
        { symbol: 'JPM', currentPrice: 145.50, targetPrice: 165.00, upside: 13.4, timeframe: '3 months' },
        { symbol: 'AAPL', currentPrice: 175.25, targetPrice: 195.00, upside: 11.3, timeframe: '6 months' }
      ],
      riskFactors: [
        'Inflation remains elevated',
        'Geopolitical tensions persist',
        'Labor market tightness continues'
      ],
      opportunities: [
        'Growth stocks may outperform',
        'Real estate sector benefits from lower rates',
        'Bond prices likely to appreciate'
      ],
      recommendations: [
        { action: 'buy', reasoning: 'Rate cuts typically boost equity valuations', confidence: 80 },
        { action: 'watch', reasoning: 'Monitor inflation data for confirmation', confidence: 70 }
      ],
      marketContext: 'Current market volatility creates opportunities for strategic positioning ahead of potential policy changes.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      newsId: 'news-2',
      headline: 'Tech Earnings Disappoint, AI Hype Faces Reality Check',
      summary: 'Major technology companies report weaker-than-expected earnings, raising questions about AI investment returns and market valuations.',
      keyPoints: [
        'Tech sector revenue growth slows significantly',
        'AI investments show limited immediate returns',
        'Valuation concerns mount for growth stocks',
        'Defensive sectors gaining investor attention'
      ],
      sentiment: 'bearish',
      confidence: 78,
      impact: 'high',
      timeframe: 'medium',
      affectedSectors: ['Technology', 'Communication Services'],
      relatedStocks: ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA'],
      priceTargets: [
        { symbol: 'NVDA', currentPrice: 425.30, targetPrice: 380.00, upside: -10.7, timeframe: '3 months' },
        { symbol: 'META', currentPrice: 285.75, targetPrice: 250.00, upside: -12.5, timeframe: '6 months' }
      ],
      riskFactors: [
        'AI bubble concerns intensify',
        'Regulatory scrutiny increases',
        'Competition in AI space heats up'
      ],
      opportunities: [
        'Value stocks may outperform growth',
        'Dividend-paying stocks gain appeal',
        'Defensive sectors attract capital'
      ],
      recommendations: [
        { action: 'sell', reasoning: 'Tech valuations appear stretched', confidence: 75 },
        { action: 'hold', reasoning: 'Wait for better entry points', confidence: 65 }
      ],
      marketContext: 'Market rotation from growth to value continues as investors reassess AI investment thesis.',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      newsId: 'news-3',
      headline: 'Energy Sector Shows Resilience Amid Global Supply Concerns',
      summary: 'Oil and gas companies demonstrate strong operational performance despite geopolitical tensions and supply chain disruptions.',
      keyPoints: [
        'Energy sector earnings beat expectations',
        'Oil prices stabilize above $80/barrel',
        'Renewable energy investments accelerate',
        'Energy transition creates new opportunities'
      ],
      sentiment: 'bullish',
      confidence: 72,
      impact: 'medium',
      timeframe: 'long',
      affectedSectors: ['Energy', 'Utilities', 'Materials'],
      relatedStocks: ['XOM', 'CVX', 'COP', 'EOG', 'NEE'],
      priceTargets: [
        { symbol: 'XOM', currentPrice: 95.40, targetPrice: 110.00, upside: 15.3, timeframe: '12 months' },
        { symbol: 'NEE', currentPrice: 78.25, targetPrice: 90.00, upside: 15.0, timeframe: '18 months' }
      ],
      riskFactors: [
        'Geopolitical tensions could disrupt supply',
        'Renewable energy transition accelerates',
        'Economic slowdown reduces demand'
      ],
      opportunities: [
        'Traditional energy companies adapt to transition',
        'Renewable energy infrastructure investments',
        'Energy storage and grid modernization'
      ],
      recommendations: [
        { action: 'buy', reasoning: 'Energy sector undervalued relative to fundamentals', confidence: 70 },
        { action: 'watch', reasoning: 'Monitor energy transition trends', confidence: 65 }
      ],
      marketContext: 'Energy sector benefits from both traditional fossil fuel strength and renewable energy transition investments.',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ]

  const filteredAnalyses = llmAnalyses.filter(analysis => {
    if (filterBy === 'all') return true
    return analysis.sentiment === filterBy
  })

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <BarChart3 className="h-5 w-5 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'bearish':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'sell':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      case 'hold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'watch':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
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
            <span>LLM News Analysis</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered analysis of market news and sentiment
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="input"
          >
            <option value="all">All Sentiment</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="space-y-4">
        {filteredAnalyses.map((analysis) => (
          <div key={analysis.id} className="card p-6">
            {/* Analysis Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getSentimentIcon(analysis.sentiment)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {analysis.headline}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {analysis.summary}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(analysis.sentiment)}`}>
                    {analysis.sentiment.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(analysis.impact)}`}>
                    {analysis.impact.toUpperCase()} IMPACT
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {analysis.confidence}% confidence
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(analysis.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Points:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {analysis.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Price Targets */}
            {analysis.priceTargets.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price Targets:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.priceTargets.map((target, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{target.symbol}</span>
                        <span className={`text-sm font-medium ${target.upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {target.upside >= 0 ? '+' : ''}{target.upside.toFixed(1)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ${target.currentPrice.toFixed(2)} → ${target.targetPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {target.timeframe}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recommendations:</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionColor(rec.action)}`}>
                        {rec.action.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{rec.reasoning}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {rec.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Context */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Market Context:</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">{analysis.marketContext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* LLM Summary */}
      <div className="card p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            LLM Analysis Summary
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {llmAnalyses.filter(a => a.sentiment === 'bullish').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Bullish Analyses
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {llmAnalyses.filter(a => a.sentiment === 'bearish').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Bearish Analyses
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {Math.round(llmAnalyses.reduce((sum, a) => sum + a.confidence, 0) / llmAnalyses.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Confidence
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
