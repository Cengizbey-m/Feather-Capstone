import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  // TEMPORARY: Bypass authentication for development
  const DEV_BYPASS = true

  useEffect(() => {
    if (!DEV_BYPASS && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!DEV_BYPASS && !isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Development Mode Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2">
            <p className="font-medium">Development Mode</p>
            <p>Authentication bypassed - using mock data</p>
          </div>
        </div>
      </div>
      {children}
    </>
  )
}
