import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'
import type { LoginRequest } from '@/types'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.access_token)
      navigate('/')
    },
  })

  const { data: currentUser, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    retry: false,
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return {
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || isUserLoading,
    login: loginMutation.mutate,
    logout: handleLogout,
    error: loginMutation.error,
  }
}
