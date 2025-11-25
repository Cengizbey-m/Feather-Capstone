import { useState, useEffect, useRef, ReactNode } from 'react'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
}

export const LazyWrapper = ({ 
  children, 
  fallback = <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Specialized lazy components
export const LazyChart = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <LazyWrapper 
    className={className}
    fallback={<div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}
  >
    {children}
  </LazyWrapper>
)

export const LazyTable = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <LazyWrapper 
    className={className}
    fallback={
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    }
  >
    {children}
  </LazyWrapper>
)

export const LazyList = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <LazyWrapper 
    className={className}
    fallback={
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    }
  >
    {children}
  </LazyWrapper>
)
