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

  // 🔥 NO BANNER — NOTHING ABOVE THE NAVBAR
  return <>{children}</>
}
