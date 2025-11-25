import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { alertsApi } from '@/lib/api'
import type { AlertCreate } from '@/types'

export const useAlerts = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAlerts,
  })

  const createMutation = useMutation({
    mutationFn: alertsApi.createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: alertsApi.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
  })

  const createAlert = (data: AlertCreate) => {
    createMutation.mutate(data)
  }

  const deleteAlert = (alertId: number) => {
    deleteMutation.mutate(alertId)
  }

  return {
    alerts: data?.items || [],
    isLoading: isLoading || createMutation.isPending || deleteMutation.isPending,
    error: error || createMutation.error || deleteMutation.error,
    createAlert,
    deleteAlert,
  }
}
