import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { TickerSearch } from './TickerSearch'
import { LoadingSpinner } from './LoadingSpinner'
import type { AlertCreate } from '@/types'

interface AlertFormProps {
  onSubmit: (alert: AlertCreate) => void
  onCancel: () => void
  isLoading?: boolean
}

export const AlertForm = ({ onSubmit, onCancel, isLoading }: AlertFormProps) => {
  const [symbol, setSymbol] = useState('')
  const [metric, setMetric] = useState('predictedDeltaPct')
  const [operator, setOperator] = useState('<=' as const)
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (symbol && value) {
      onSubmit({
        symbol,
        rule: {
          metric,
          op: operator,
          value: parseFloat(value),
        },
      })
    }
  }

  const metricOptions = [
    { value: 'predictedDeltaPct', label: 'Predicted Delta %' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'sentimentScore', label: 'Sentiment Score' },
  ]

  const operatorOptions = [
    { value: '<=', label: 'Less than or equal to' },
    { value: '>=', label: 'Greater than or equal to' },
    { value: '<', label: 'Less than' },
    { value: '>', label: 'Greater than' },
    { value: '==', label: 'Equal to' },
    { value: '!=', label: 'Not equal to' },
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Create Alert
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Symbol Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Symbol
          </label>
          <TickerSearch
            onSelect={setSymbol}
            placeholder="Select a ticker symbol..."
          />
          {symbol && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: <span className="font-medium">{symbol}</span>
            </div>
          )}
        </div>

        {/* Metric Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Metric
          </label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="input"
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operator and Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Condition
            </label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value as any)}
              className="input"
            >
              {operatorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value
            </label>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value..."
              className="input"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          This alert will trigger when the {metricOptions.find(m => m.value === metric)?.label.toLowerCase()} 
          is {operatorOptions.find(o => o.value === operator)?.label.toLowerCase()} {value || 'the specified value'}.
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={!symbol || !value || isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="border-white border-t-transparent" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Creating...' : 'Create Alert'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
