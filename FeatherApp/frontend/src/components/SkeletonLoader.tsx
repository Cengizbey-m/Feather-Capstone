import { useEffect, useState } from 'react'

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'chart' | 'list' | 'text' | 'avatar'
  lines?: number
  className?: string
  animate?: boolean
}

export const SkeletonLoader = ({ 
  type = 'card', 
  lines = 3, 
  className = '', 
  animate = true 
}: SkeletonLoaderProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const baseClasses = `bg-gray-200 dark:bg-gray-700 ${animate ? 'animate-pulse' : ''} ${className}`

  const renderCard = () => (
    <div className={`p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${baseClasses}`}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>
  )

  const renderTable = () => (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 ${baseClasses}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderChart = () => (
    <div className={`p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${baseClasses}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  )

  const renderList = () => (
    <div className={`space-y-4 ${baseClasses}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        </div>
      ))}
    </div>
  )

  const renderText = () => (
    <div className={`space-y-2 ${baseClasses}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  )

  const renderAvatar = () => (
    <div className={`flex items-center space-x-4 ${baseClasses}`}>
      <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return renderCard()
      case 'table':
        return renderTable()
      case 'chart':
        return renderChart()
      case 'list':
        return renderList()
      case 'text':
        return renderText()
      case 'avatar':
        return renderAvatar()
      default:
        return renderCard()
    }
  }

  if (!isVisible) return null

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {renderSkeleton()}
    </div>
  )
}

// Specialized skeleton components
export const CardSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="card" className={className} />
)

export const TableSkeleton = ({ lines = 5, className = '' }: { lines?: number; className?: string }) => (
  <SkeletonLoader type="table" lines={lines} className={className} />
)

export const ChartSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="chart" className={className} />
)

export const ListSkeleton = ({ lines = 4, className = '' }: { lines?: number; className?: string }) => (
  <SkeletonLoader type="list" lines={lines} className={className} />
)

export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <SkeletonLoader type="text" lines={lines} className={className} />
)

export const AvatarSkeleton = ({ className = '' }: { className?: string }) => (
  <SkeletonLoader type="avatar" className={className} />
)
