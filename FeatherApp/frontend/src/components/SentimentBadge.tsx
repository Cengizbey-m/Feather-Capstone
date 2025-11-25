import type { NewsItem } from '@/types'

interface SentimentBadgeProps {
  sentiment: NewsItem['sentiment']
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export const SentimentBadge = ({ sentiment, score, size = 'md' }: SentimentBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const sentimentConfig = {
    Positive: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-800 dark:text-green-200',
      icon: '😊',
    },
    Negative: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-800 dark:text-red-200',
      icon: '😞',
    },
    Neutral: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-800 dark:text-gray-200',
      icon: '😐',
    },
  }

  const config = sentimentConfig[sentiment]

  return (
    <div className={`inline-flex items-center rounded-full ${sizeClasses[size]} ${config.bg} ${config.text}`}>
      <span className="mr-1">{config.icon}</span>
      <span className="font-medium">{sentiment}</span>
      <span className="ml-1 opacity-75">({Math.round(score * 100)}%)</span>
    </div>
  )
}
