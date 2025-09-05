'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    callback: () => void
  }
}

interface NotificationSystemProps {
  className?: string
}

export default function NotificationSystem({ className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Simular notificações em tempo real
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const newNotifications = await response.json()
          setNotifications(prev => [...newNotifications, ...prev].slice(0, 10))
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      }
    }, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  // Adicionar notificações de exemplo na inicialização
  useEffect(() => {
    const exemploNotificacoes: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Nova demanda cadastrada',
        message: 'Demanda #NAF2025001 cadastrada com sucesso',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Atendimento pendente',
        message: '3 atendimentos aguardando agendamento',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
        action: {
          label: 'Ver agendamentos',
          callback: () => window.location.href = '/schedule'
        }
      },
      {
        id: '3',
        type: 'info',
        title: 'Relatório disponível',
        message: 'Relatório mensal de setembro gerado',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        action: {
          label: 'Baixar',
          callback: () => window.open('/api/reports/monthly', '_blank')
        }
      }
    ]
    setNotifications(exemploNotificacoes)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d atrás`
    if (hours > 0) return `${hours}h atrás`
    if (minutes > 0) return `${minutes}m atrás`
    return 'Agora'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notificações
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {notification.action && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              notification.action!.callback()
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          >
                            {notification.action.label}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-auto"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Limpar todas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
