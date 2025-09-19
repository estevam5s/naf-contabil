'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BellRing,
  MessageCircle,
  Users,
  Clock,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft
} from 'lucide-react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  timestamp: string
  urgency: 'low' | 'medium' | 'high'
  data?: any
}

interface Props {
  coordinatorId?: string
}

export default function NotificationCenter({ coordinatorId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Carregar notificações
  const loadNotifications = async () => {
    if (!coordinatorId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/notifications?coordinator_id=${coordinatorId}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unread_count || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    if (!coordinatorId) return

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_id: notificationId,
          coordinator_id: coordinatorId
        })
      })

      // Remover da lista local
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  // Carregar ao montar e abrir
  useEffect(() => {
    if (isOpen && coordinatorId) {
      loadNotifications()
    }
  }, [isOpen, coordinatorId])

  // Polling para novas notificações
  useEffect(() => {
    if (!coordinatorId) return

    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // Atualizar a cada 30 segundos

    return () => clearInterval(interval)
  }, [coordinatorId])

  // Ícone baseado no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'chat_request':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'unread_messages':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'chat_transferred':
        return <ArrowRightLeft className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Cor baseada na urgência
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-orange-500 bg-orange-50'
      default:
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  // Tempo relativo
  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'agora mesmo'
    if (diffMinutes < 60) return `${diffMinutes}min atrás`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h atrás`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d atrás`
  }

  if (!coordinatorId) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-96 shadow-lg z-50 max-h-[500px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notificações</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Carregando notificações...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Nenhuma notificação
              </div>
            ) : (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-1 p-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 ${getUrgencyColor(notification.urgency)} hover:bg-gray-50 cursor-pointer transition-colors`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {getRelativeTime(notification.timestamp)}
                            </span>
                            {notification.urgency === 'high' && (
                              <Badge variant="destructive" className="text-xs">
                                Urgente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {notifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadNotifications}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Atualizando...' : 'Atualizar notificações'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}