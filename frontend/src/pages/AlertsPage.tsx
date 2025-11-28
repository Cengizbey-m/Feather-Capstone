import { useState } from 'react'
import { Plus, Trash2, Bell, BellOff } from 'lucide-react'
import { useAlerts } from '@/hooks/useAlerts'
import { AlertForm } from '@/components/AlertForm'
import { useEffect } from 'react'
import { systemApi } from '@/lib/api'
import type { Alert, AlertCreate } from '@/types'

export const AlertsPage = () => {
  const { alerts, isLoading, createAlert, deleteAlert } = useAlerts()
  const [showForm, setShowForm] = useState(false)


  const handleCreateAlert = (alertData: AlertCreate) => {
    createAlert(alertData)
    setShowForm(false)
  }

  const handleDeleteAlert = (alertId: number) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteAlert(alertId)
    }
  }

  const getStatusColor = (status: Alert['is_active']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'triggered':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'disabled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: Alert['is_active']) => {
    switch (status) {
      case 'active':
        return <Bell className="h-4 w-4" />
      case 'triggered':
        return <Bell className="h-4 w-4" />
      case 'disabled':
        return <BellOff className="h-4 w-4" />
      default:
        return <BellOff className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Price Alerts
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set up alerts to monitor your favorite stocks
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </button>
      </div>

      {/* Alert Form */}
      {showForm && (
        <AlertForm
          onSubmit={handleCreateAlert}
          onCancel={() => setShowForm(false)}
          isLoading={isLoading}
        />
      )}

      {/* Alerts List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Your Alerts ({alerts.length})
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="card p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No alerts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first alert to get notified about price movements
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {alert.symbol}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.is_active)}`}>
                        {getStatusIcon(alert.is_active)}
                        <span className="ml-1 capitalize">{alert.is_active}</span>
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Alert when {alert.rule.metric} is {alert.rule.op} {alert.rule.value}
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Created {new Date(alert.created_at).toLocaleDateString()}
                      {alert.triggered_at && (
                        <span className="ml-2">
                          • Triggered {new Date(alert.triggered_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="ml-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How Alerts Work
        </h3>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            • <strong>Predicted Delta %:</strong> Alert when predicted price change reaches your threshold
          </p>
          <p>
            • <strong>Confidence:</strong> Alert when model confidence drops below or exceeds your specified level
          </p>
          <p>
            • <strong>Sentiment Score:</strong> Alert when news sentiment score meets your criteria
          </p>
        </div>
      </div>
    </div>
  )
}
