import { Backtesting } from '@/components/Backtesting'

export const BacktestingPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Strategy Backtesting
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Test and optimize trading strategies with historical data
        </p>
      </div>

      {/* Backtesting */}
      <Backtesting />
    </div>
  )
}
