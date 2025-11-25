import { render, screen } from '@testing-library/react'
import { PredictionCard } from '@/components/PredictionCard'
import type { PredictionResponse } from '@/types'

const mockPrediction: PredictionResponse = {
  symbol: 'AAPL',
  asOf: '2025-01-15T10:30:00Z',
  prediction: {
    deltaPct: 2.5,
    direction: 'up',
    confidence: 0.75,
  },
  model: {
    type: 'svr_rf_ensemble',
    version: '0.0.1-mock',
  },
}

describe('PredictionCard', () => {
  it('renders prediction data correctly', () => {
    render(<PredictionCard data={mockPrediction} />)
    
    expect(screen.getByText('AAPL Prediction')).toBeInTheDocument()
    expect(screen.getByText('+2.50%')).toBeInTheDocument()
    expect(screen.getByText('Expected to rise')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('svr_rf_ensemble v0.0.1-mock')).toBeInTheDocument()
  })

  it('shows loading state', () => {
    render(<PredictionCard data={undefined} isLoading={true} />)
    
    // Check for skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  it('shows empty state when no data', () => {
    render(<PredictionCard data={undefined} isLoading={false} />)
    
    expect(screen.getByText('No prediction data available')).toBeInTheDocument()
  })

  it('displays negative prediction correctly', () => {
    const negativePrediction = {
      ...mockPrediction,
      prediction: {
        deltaPct: -1.8,
        direction: 'down' as const,
        confidence: 0.65,
      },
    }

    render(<PredictionCard data={negativePrediction} />)
    
    expect(screen.getByText('-1.80%')).toBeInTheDocument()
    expect(screen.getByText('Expected to fall')).toBeInTheDocument()
  })

  it('shows confidence bar with correct percentage', () => {
    render(<PredictionCard data={mockPrediction} />)
    
    const confidenceBar = document.querySelector('.h-2.rounded-full')
    expect(confidenceBar).toHaveStyle('width: 75%')
  })
})
