import { useState } from 'react'
import { Search, Filter, TrendingUp, TrendingDown, Clock, Star, Bookmark, Share2, ExternalLink } from 'lucide-react'
import { ProfessionalNewsCard } from '@/components/ProfessionalNewsCard'
import { FearGreedIndex } from '@/components/FearGreedIndex'
import { LLMNewsAnalysis } from '@/components/LLMNewsAnalysis'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
  source: string
  url: string
  imageUrl: string
  category: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  relatedSymbols: string[]
  readTime: number
  isBookmarked: boolean
  isFeatured: boolean
}

export const ProfessionalNewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')
  const [showLLMAnalysis, setShowLLMAnalysis] = useState(false)

  // Mock news data with professional layout
  const newsData: NewsItem[] = [
    {
      id: '1',
      title: 'Fed Signals Potential Rate Cuts Amid Economic Uncertainty',
      summary: 'The Federal Reserve hints at possible interest rate reductions to stimulate economic growth, signaling a dovish monetary policy shift that could impact markets significantly.',
      content: 'Full article content about Fed rate cuts...',
      author: 'Sarah Johnson',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      source: 'Reuters',
      url: 'https://example.com/news/1',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      category: 'Monetary Policy',
      sentiment: 'positive',
      sentimentScore: 0.7,
      relatedSymbols: ['JPM', 'BAC', 'WFC', 'GS'],
      readTime: 5,
      isBookmarked: false,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Tech Earnings Disappoint, AI Hype Faces Reality Check',
      summary: 'Major technology companies report weaker-than-expected earnings, raising questions about AI investment returns and market valuations in the sector.',
      content: 'Full article content about tech earnings...',
      author: 'Michael Chen',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      source: 'Bloomberg',
      url: 'https://example.com/news/2',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      category: 'Technology',
      sentiment: 'negative',
      sentimentScore: -0.6,
      relatedSymbols: ['AAPL', 'GOOGL', 'MSFT', 'META', 'NVDA'],
      readTime: 7,
      isBookmarked: true,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Energy Sector Shows Resilience Amid Global Supply Concerns',
      summary: 'Oil and gas companies demonstrate strong operational performance despite geopolitical tensions and supply chain disruptions.',
      content: 'Full article content about energy sector...',
      author: 'David Rodriguez',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      source: 'Wall Street Journal',
      url: 'https://example.com/news/3',
      imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=400&fit=crop',
      category: 'Energy',
      sentiment: 'positive',
      sentimentScore: 0.8,
      relatedSymbols: ['XOM', 'CVX', 'COP', 'EOG'],
      readTime: 6,
      isBookmarked: false,
      isFeatured: false
    },
    {
      id: '4',
      title: 'Healthcare Stocks Rally on Drug Approval News',
      summary: 'Pharmaceutical companies see significant gains following FDA approval of new treatments, boosting sector confidence.',
      content: 'Full article content about healthcare stocks...',
      author: 'Lisa Wang',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      source: 'CNBC',
      url: 'https://example.com/news/4',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      category: 'Healthcare',
      sentiment: 'positive',
      sentimentScore: 0.9,
      relatedSymbols: ['JNJ', 'PFE', 'MRK', 'ABBV'],
      readTime: 4,
      isBookmarked: false,
      isFeatured: false
    },
    {
      id: '5',
      title: 'Market Volatility Reaches 3-Month High as Uncertainty Grows',
      summary: 'Trading volumes spike as investors grapple with mixed economic signals and geopolitical tensions.',
      content: 'Full article content about market volatility...',
      author: 'Robert Kim',
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      source: 'Financial Times',
      url: 'https://example.com/news/5',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      category: 'Market Analysis',
      sentiment: 'negative',
      sentimentScore: -0.4,
      relatedSymbols: ['SPY', 'QQQ', 'IWM', 'VIX'],
      readTime: 8,
      isBookmarked: true,
      isFeatured: false
    }
  ]

  const categories = ['all', 'Monetary Policy', 'Technology', 'Energy', 'Healthcare', 'Market Analysis']
  const sentiments = ['all', 'positive', 'negative', 'neutral']

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory
    const matchesSentiment = selectedSentiment === 'all' || news.sentiment === selectedSentiment
    return matchesSearch && matchesCategory && matchesSentiment
  })

  const featuredNews = filteredNews.filter(news => news.isFeatured)
  const regularNews = filteredNews.filter(news => !news.isFeatured)

  const handleBookmark = (id: string) => {
    console.log(`Bookmarked news ${id}`)
  }

  const handleShare = (id: string) => {
    console.log(`Shared news ${id}`)
  }

  const handleNewsClick = (news: NewsItem) => {
    console.log(`Clicked news: ${news.title}`)
    // In a real app, this would navigate to the full article page
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market News & Analysis
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay informed with the latest market news, analysis, and AI-powered insights
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search news, companies, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="input"
            >
              {sentiments.map(sentiment => (
                <option key={sentiment} value={sentiment}>
                  {sentiment === 'all' ? 'All Sentiment' : sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowLLMAnalysis(!showLLMAnalysis)}
              className={`btn ${showLLMAnalysis ? 'btn-primary' : 'btn-outline'}`}
            >
              {showLLMAnalysis ? 'Hide AI Analysis' : 'Show AI Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FearGreedIndex />
        </div>
        <div className="space-y-4">
          {/* Market Overview */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Market Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">S&P 500</span>
                <span className="text-sm font-medium text-green-600">4,521.54 (+1.2%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">NASDAQ</span>
                <span className="text-sm font-medium text-green-600">14,098.01 (+1.5%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">DOW</span>
                <span className="text-sm font-medium text-green-600">35,225.16 (+1.1%)</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {['#FedRates', '#TechEarnings', '#EnergySector', '#Healthcare', '#MarketVolatility'].map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{topic}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(Math.random() * 1000) + 100} mentions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Featured News</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNews.map((news) => (
              <ProfessionalNewsCard
                key={news.id}
                news={news}
                variant="featured"
                onBookmark={handleBookmark}
                onShare={handleShare}
                onClick={handleNewsClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest News</h2>
        <div className="space-y-4">
          {regularNews.map((news) => (
            <ProfessionalNewsCard
              key={news.id}
              news={news}
              variant="standard"
              onBookmark={handleBookmark}
              onShare={handleShare}
              onClick={handleNewsClick}
            />
          ))}
        </div>
      </div>

      {/* LLM Analysis */}
      {showLLMAnalysis && (
        <div>
          <LLMNewsAnalysis />
        </div>
      )}

      {/* Load More */}
      <div className="text-center">
        <button className="btn-outline">
          Load More News
        </button>
      </div>
    </div>
  )
}
