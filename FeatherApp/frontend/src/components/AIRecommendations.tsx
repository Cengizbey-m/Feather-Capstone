import { useState } from 'react'
import { Brain, TrendingUp, TrendingDown, Target, Star, AlertTriangle, Lightbulb, Zap, BarChart3, DollarSign } from 'lucide-react'

interface AIRecommendation {
  id: string
  symbol: string
  name: string
  currentPrice: number
  targetPrice: number
  upside: number
  confidence: number
  timeframe: string
  reasoning: string
  riskLevel: 'low' | 'medium' | 'high'
  sector: string
  marketCap: number
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'
  keyFactors: string[]
  risks: string[]
  opportunities: string[]
  technicalScore: number
  fundamentalScore: number
  sentimentScore: number
  createdAt: string
}

interface AIRecommendationsData {
  recommendations: AIRecommendation[]
  summary: {
    totalRecommendations: number
    strongBuy: number
    buy: number
    hold: number
    sell: number
    strongSell: number
    averageConfidence: number
    averageUpside: number
  }
  marketInsights: {
    overallSentiment: 'bullish' | 'bearish' | 'neutral'
    keyThemes: string[]
    sectorRotation: string[]
    riskFactors: string[]
  }
}

export const AIRecommendations = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell'>('all')
  const [selectedSector, setSelectedSector] = useState<'all' | 'Technology' | 'Healthcare' | 'Financials' | 'Energy' | 'Consumer Discretionary'>('all')
  const [sortBy, setSortBy] = useState<'confidence' | 'upside' | 'symbol' | 'created'>('confidence')

  // Mock AI recommendations data
  const aiData: AIRecommendationsData = {
    recommendations: [
      {
        id: '1',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        currentPrice: 425.30,
        targetPrice: 500.00,
        upside: 17.57,
        confidence: 92,
        timeframe: '6 months',
        reasoning: 'Strong AI demand, data center growth, and gaming recovery driving revenue acceleration',
        riskLevel: 'medium',
        sector: 'Technology',
        marketCap: 1050000000000,
        recommendation: 'strong_buy',
        keyFactors: [
          'AI data center revenue growing 200%+ YoY',
          'Gaming segment recovery with RTX 40 series',
          'Automotive AI partnerships expanding',
          'Strong competitive moat in GPU technology'
        ],
        risks: [
          'High valuation multiples',
          'Competition from AMD and Intel',
          'Geopolitical tensions affecting China sales',
          'Regulatory scrutiny on AI applications'
        ],
        opportunities: [
          'Enterprise AI adoption accelerating',
          'Autonomous vehicle market expansion',
          'Metaverse and VR/AR applications',
          'Edge computing and IoT growth'
        ],
        technicalScore: 85,
        fundamentalScore: 90,
        sentimentScore: 88,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        symbol: 'AAPL',
        name: 'Apple Inc',
        currentPrice: 175.25,
        targetPrice: 195.00,
        upside: 11.26,
        confidence: 78,
        timeframe: '12 months',
        reasoning: 'Services revenue growth, iPhone 15 success, and potential AI integration driving long-term value',
        riskLevel: 'low',
        sector: 'Technology',
        marketCap: 2800000000000,
        recommendation: 'buy',
        keyFactors: [
          'Services revenue growing 15%+ annually',
          'iPhone 15 Pro Max demand exceeding expectations',
          'Apple Vision Pro early adoption positive',
          'Strong ecosystem lock-in effect'
        ],
        risks: [
          'China market exposure and regulatory risks',
          'Intense competition in smartphone market',
          'Supply chain vulnerabilities',
          'Regulatory scrutiny on App Store practices'
        ],
        opportunities: [
          'AI integration across product portfolio',
          'Healthcare and fitness market expansion',
          'Enterprise and education market growth',
          'Emerging markets penetration'
        ],
        technicalScore: 75,
        fundamentalScore: 85,
        sentimentScore: 80,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        symbol: 'TSLA',
        name: 'Tesla Inc',
        currentPrice: 285.75,
        targetPrice: 350.00,
        upside: 22.50,
        confidence: 65,
        timeframe: '18 months',
        reasoning: 'EV market leadership, energy storage growth, and potential FSD breakthrough driving valuation',
        riskLevel: 'high',
        sector: 'Consumer Discretionary',
        marketCap: 900000000000,
        recommendation: 'buy',
        keyFactors: [
          'EV market share leadership maintained',
          'Energy storage business growing rapidly',
          'Full Self-Driving potential breakthrough',
          'Supercharger network competitive advantage'
        ],
        risks: [
          'High valuation and execution risks',
          'Competition from traditional automakers',
          'Regulatory challenges for autonomous driving',
          'Elon Musk\'s public statements affecting stock'
        ],
        opportunities: [
          'Robotaxi network potential',
          'Energy storage market expansion',
          'International market growth',
          'Manufacturing efficiency improvements'
        ],
        technicalScore: 70,
        fundamentalScore: 60,
        sentimentScore: 65,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co',
        currentPrice: 145.50,
        targetPrice: 165.00,
        upside: 13.40,
        confidence: 82,
        timeframe: '12 months',
        reasoning: 'Interest rate environment favorable, strong capital position, and digital transformation driving growth',
        riskLevel: 'low',
        sector: 'Financials',
        marketCap: 425000000000,
        recommendation: 'buy',
        keyFactors: [
          'Net interest margin expansion',
          'Strong capital ratios and dividend yield',
          'Digital banking transformation',
          'Investment banking market share gains'
        ],
        risks: [
          'Credit quality deterioration',
          'Regulatory compliance costs',
          'Competition from fintech',
          'Economic downturn impact'
        ],
        opportunities: [
          'Wealth management growth',
          'International expansion',
          'Fintech partnerships',
          'ESG investing demand'
        ],
        technicalScore: 80,
        fundamentalScore: 85,
        sentimentScore: 75,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        symbol: 'META',
        name: 'Meta Platforms Inc',
        currentPrice: 185.25,
        targetPrice: 150.00,
        upside: -19.03,
        confidence: 70,
        timeframe: '6 months',
        reasoning: 'Reality Labs losses, regulatory headwinds, and competition from TikTok affecting growth prospects',
        riskLevel: 'high',
        sector: 'Technology',
        marketCap: 500000000000,
        recommendation: 'sell',
        keyFactors: [
          'Reality Labs losing $10B+ annually',
          'Regulatory scrutiny on data practices',
          'TikTok competition intensifying',
          'Apple iOS privacy changes impact'
        ],
        risks: [
          'Metaverse investment not paying off',
          'Regulatory fines and restrictions',
          'User engagement declining',
          'Competition from emerging platforms'
        ],
        opportunities: [
          'AI integration across platforms',
          'Business messaging growth',
          'Virtual reality market maturation',
          'International market expansion'
        ],
        technicalScore: 60,
        fundamentalScore: 55,
        sentimentScore: 50,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      }
    ],
    summary: {
      totalRecommendations: 5,
      strongBuy: 1,
      buy: 3,
      hold: 0,
      sell: 1,
      strongSell: 0,
      averageConfidence: 77.4,
      averageUpside: 9.14
    },
    marketInsights: {
      overallSentiment: 'bullish',
      keyThemes: [
        'AI and machine learning adoption',
        'Energy transition and sustainability',
        'Digital transformation acceleration',
        'Healthcare innovation and aging population'
      ],
      sectorRotation: [
        'Technology leading with AI themes',
        'Healthcare benefiting from innovation',
        'Energy sector mixed with transition',
        'Financials supported by rate environment'
      ],
      riskFactors: [
        'Geopolitical tensions affecting global markets',
        'Inflation and interest rate uncertainty',
        'Regulatory scrutiny on big tech',
        'Supply chain disruptions continuing'
      ]
    }
  }

  const filteredRecommendations = aiData.recommendations.filter(rec => {
    const matchesFilter = selectedFilter === 'all' || rec.recommendation === selectedFilter
    const matchesSector = selectedSector === 'all' || rec.sector === selectedSector
    return matchesFilter && matchesSector
  })

  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    switch (sortBy) {
      case 'confidence':
        return b.confidence - a.confidence
      case 'upside':
        return b.upside - a.upside
      case 'symbol':
        return a.symbol.localeCompare(b.symbol)
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_buy':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'buy':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
      case 'hold':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'sell':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
      case 'strong_sell':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) return `${(marketCap / 1000000000000).toFixed(1)}T`
    if (marketCap >= 1000000000) return `${(marketCap / 1000000000).toFixed(1)}B`
    if (marketCap >= 1000000) return `${(marketCap / 1000000).toFixed(1)}M`
    return marketCap.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span>AI Investment Recommendations</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered investment analysis and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Recommendations</option>
            <option value="strong_buy">Strong Buy</option>
            <option value="buy">Buy</option>
            <option value="hold">Hold</option>
            <option value="sell">Sell</option>
            <option value="strong_sell">Strong Sell</option>
          </select>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as any)}
            className="input"
          >
            <option value="all">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financials">Financials</option>
            <option value="Energy">Energy</option>
            <option value="Consumer Discretionary">Consumer Discretionary</option>
          </select>
        </div>
      </div>

      {/* AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Recommendations</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {aiData.summary.totalRecommendations}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {aiData.summary.averageConfidence.toFixed(1)}% avg confidence
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Buy Recommendations</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {aiData.summary.strongBuy + aiData.summary.buy}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {aiData.summary.strongBuy} strong buy, {aiData.summary.buy} buy
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Average Upside</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPercent(aiData.summary.averageUpside)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Potential returns
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Market Sentiment</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize">
            {aiData.marketInsights.overallSentiment}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Overall outlook
          </div>
        </div>
      </div>

      {/* Market Insights - Simplified to 1-2 features */}
      {/* Commented out detailed insights - keeping only summary cards and recommendations list */}

      {/* Recommendations */}
      <div className="space-y-4">
        {sortedRecommendations.map((rec) => (
          <div key={rec.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {rec.symbol} - {rec.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(rec.recommendation)}`}>
                    {rec.recommendation.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.riskLevel)}`}>
                    {rec.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {rec.reasoning}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Price</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(rec.currentPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Target Price</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(rec.targetPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Upside</div>
                    <div className={`font-semibold ${rec.upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(rec.upside)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {rec.confidence}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified - removed detailed analysis sections */}
          </div>
        ))}
      </div>
    </div>
  )
}
