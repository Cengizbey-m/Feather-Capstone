import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import type { PredictionResponse } from '@/types'

interface PredictionCardProps {
  data: PredictionResponse
  isLoading?: boolean
}

export const PredictionCard = ({ data, isLoading }: PredictionCardProps) => {
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No prediction data available
        </div>
      </div>
    )
  }

  const { symbol, prediction, model } = data

  const isPositive = prediction.direction === 'up'
  const confidencePercentage =
    prediction.confidence != null
      ? Math.round(prediction.confidence * 100)
      : null

  const targetPrice = prediction.targetPrice
  const horizonDays = prediction.horizonDays

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {symbol} Prediction
        </h3>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {model.type} v{model.version}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Prediction Value */}
        <div className="flex items-center space-x-3">
          {isPositive ? (
            <TrendingUp className="h-8 w-8 text-green-500" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-500" />
          )}
          <div>
            <div
              className={`text-2xl font-bold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {targetPrice != null
                ? `$${targetPrice.toFixed(2)}`
                : `${isPositive ? '+' : ''}${prediction.deltaPct.toFixed(2)}%`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {targetPrice != null && horizonDays
                ? `Model forecast over ${horizonDays}-day horizon`
                : isPositive
                ? 'Expected to rise'
                : 'Expected to fall'}
            </div>
          </div>
        </div>

        {/* Confidence Bar – only if backend provides it */}
        {confidencePercentage != null && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Confidence
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {confidencePercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  confidencePercentage >= 70
                    ? 'bg-green-500'
                    : confidencePercentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Timestamp + extra info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>As of {new Date(data.asOf).toLocaleString()}</div>
          {horizonDays && (
            <div>Horizon: {horizonDays} day{horizonDays !== 1 ? 's' : ''}</div>
          )}
          {targetPrice != null && (
            <div>Predicted price: ${targetPrice.toFixed(2)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
