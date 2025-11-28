// src/components/TickerSearch.tsx
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useTickers } from '@/hooks/useTickers'

interface TickerSearchProps {
  onSelect: (symbol: string) => void
  placeholder?: string
}

export const TickerSearch = ({ onSelect, placeholder }: TickerSearchProps) => {
  const [query, setQuery] = useState('')
  const { data: tickers, isLoading } = useTickers()

  const filtered = useMemo(() => {
    if (!tickers) return []
    if (!query.trim()) return tickers.slice(0, 10)

    const q = query.toLowerCase()
    return tickers
      .filter(
        (t) =>
          t.ticker.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q)
      )
      .slice(0, 10)
  }, [tickers, query])

  const handleSelect = (symbol: string) => {
    setQuery(symbol)
    onSelect(symbol)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder ?? 'Search for a specific symbol...'}
          className="input pl-10 w-full"
        />
      </div>

      {/* Dropdown */}
      {query.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-slate-800">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Loading symbols…
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No symbols found
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {filtered.map((t) => (
                <li
                  key={t.id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
                  onClick={() => handleSelect(t.ticker)}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t.ticker}
                  </span>
                  {t.name && (
                    <span className="ml-2 text-gray-500 dark:text-gray-400">
                      {t.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
