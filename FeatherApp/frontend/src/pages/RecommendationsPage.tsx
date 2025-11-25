import { AIRecommendations } from '@/components/AIRecommendations'

export const RecommendationsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Investment Recommendations
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          AI-powered investment analysis and recommendations
        </p>
      </div>

      {/* AI Recommendations */}
      <AIRecommendations />
    </div>
  )
}
