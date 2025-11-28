import { Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@/components/AuthGuard'
import { AppLayout } from '@/components/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
// import { DashboardPage } from '@/pages/DashboardPage' // Commented out - keep for backburner
import { TickerPage } from '@/pages/TickerPage'
import { NewsPage } from '@/pages/NewsPage'
import { AlertsPage } from '@/pages/AlertsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
// import { ScreenerPage } from '@/pages/ScreenerPage'
// import { SocialPage } from '@/pages/SocialPage' // Commented out - needs account management
import { MarketPage } from '@/pages/MarketPage'
// import { PortfolioPage } from '@/pages/PortfolioPage' // Commented out - needs account info
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { ChartsPage } from '@/pages/ChartsPage'
import { RiskPage } from '@/pages/RiskPage'
// import { BacktestingPage } from '@/pages/BacktestingPage' // Commented out - not needed for project

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <AppLayout>
              <Routes>
                {/* <Route path="/" element={<DashboardPage />} /> */} {/* Commented out - keep for backburner */}
                <Route path="/" element={<MarketPage />} /> {/* Default to Market page */}
                <Route path="/ticker/:symbol" element={<TickerPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                {/* <Route path="/social" element={<SocialPage />} /> */} {/* Commented out - needs account management */}
                <Route path="/market" element={<MarketPage />} />
                {/* <Route path="/portfolio" element={<PortfolioPage />} /> */} {/* Commented out - needs account info */}
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/charts" element={<ChartsPage />} />
                <Route path="/risk" element={<RiskPage />} />
                {/* <Route path="/backtesting" element={<BacktestingPage />} /> */} {/* Commented out - not needed for project */}
              </Routes>
            </AppLayout>
          </AuthGuard>
        }
      />
    </Routes>
  )
}

export default App

