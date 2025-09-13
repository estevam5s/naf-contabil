'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Archive,
  X,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  User,
  FileText,
  Settings,
  Zap
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'archived' | 'dismissed'
  icon?: string
  color?: string
  action_url?: string
  action_label?: string
  metadata?: any
  created_at: string
  read_at?: string
  expires_at?: string
}

interface NotificationCenterProps {
  userId: string
  userType: 'user' | 'student' | 'coordinator'
  className?: string
}

const iconMap: Record<string, any> = {
  'calendar': Calendar,
  'check-circle': CheckCircle,
  'check-circle-2': CheckCheck,
  'clock': Clock,
  'file-text': FileText,
  'alert-triangle': AlertTriangle,
  'user-plus': User,
  'graduation-cap': Settings,
  'chart-bar': Info,
  'trophy': Zap,
  'calendar-plus': Calendar,
  'settings': Settings,
  'file-bar-chart': FileText,
  'default': Bell
}

const priorityColors = {
  'urgent': 'bg-red-500',
  'high': 'bg-orange-500',
  'medium': 'bg-blue-500',
  'low': 'bg-gray-500'
}

const typeLabels: Record<string, string> = {
  'appointment_scheduled': 'Agendamento',
  'appointment_confirmed': 'Confirmação',
  'appointment_reminder': 'Lembrete',
  'appointment_completed': 'Concluído',
  'document_required': 'Documentos',
  'training_assigned': 'Treinamento',
  'performance_report': 'Relatório',
  'system_maintenance': 'Manutenção',
  'achievement_earned': 'Conquista'
}

export default function NotificationCenter({ userId, userType, className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<any>({})
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  // Buscar notificações
  const fetchNotifications = async (status = 'all') => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/notifications?userId=${userId}&userType=${userType}&status=${status}&limit=50`
      )
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/notifications/stats?userId=${userId}&userType=${userType}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Marcar como lida
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read' })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, status: 'read', read_at: new Date().toISOString() }
              : n
          )
        )
        fetchStats() // Atualizar estatísticas
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como lidas
  const markAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => n.status === 'unread')
      .map(n => n.id)

    for (const id of unreadIds) {
      await markAsRead(id)
    }
  }

  // Arquivar notificação
  const archiveNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' })
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(n => n.id !== notificationId)
        )
        fetchStats()
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  // Deletar notificação
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(n => n.id !== notificationId)
        )
        fetchStats()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  useEffect(() => {
    fetchNotifications(activeTab)
    fetchStats()
  }, [userId, userType, activeTab])

  const unreadCount = stats?.summary?.unread || 0
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return n.status === 'unread'
    if (activeTab === 'urgent') return n.priority === 'urgent' || n.priority === 'high'
    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffHours < 1) {
      return 'Agora mesmo'
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR')
    }
  }

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || iconMap.default
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${className}`}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0" side="bottom" align="end">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notificações</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mx-4 mb-2">
                <TabsTrigger value="all" className="text-xs">
                  Todas ({stats?.summary?.total || 0})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Não lidas ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="urgent" className="text-xs">
                  Urgentes ({stats?.priority_breakdown?.urgent + stats?.priority_breakdown?.high || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="p-4 text-center text-gray-500">
                      Carregando...
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma notificação encontrada</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                            notification.status === 'unread' ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => notification.status === 'unread' && markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-full ${priorityColors[notification.priority]} text-white`}>
                              {getIcon(notification.icon || 'default')}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-1">
                                  <Badge variant="outline" className="text-xs">
                                    {typeLabels[notification.notification_type] || 'Geral'}
                                  </Badge>
                                  {notification.status === 'unread' && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.created_at)}
                                </span>

                                <div className="flex items-center space-x-1">
                                  {notification.action_url && (
                                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                                      {notification.action_label || 'Ver'}
                                    </Button>
                                  )}

                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      archiveNotification(notification.id)
                                    }}
                                  >
                                    <Archive className="h-3 w-3" />
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteNotification(notification.id)
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}