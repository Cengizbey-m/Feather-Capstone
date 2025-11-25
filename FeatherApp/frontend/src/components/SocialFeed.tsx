import { useState } from 'react'
import { Heart, MessageCircle, Share, TrendingUp, TrendingDown, Star, MoreHorizontal, ThumbsUp, ThumbsDown } from 'lucide-react'

interface SocialPost {
  id: string
  author: {
    name: string
    avatar: string
    verified: boolean
    followers: number
  }
  content: string
  symbol?: string
  prediction?: {
    direction: 'up' | 'down'
    confidence: number
    price: number
  }
  timestamp: Date
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  tags: string[]
}

export const SocialFeed = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'predictions' | 'news' | 'discussions'>('all')
  const [newPost, setNewPost] = useState('')

  // Mock social posts data
  const posts: SocialPost[] = [
    {
      id: '1',
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        verified: true,
        followers: 12500
      },
      content: 'Just analyzed AAPL technicals - strong bullish momentum building. RSI showing oversold conditions with potential for 15% upside in next 30 days.',
      symbol: 'AAPL',
      prediction: {
        direction: 'up',
        confidence: 85,
        price: 175.50
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false,
      tags: ['AAPL', 'Technical Analysis', 'Bullish']
    },
    {
      id: '2',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        verified: true,
        followers: 8900
      },
      content: 'Market sentiment turning bearish on tech stocks. TSLA showing signs of weakness - might be time to take profits or set stop losses.',
      symbol: 'TSLA',
      prediction: {
        direction: 'down',
        confidence: 72,
        price: 245.30
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 28,
      comments: 12,
      shares: 5,
      isLiked: true,
      isBookmarked: true,
      tags: ['TSLA', 'Bearish', 'Tech']
    },
    {
      id: '3',
      author: {
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        verified: false,
        followers: 3400
      },
      content: 'Interesting pattern in GOOGL - consolidation phase might be ending. Volume picking up, could see breakout above $150 resistance.',
      symbol: 'GOOGL',
      prediction: {
        direction: 'up',
        confidence: 68,
        price: 148.75
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 15,
      comments: 4,
      shares: 1,
      isLiked: false,
      isBookmarked: false,
      tags: ['GOOGL', 'Breakout', 'Resistance']
    },
    {
      id: '4',
      author: {
        name: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        verified: true,
        followers: 15600
      },
      content: 'Portfolio update: Rebalanced positions after market volatility. Increased exposure to defensive stocks, reduced tech allocation by 15%.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 67,
      comments: 15,
      shares: 8,
      isLiked: false,
      isBookmarked: false,
      tags: ['Portfolio', 'Rebalancing', 'Defensive']
    }
  ]

  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'predictions' && post.prediction) return true
    if (selectedFilter === 'news' && !post.prediction) return true
    if (selectedFilter === 'discussions' && post.content.includes('discussion')) return true
    return false
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleLike = (postId: string) => {
    // In a real app, this would update the backend
    console.log(`Liked post ${postId}`)
  }

  const handleBookmark = (postId: string) => {
    // In a real app, this would update the backend
    console.log(`Bookmarked post ${postId}`)
  }

  const handleShare = (postId: string) => {
    // In a real app, this would open share dialog
    console.log(`Shared post ${postId}`)
  }

  const handleComment = (postId: string) => {
    // In a real app, this would open comment dialog
    console.log(`Commented on post ${postId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Social Feed
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with other traders and share insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className="input"
          >
            <option value="all">All Posts</option>
            <option value="predictions">Predictions</option>
            <option value="news">News</option>
            <option value="discussions">Discussions</option>
          </select>
        </div>
      </div>

      {/* Create Post */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              You
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your market insights, predictions, or ask questions..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Add Symbol
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Add Image
                </button>
              </div>
              <button
                disabled={!newPost.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {post.author.name}
                    </span>
                    {post.author.verified && (
                      <Star className="h-4 w-4 text-blue-500 fill-current" />
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(post.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {post.author.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white mb-3">
                {post.content}
              </p>
              
              {/* Prediction Card */}
              {post.prediction && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {post.symbol} Prediction
                    </span>
                    <div className="flex items-center space-x-2">
                      {post.prediction.direction === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        post.prediction.direction === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {post.prediction.direction === 'up' ? 'Bullish' : 'Bearish'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Target Price:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        ${post.prediction.price.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                      <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                        {post.prediction.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 ${
                    post.isLiked 
                      ? 'text-red-500' 
                      : 'text-gray-500 hover:text-red-500 dark:hover:text-red-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                <button
                  onClick={() => handleComment(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                
                <button
                  onClick={() => handleShare(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 dark:hover:text-green-400"
                >
                  <Share className="h-5 w-5" />
                  <span className="text-sm">{post.shares}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-2 rounded-full ${
                    post.isBookmarked 
                      ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900' 
                      : 'text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'
                  }`}
                >
                  <Star className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="btn-outline">
          Load More Posts
        </button>
      </div>
    </div>
  )
}
