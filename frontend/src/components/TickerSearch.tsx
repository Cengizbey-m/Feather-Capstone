import { useState } from 'react'
import { Search, Check } from 'lucide-react'

interface TickerSearchProps {
  onSelect: (symbol: string) => void
  placeholder?: string
}

export const TickerSearch = ({ onSelect, placeholder = 'Search for a ticker symbol...' }: TickerSearchProps) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Common ticker symbols for suggestions
  const commonSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'UBER', 'LYFT'
  ]

  const filteredSymbols = commonSymbols.filter(symbol =>
    symbol.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (symbol: string) => {
    onSelect(symbol)
    setQuery('')
    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSelect(query.trim().toUpperCase())
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="input pl-10 pr-4 w-full"
            autoComplete="off"
          />
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (query.length > 0 || filteredSymbols.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSymbols.length > 0 ? (
            <div className="py-1">
              {filteredSymbols.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSelect(symbol)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span>{symbol}</span>
                  <Check className="h-4 w-4 text-green-500" />
                </button>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
              No symbols found
            </div>
          ) : null}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
