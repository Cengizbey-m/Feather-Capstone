import { MarketOverview } from '@/components/MarketOverview'

export const MarketPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market Overview
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time market data, indices, sectors, and global markets
        </p>
      </div>

      {/* Market Overview */}
      <MarketOverview />
    </div>
  )
}
