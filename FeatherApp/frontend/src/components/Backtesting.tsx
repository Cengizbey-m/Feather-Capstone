import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Download, Settings, TrendingUp, TrendingDown, BarChart3, Target, DollarSign } from 'lucide-react'

interface BacktestResult {
  strategy: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  monthlyReturns: number[]
  equityCurve: { date: string; value: number }[]
  drawdownCurve: { date: string; value: number }[]
  trades: {
    date: string
    symbol: string
    action: 'buy' | 'sell'
    price: number
    quantity: number
    pnl: number
    reason: string
  }[]
}

interface Strategy {
  name: string
  description: string
  parameters: {
    name: string
    value: number
    min: number
    max: number
    step: number
  }[]
  enabled: boolean
}

export const Backtesting = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('momentum')
  const [startDate, setStartDate] = useState('2020-01-01')
  const [endDate, setEndDate] = useState('2023-12-31')
  const [initialCapital, setInitialCapital] = useState(100000)
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const strategies: Strategy[] = [
    {
      name: 'momentum',
      description: 'Buy stocks with strong momentum, sell when momentum weakens',
      parameters: [
        { name: 'Lookback Period', value: 20, min: 5, max: 50, step: 5 },
        { name: 'Momentum Threshold', value: 0.05, min: 0.01, max: 0.20, step: 0.01 },
        { name: 'Stop Loss', value: 0.10, min: 0.05, max: 0.30, step: 0.05 }
      ],
      enabled: true
    },
    {
      name: 'mean_reversion',
      description: 'Buy oversold stocks, sell overbought stocks',
      parameters: [
        { name: 'RSI Period', value: 14, min: 5, max: 30, step: 1 },
        { name: 'Oversold Level', value: 30, min: 20, max: 40, step: 5 },
        { name: 'Overbought Level', value: 70, min: 60, max: 80, step: 5 }
      ],
      enabled: true
    },
    {
      name: 'moving_average',
      description: 'Buy when price crosses above moving average, sell when below',
      parameters: [
        { name: 'Short MA Period', value: 10, min: 5, max: 20, step: 1 },
        { name: 'Long MA Period', value: 30, min: 20, max: 50, step: 5 },
        { name: 'Volume Filter', value: 1.5, min: 1.0, max: 3.0, step: 0.1 }
      ],
      enabled: true
    },
    {
      name: 'bollinger_bands',
      description: 'Buy at lower band, sell at upper band',
      parameters: [
        { name: 'Period', value: 20, min: 10, max: 30, step: 5 },
        { name: 'Standard Deviations', value: 2, min: 1, max: 3, step: 0.5 },
        { name: 'Exit Threshold', value: 0.5, min: 0.1, max: 1.0, step: 0.1 }
      ],
      enabled: true
    }
  ]

  // Mock backtest results
  const backtestResult: BacktestResult = {
    strategy: 'Momentum Strategy',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    initialCapital: 100000,
    finalCapital: 156750,
    totalReturn: 56.75,
    annualizedReturn: 12.8,
    volatility: 18.5,
    sharpeRatio: 1.42,
    maxDrawdown: 15.2,
    winRate: 58.3,
    profitFactor: 1.85,
    totalTrades: 156,
    winningTrades: 91,
    losingTrades: 65,
    averageWin: 2.8,
    averageLoss: -1.9,
    largestWin: 12.5,
    largestLoss: -8.2,
    monthlyReturns: [2.1, -1.5, 3.2, 1.8, -0.9, 2.5, 1.2, -2.1, 3.8, 2.1, 1.5, 2.9],
    equityCurve: Array.from({ length: 48 }, (_, i) => ({
      date: new Date(2020, i, 1).toISOString(),
      value: 100000 + (i * 1200) + (Math.random() - 0.5) * 5000
    })),
    drawdownCurve: Array.from({ length: 48 }, (_, i) => ({
      date: new Date(2020, i, 1).toISOString(),
      value: Math.max(0, Math.sin(i / 10) * 15)
    })),
    trades: [
      { date: '2020-01-15', symbol: 'AAPL', action: 'buy', price: 150.25, quantity: 100, pnl: 0, reason: 'Momentum signal' },
      { date: '2020-02-20', symbol: 'AAPL', action: 'sell', price: 155.80, quantity: 100, pnl: 555, reason: 'Stop loss triggered' },
      { date: '2020-03-10', symbol: 'GOOGL', action: 'buy', price: 1200.50, quantity: 20, pnl: 0, reason: 'Momentum signal' },
      { date: '2020-04-15', symbol: 'GOOGL', action: 'sell', price: 1250.75, quantity: 20, pnl: 1005, reason: 'Take profit' },
      { date: '2020-05-20', symbol: 'TSLA', action: 'buy', price: 200.25, quantity: 50, pnl: 0, reason: 'Momentum signal' },
      { date: '2020-06-25', symbol: 'TSLA', action: 'sell', price: 220.50, quantity: 50, pnl: 1012.5, reason: 'Momentum weakened' }
    ]
  }

  const runBacktest = () => {
    setIsRunning(true)
    setShowResults(false)
    
    // Simulate backtest running
    setTimeout(() => {
      setIsRunning(false)
      setShowResults(true)
    }, 3000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  const formatNumber = (num: number) => {
    return num.toFixed(2)
  }

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getReturnBg = (value: number) => {
    return value >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
  }

  const selectedStrategyData = strategies.find(s => s.name === selectedStrategy)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-purple-500" />
            <span>Strategy Backtesting</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test and optimize trading strategies with historical data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={runBacktest}
            disabled={isRunning}
            className="btn-primary flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run Backtest</span>
              </>
            )}
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Strategy Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Strategy
            </label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className="input"
            >
              {strategies.map((strategy) => (
                <option key={strategy.name} value={strategy.name}>
                  {strategy.name.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedStrategyData?.description}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Initial Capital
            </label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {/* Strategy Parameters */}
        {selectedStrategyData && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Strategy Parameters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedStrategyData.parameters.map((param, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {param.name}
                  </label>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{param.min}</span>
                    <span className="font-medium">{param.value}</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Backtest Results */}
      {showResults && (
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Return</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPercent(backtestResult.totalReturn)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(backtestResult.finalCapital - backtestResult.initialCapital)}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(backtestResult.sharpeRatio)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Risk-adjusted return
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Max Drawdown</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPercent(backtestResult.maxDrawdown)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Peak to trough
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPercent(backtestResult.winRate)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {backtestResult.winningTrades}/{backtestResult.totalTrades} trades
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Annualized Return</span>
                  <span className={`font-medium ${getReturnColor(backtestResult.annualizedReturn)}`}>
                    {formatPercent(backtestResult.annualizedReturn)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPercent(backtestResult.volatility)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatNumber(backtestResult.profitFactor)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Trades</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {backtestResult.totalTrades}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trade Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Winning Trades</span>
                  <span className="font-medium text-green-600">
                    {backtestResult.winningTrades}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Losing Trades</span>
                  <span className="font-medium text-red-600">
                    {backtestResult.losingTrades}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Win</span>
                  <span className="font-medium text-green-600">
                    {formatPercent(backtestResult.averageWin)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Loss</span>
                  <span className="font-medium text-red-600">
                    {formatPercent(backtestResult.averageLoss)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Trades
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Symbol</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">P&L</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {backtestResult.trades.map((trade, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{trade.date}</td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{trade.symbol}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          trade.action === 'buy' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {trade.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{formatCurrency(trade.price)}</td>
                      <td className="py-4 px-4 text-gray-900 dark:text-white">{trade.quantity}</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getReturnColor(trade.pnl)}`}>
                          {trade.pnl > 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{trade.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
