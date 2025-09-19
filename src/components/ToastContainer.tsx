'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastNotification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  duration?: number
}

interface ToastProps {
  notification: ToastNotification
  onRemove: (id: string) => void
}

const Toast = ({ notification, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Animação de entrada
    setIsVisible(true)

    // Auto-remover após duração especificada
    const duration = notification.duration || 5000
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(notification.id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [notification.id, notification.duration, onRemove])

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-900'
      case 'warning':
        return 'text-yellow-900'
      case 'error':
        return 'text-red-900'
      case 'info':
      default:
        return 'text-blue-900'
    }
  }

  return (
    <div
      className={cn(
        'transform transition-all duration-300 ease-in-out',
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm',
        getBackgroundColor(),
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      {getIcon()}
      
      <div className="flex-1 min-w-0">
        <h4 className={cn('font-medium text-sm', getTextColor())}>
          {notification.title}
        </h4>
        <p className={cn('text-sm mt-1 opacity-80', getTextColor())}>
          {notification.message}
        </p>
        <p className="text-xs opacity-60 mt-2">
          {notification.timestamp.toLocaleTimeString('pt-BR')}
        </p>
      </div>

      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onRemove(notification.id), 300)
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  const addNotification = (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
      timestamp: new Date()
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Sistema de notificações push removido conforme solicitado

  // Expor função globalmente para outros componentes
  useEffect(() => {
    (window as any).addNotification = addNotification
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-h-screen overflow-hidden">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  )
}

// Hook para usar notificações em outros componentes
export const useNotifications = () => {
  const addNotification = (notification: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    if ((window as any).addNotification) {
      (window as any).addNotification(notification)
    }
  }

  return { addNotification }
}
