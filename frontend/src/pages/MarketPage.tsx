// src/pages/MarketPage.tsx
import { useEffect } from 'react'
import { systemApi } from '@/lib/api'
import { MarketOverview } from '@/components/MarketOverview'
import { MarketScreener } from '@/components/MarketScreener'

export const MarketPage = () => {
  useEffect(() => {
    systemApi
      .health()
      .then((data) => {
        console.log('Health OK:', data)
      })
      .catch((err) => {
        console.error('Health FAILED:', err)
      })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Market / Screener
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time market data, indices, sectors, and a simple screener.
        </p>
      </div>

      {/* Market Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Market Overview
        </h2>
        <MarketOverview />
      </section>

      {/* Screener just under Market */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Screener
        </h2>
        <MarketScreener />
      </section>
    </div>
  )
}
