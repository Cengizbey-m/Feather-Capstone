import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut, User, Menu, PanelLeftClose } from 'lucide-react'
import { NotificationCenter } from './NotificationCenter'
import type { User as UserType } from '@/types'

interface NavBarProps {
  user: UserType | null
  onLogout: () => void
  onSidebarToggle?: () => void
  sidebarHidden?: boolean
}

export const NavBar = ({ user, onLogout, onSidebarToggle, sidebarHidden = false }: NavBarProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('darkMode')
    if (stored) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-effect shadow-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="px-4 sm:px-6 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-3">
            {onSidebarToggle && (
              <button
                type="button"
                onClick={onSidebarToggle}
                className="hidden lg:inline-flex items-center rounded-md border border-gray-200 bg-white/70 px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {sidebarHidden ? (
                  <>
                    <Menu className="mr-2 h-4 w-4" />
                    Open menu
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="mr-2 h-4 w-4" />
                    Hide menu
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => navigate('/market')}
              type="button"
              className="flex items-center space-x-3 text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                <img
                  src="/images/image002.png"
                  alt="Feather Logo"
                  className="h-9 w-9 object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'block'
                  }}
                />
                <span className="hidden text-lg text-white">🪶</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">Feather</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Market Insights</span>
              </div>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />

            <button
              onClick={toggleDarkMode}
              type="button"
              className="rounded-md border border-transparent px-3 py-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-pressed={darkMode}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              
              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center space-x-1 rounded-md border border-gray-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
