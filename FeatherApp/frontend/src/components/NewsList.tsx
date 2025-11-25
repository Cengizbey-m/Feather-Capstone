import { ExternalLink, Clock } from 'lucide-react'
import { SentimentBadge } from './SentimentBadge'
import type { NewsItem } from '@/types'

interface NewsListProps {
  items: NewsItem[]
  isLoading?: boolean
  emptyMessage?: string
}

export const NewsList = ({ items, isLoading, emptyMessage = 'No news available' }: NewsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">{emptyMessage}</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white leading-tight">
              {item.headline}
            </h3>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </div>
            
            <SentimentBadge sentiment={item.sentiment} score={item.sentimentScore} />
          </div>
        </article>
      ))}
    </div>
  )
}
