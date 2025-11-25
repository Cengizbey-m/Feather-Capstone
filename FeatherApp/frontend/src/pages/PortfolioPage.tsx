import { PortfolioTracker } from '@/components/PortfolioTracker'

export const PortfolioPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Portfolio Tracker
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your investments, performance, and portfolio allocation
        </p>
      </div>

      {/* Portfolio Tracker */}
      <PortfolioTracker />
    </div>
  )
}
