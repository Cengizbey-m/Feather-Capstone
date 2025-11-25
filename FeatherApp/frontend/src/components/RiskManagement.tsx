import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, Target, TrendingUp, TrendingDown, BarChart3, PieChart, DollarSign, Activity } from 'lucide-react'

interface RiskMetrics {
  portfolio: {
    valueAtRisk: number
    expectedShortfall: number
    sharpeRatio: number
    maxDrawdown: number
    beta: number
    volatility: number
    correlation: number
  }
  individual: {
    symbol: string
    weight: number
    risk: number
    return: number
    sharpe: number
    beta: number
    volatility: number
  }[]
}

interface OptimizationResult {
  optimizedWeights: { [symbol: string]: number }
  expectedReturn: number
  expectedRisk: number
  sharpeRatio: number
  efficientFrontier: {
    risk: number
    return: number
  }[]
}

interface RiskScenario {
  name: string
  probability: number
  impact: number
  description: string
  mitigation: string
}

export const RiskManagement = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '2Y'>('1Y')
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate')
  const [showOptimization, setShowOptimization] = useState(false)
  const [optimizationMethod, setOptimizationMethod] = useState<'max_sharpe' | 'min_risk' | 'target_return'>('max_sharpe')

  // Mock risk metrics data
  const riskMetrics: RiskMetrics = {
    portfolio: {
      valueAtRisk: 2.5,
      expectedShortfall: 3.8,
      sharpeRatio: 1.42,
      maxDrawdown: 12.5,
      beta: 1.15,
      volatility: 18.5,
      correlation: 0.75
    },
    individual: [
      { symbol: 'AAPL', weight: 0.25, risk: 15.2, return: 12.5, sharpe: 1.8, beta: 1.2, volatility: 22.1 },
      { symbol: 'GOOGL', weight: 0.20, risk: 18.5, return: 15.2, sharpe: 1.6, beta: 1.1, volatility: 25.3 },
      { symbol: 'TSLA', weight: 0.15, risk: 35.2, return: 28.5, sharpe: 1.2, beta: 1.8, volatility: 45.6 },
      { symbol: 'JPM', weight: 0.20, risk: 12.8, return: 8.5, sharpe: 1.4, beta: 0.9, volatility: 18.2 },
      { symbol: 'NVDA', weight: 0.20, risk: 28.5, return: 22.1, sharpe: 1.5, beta: 1.6, volatility: 38.9 }
    ]
  }

  const optimizationResult: OptimizationResult = {
    optimizedWeights: {
      'AAPL': 0.30,
      'GOOGL': 0.25,
      'TSLA': 0.10,
      'JPM': 0.25,
      'NVDA': 0.10
    },
    expectedReturn: 14.2,
    expectedRisk: 16.8,
    sharpeRatio: 1.58,
    efficientFrontier: Array.from({ length: 20 }, (_, i) => ({
      risk: 8 + (i * 2),
      return: 6 + (i * 1.2)
    }))
  }

  const riskScenarios: RiskScenario[] = [
    {
      name: 'Market Crash',
      probability: 15,
      impact: 85,
      description: 'Severe market downturn affecting all sectors',
      mitigation: 'Diversify across sectors, increase cash allocation'
    },
    {
      name: 'Interest Rate Shock',
      probability: 25,
      impact: 60,
      description: 'Rapid interest rate increases affecting bond-heavy portfolios',
      mitigation: 'Reduce duration, increase floating-rate securities'
    },
    {
      name: 'Sector Rotation',
      probability: 40,
      impact: 35,
      description: 'Technology sector underperformance',
      mitigation: 'Diversify across sectors, reduce tech concentration'
    },
    {
      name: 'Geopolitical Risk',
      probability: 20,
      impact: 45,
      description: 'International tensions affecting global markets',
      mitigation: 'Increase domestic allocation, hedge currency exposure'
    },
    {
      name: 'Inflation Spike',
      probability: 30,
      impact: 50,
      description: 'Unexpected inflation affecting real returns',
      mitigation: 'Increase TIPS allocation, real estate exposure'
    }
  ]

  const getRiskColor = (value: number, type: 'risk' | 'return' | 'sharpe') => {
    if (type === 'risk') {
      if (value < 10) return 'text-green-600'
      if (value < 20) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'return') {
      if (value > 15) return 'text-green-600'
      if (value > 10) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'sharpe') {
      if (value > 1.5) return 'text-green-600'
      if (value > 1.0) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  const getRiskBg = (value: number, type: 'risk' | 'return' | 'sharpe') => {
    if (type === 'risk') {
      if (value < 10) return 'bg-green-100 dark:bg-green-900'
      if (value < 20) return 'bg-yellow-100 dark:bg-yellow-900'
      return 'bg-red-100 dark:bg-red-900'
    }
    if (type === 'return') {
      if (value > 15) return 'bg-green-100 dark:bg-green-900'
      if (value > 10) return 'bg-yellow-100 dark:bg-yellow-900'
      return 'bg-red-100 dark:bg-red-900'
    }
    if (type === 'sharpe') {
      if (value > 1.5) return 'bg-green-100 dark:bg-green-900'
      if (value > 1.0) return 'bg-yellow-100 dark:bg-yellow-900'
      return 'bg-red-100 dark:bg-red-900'
    }
    return 'bg-gray-100 dark:bg-gray-700'
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`
  const formatNumber = (value: number) => value.toFixed(2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>Risk Management</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Portfolio risk analysis and optimization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="input"
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="6M">6 Months</option>
            <option value="1Y">1 Year</option>
            <option value="2Y">2 Years</option>
          </select>
          <select
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value as any)}
            className="input"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Value at Risk</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPercent(riskMetrics.portfolio.valueAtRisk)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            95% confidence level
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingDown className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Expected Shortfall</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPercent(riskMetrics.portfolio.expectedShortfall)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Tail risk measure
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatNumber(riskMetrics.portfolio.sharpeRatio)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Risk-adjusted return
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Max Drawdown</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPercent(riskMetrics.portfolio.maxDrawdown)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Peak to trough
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Portfolio Risk Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(riskMetrics.portfolio.volatility * 2, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatPercent(riskMetrics.portfolio.volatility)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Beta</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(riskMetrics.portfolio.beta * 50, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(riskMetrics.portfolio.beta)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Correlation</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${riskMetrics.portfolio.correlation * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatNumber(riskMetrics.portfolio.correlation)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Individual Holdings Risk
          </h3>
          <div className="space-y-3">
            {riskMetrics.individual.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPercent(holding.weight * 100)} allocation
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getRiskColor(holding.risk, 'risk')}`}>
                    {formatPercent(holding.risk)} risk
                  </div>
                  <div className={`text-sm font-medium ${getRiskColor(holding.return, 'return')}`}>
                    {formatPercent(holding.return)} return
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Scenarios */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Risk Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskScenarios.map((scenario, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{scenario.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {scenario.probability}% prob
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {scenario.impact}% impact
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {scenario.description}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Mitigation: {scenario.mitigation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Optimization */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Optimization
          </h3>
          <button
            onClick={() => setShowOptimization(!showOptimization)}
            className="btn-primary"
          >
            {showOptimization ? 'Hide' : 'Show'} Optimization
          </button>
        </div>

        {showOptimization && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <select
                value={optimizationMethod}
                onChange={(e) => setOptimizationMethod(e.target.value as any)}
                className="input"
              >
                <option value="max_sharpe">Maximize Sharpe Ratio</option>
                <option value="min_risk">Minimize Risk</option>
                <option value="target_return">Target Return</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Return</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPercent(optimizationResult.expectedReturn)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Expected Risk</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPercent(optimizationResult.expectedRisk)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(optimizationResult.sharpeRatio)}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Optimized Weights</h4>
              <div className="space-y-2">
                {Object.entries(optimizationResult.optimizedWeights).map(([symbol, weight]) => (
                  <div key={symbol} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{symbol}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${weight * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercent(weight * 100)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
