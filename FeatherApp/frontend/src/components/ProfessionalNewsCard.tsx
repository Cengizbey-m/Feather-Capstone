import { useState } from 'react'
import { Clock, ExternalLink, TrendingUp, TrendingDown, Star, Bookmark, Share2 } from 'lucide-react'

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

interface ProfessionalNewsCardProps {
  news: NewsItem
  variant?: 'featured' | 'standard' | 'compact'
  onBookmark?: (id: string) => void
  onShare?: (id: string) => void
  onClick?: (news: NewsItem) => void
}

export const ProfessionalNewsCard = ({
  news,
  variant = 'standard',
  onBookmark,
  onShare,
  onClick
}: ProfessionalNewsCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'negative':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />
      case 'negative':
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Star className="h-3 w-3" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  if (variant === 'featured') {
    return (
      <div 
        className="card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onClick?.(news)}
      >
        <div className="relative">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
              {news.category}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onBookmark?.(news.id)
              }}
              className={`p-2 rounded-full transition-colors ${
                news.isBookmarked 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${news.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{news.source}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{news.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(news.publishedAt)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {news.readTime} min read
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {news.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                {getSentimentIcon(news.sentiment)}
                <span className="ml-1 capitalize">{news.sentiment}</span>
              </div>
              {news.relatedSymbols.length > 0 && (
                <div className="flex space-x-1">
                  {news.relatedSymbols.slice(0, 3).map((symbol) => (
                    <span
                      key={symbol}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {symbol}
                    </span>
                  ))}
                  {news.relatedSymbols.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{news.relatedSymbols.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onShare?.(news.id)
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(news.url, '_blank')
                }}
                className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div 
        className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
        onClick={() => onClick?.(news)}
      >
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{news.source}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(news.publishedAt)}</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {news.title}
          </h4>
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
              {getSentimentIcon(news.sentiment)}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{news.readTime} min read</span>
          </div>
        </div>
      </div>
    )
  }

  // Standard variant
  return (
    <div 
      className="card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(news)}
    >
      <div className="flex">
        <div className="w-48 h-32 flex-shrink-0">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{news.source}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{news.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(news.publishedAt)}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onBookmark?.(news.id)
                }}
                className={`p-1 rounded transition-colors ${
                  news.isBookmarked 
                    ? 'text-yellow-500' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${news.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {news.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                {getSentimentIcon(news.sentiment)}
                <span className="ml-1 capitalize">{news.sentiment}</span>
              </div>
              {news.relatedSymbols.length > 0 && (
                <div className="flex space-x-1">
                  {news.relatedSymbols.slice(0, 2).map((symbol) => (
                    <span
                      key={symbol}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {symbol}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{news.readTime} min read</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onShare?.(news.id)
                }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
