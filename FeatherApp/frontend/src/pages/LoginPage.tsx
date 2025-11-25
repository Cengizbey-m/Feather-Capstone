import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      login({ email, password })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <img 
                src="/images/image001.png" 
                alt="Feather Logo" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                  const nextSibling = target.nextElementSibling as HTMLElement
                  if (nextSibling) nextSibling.style.display = 'block'
                }}
              />
              <span className="text-white text-4xl hidden">🪶</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold gradient-text">
            Welcome to Feather
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to access your market insights
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <div className="text-sm text-red-800 dark:text-red-200">
                  {error.message || 'Login failed. Please try again.'}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
              </button>
            </div>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Demo Mode:</strong> Enter any email and password to create an account or sign in.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
