import { useState } from 'react'
import { PriceChart } from '@/components/PriceChart'
import { TickerSearch } from '@/components/TickerSearch'

export const ChartsPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Charts
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View price charts for your favorite stocks
        </p>
      </div>

      {/* Symbol Search */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Select Symbol
        </h2>
        <div className="max-w-md">
          <TickerSearch
            onSelect={setSelectedSymbol}
            placeholder="Search for a ticker symbol..."
          />
        </div>
      </div>

      {/* Price Chart - Katie's Graph */}
      {selectedSymbol && (
        <PriceChart 
          symbol={selectedSymbol}
          data={{
            price: 150.25,
            change: 2.45,
            changePercent: 1.66,
            volume: 45234567,
            high: 152.30,
            low: 148.90
          }}
        />
      )}
    </div>
  )
}
