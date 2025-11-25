import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

export const AnalyticsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive performance metrics and portfolio analytics
        </p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />
    </div>
  )
}
