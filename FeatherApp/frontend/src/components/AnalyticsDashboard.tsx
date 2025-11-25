import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target, Zap, Award } from 'lucide-react'

interface AnalyticsData {
  portfolio: {
    totalValue: number
    dayChange: number
    dayChangePercent: number
    weekChange: number
    monthChange: number
    yearChange: number
  }
  performance: {
    sharpeRatio: number
    maxDrawdown: number
    volatility: number
    alpha: number
    beta: number
  }
  predictions: {
    accuracy: number
    totalPredictions: number
    correctPredictions: number
    avgConfidence: number
  }
  sentiment: {
    overallScore: number
    positiveCount: number
    negativeCount: number
    neutralCount: number
  }
  alerts: {
    total: number
    triggered: number
    active: number
    successRate: number
  }
}

export const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M')
  const [selectedMetric, setSelectedMetric] = useState<string>('portfolio')

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    portfolio: {
      totalValue: 125430.50,
      dayChange: 2847.32,
      dayChangePercent: 2.32,
      weekChange: 12500.75,
      monthChange: 18750.25,
      yearChange: 45230.50
    },
    performance: {
      sharpeRatio: 1.85,
      maxDrawdown: -8.5,
      volatility: 12.3,
      alpha: 2.1,
      beta: 0.95
    },
    predictions: {
      accuracy: 78.5,
      totalPredictions: 1247,
      correctPredictions: 978,
      avgConfidence: 82.3
    },
    sentiment: {
      overallScore: 0.65,
      positiveCount: 45,
      negativeCount: 12,
      neutralCount: 8
    },
    alerts: {
      total: 23,
      triggered: 8,
      active: 15,
      successRate: 87.5
    }
  }

  const getPerformanceColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? 'text-green-600' : 'text-red-600'
    }
    return value >= 0 ? 'text-red-600' : 'text-green-600'
  }

  const getPerformanceBg = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      return value >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
    }
    return value >= 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Performance metrics and insights for your portfolio
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="input"
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
            <option value="ALL">All Time</option>
          </select>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            ${analyticsData.portfolio.totalValue.toLocaleString()}
          </div>
          <div className={`text-sm ${getPerformanceColor(analyticsData.portfolio.dayChangePercent)}`}>
            {analyticsData.portfolio.dayChangePercent >= 0 ? '+' : ''}{analyticsData.portfolio.dayChangePercent.toFixed(2)}% today
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analyticsData.performance.sharpeRatio.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Risk-adjusted returns
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Prediction Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analyticsData.predictions.accuracy.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {analyticsData.predictions.correctPredictions}/{analyticsData.predictions.totalPredictions} correct
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Alert Success</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {analyticsData.alerts.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {analyticsData.alerts.triggered}/{analyticsData.alerts.total} triggered
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(analyticsData.performance.sharpeRatio * 20, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.sharpeRatio.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${Math.abs(analyticsData.performance.maxDrawdown) * 5}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.maxDrawdown.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.performance.volatility * 2}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.volatility.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Alpha</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.max(analyticsData.performance.alpha * 20, 0)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.alpha.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Beta</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${analyticsData.performance.beta * 50}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.beta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sentiment Analysis
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {(analyticsData.sentiment.overallScore * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Overall Sentiment Score
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.sentiment.positiveCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.sentiment.negativeCount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.sentiment.neutralCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Performance */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Prediction Performance
          </h3>
          <Zap className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.predictions.accuracy.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Accuracy Rate
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.predictions.avgConfidence.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Average Confidence
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.predictions.totalPredictions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Predictions
            </div>
          </div>
        </div>
      </div>

      {/* Alert Performance */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alert Performance
          </h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.alerts.total}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Alerts
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.alerts.active}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active Alerts
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.alerts.triggered}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Triggered
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {analyticsData.alerts.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Success Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
