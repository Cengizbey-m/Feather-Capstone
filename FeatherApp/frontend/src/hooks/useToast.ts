import { useState, useCallback } from 'react'
import type { ToastProps } from '@/components/Toast'

interface ToastOptions {
  title: string
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: ToastProps = {
      id,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration,
      onClose: removeToast,
    }
    
    setToasts(prev => [...prev, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'success', duration })
  }, [addToast])

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'error', duration })
  }, [addToast])

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'warning', duration })
  }, [addToast])

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'info', duration })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
