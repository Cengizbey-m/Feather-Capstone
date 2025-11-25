import { RiskManagement } from '@/components/RiskManagement'

export const RiskPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Risk Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Portfolio risk analysis and optimization
        </p>
      </div>

      {/* Risk Management */}
      <RiskManagement />
    </div>
  )
}
