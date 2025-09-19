'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Clock,
  Search,
  Phone,
  RefreshCw,
  Circle,
  Check,
  X,
  UserCheck,
  AlertCircle,
  Star,
  Users,
  ArrowRightLeft,
  Bell,
  BellRing,
  Volume2,
  VolumeX
} from 'lucide-react'

interface Message {
  id: string
  content: string
  sender_type: 'user' | 'assistant' | 'coordinator'
  sender_name?: string
  is_ai_response?: boolean
  created_at: string
  is_read?: boolean
}

interface Conversation {
  id: string
  user_id: string
  user_name?: string
  user_email?: string
  status: string
  is_online?: boolean
  unread_count?: number
  human_requested?: boolean
  human_request_timestamp?: string
  coordinator_id?: string
  last_message?: Message
  messages?: Message[]
}

interface Coordinator {
  id: string
  name: string
  email: string
  specialties: string[]
  is_online: boolean
  status: string
}

interface Props {
  coordinatorId: string
  coordinatorName: string
}

export default function CoordinatorInterface({ coordinatorId, coordinatorName }: Props) {
  // Estados para solicitações pendentes
  const [pendingRequests, setPendingRequests] = useState<Conversation[]>([])
  const [selectedRequest, setSelectedRequest] = useState<Conversation | null>(null)

  // Estados para chat ativo
  const [activeChat, setActiveChat] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Estados para notificações
  const [notifications, setNotifications] = useState<any[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [totalPendingCount, setTotalPendingCount] = useState(0)

  // Estados para transferência
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [availableCoordinators, setAvailableCoordinators] = useState<Coordinator[]>([])
  const [selectedCoordinator, setSelectedCoordinator] = useState('')
  const [transferReason, setTransferReason] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const notificationAudioRef = useRef<HTMLAudioElement>(null)

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Carregar solicitações pendentes
  const loadPendingRequests = async () => {
    try {
      const response = await fetch(`/api/chat/human-request?coordinator_id=${coordinatorId}`)
      const data = await response.json()
      if (data.pendingRequests) {
        setPendingRequests(data.pendingRequests)
        setTotalPendingCount(data.pendingRequests.length)
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    }
  }

  // Carregar mensagens de uma conversa
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  // Aceitar solicitação de chat
  const acceptChatRequest = async (conversation: Conversation) => {
    try {
      const response = await fetch('/api/chat/accept-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          coordinator_id: coordinatorId,
          coordinator_name: coordinatorName,
          action: 'accept'
        })
      })

      const data = await response.json()
      if (data.success) {
        setActiveChat(conversation)
        setSelectedRequest(null)
        await loadMessages(conversation.id)
        await loadPendingRequests() // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao aceitar chat:', error)
    }
  }

  // Rejeitar solicitação de chat
  const rejectChatRequest = async (conversation: Conversation) => {
    try {
      const response = await fetch('/api/chat/accept-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          coordinator_id: coordinatorId,
          coordinator_name: coordinatorName,
          action: 'reject'
        })
      })

      const data = await response.json()
      if (data.success) {
        await loadPendingRequests() // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao rejeitar chat:', error)
    }
  }

  // Enviar mensagem
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !activeChat) return

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: inputValue,
      sender_type: 'coordinator',
      sender_name: coordinatorName,
      is_ai_response: false,
      created_at: new Date().toISOString(),
      is_read: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: activeChat.id,
          content: userMessage.content,
          sender_type: 'coordinator',
          sender_id: coordinatorId,
          sender_name: coordinatorName,
          is_ai_response: false
        })
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Finalizar chat
  const endChat = async () => {
    if (!activeChat) return

    try {
      const response = await fetch('/api/chat/end-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: activeChat.id,
          ended_by: 'coordinator',
          coordinator_id: coordinatorId,
          coordinator_name: coordinatorName
        })
      })

      if (response.ok) {
        setActiveChat(null)
        setMessages([])
      }
    } catch (error) {
      console.error('Erro ao finalizar chat:', error)
    }
  }

  // Carregar coordenadores disponíveis para transferência
  const loadAvailableCoordinators = async () => {
    try {
      const response = await fetch(`/api/chat/transfer-chat?exclude_id=${coordinatorId}`)
      const data = await response.json()
      if (data.coordinators) {
        setAvailableCoordinators(data.coordinators)
      }
    } catch (error) {
      console.error('Erro ao carregar coordenadores:', error)
    }
  }

  // Transferir chat
  const transferChat = async () => {
    if (!activeChat || !selectedCoordinator) return

    try {
      const targetCoordinator = availableCoordinators.find(c => c.id === selectedCoordinator)

      const response = await fetch('/api/chat/transfer-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: activeChat.id,
          from_coordinator_id: coordinatorId,
          to_coordinator_id: selectedCoordinator,
          from_coordinator_name: coordinatorName,
          to_coordinator_name: targetCoordinator?.name,
          reason: transferReason
        })
      })

      if (response.ok) {
        setActiveChat(null)
        setShowTransferDialog(false)
        setTransferReason('')
        setSelectedCoordinator('')
        await loadPendingRequests()
      }
    } catch (error) {
      console.error('Erro ao transferir chat:', error)
    }
  }

  // Carregar coordenadores quando dialog abrir
  useEffect(() => {
    if (showTransferDialog) {
      loadAvailableCoordinators()
    }
  }, [showTransferDialog])

  // Configurar notificações em tempo real
  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/notifications?coordinator_id=${coordinatorId}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'pending_chat_request' || data.type === 'new_chat_request') {
          setNotifications(prev => [data, ...prev.slice(0, 9)]) // Manter só 10 notificações

          // Tocar som se habilitado
          if (soundEnabled && notificationAudioRef.current) {
            notificationAudioRef.current.play().catch(console.error)
          }

          // Recarregar solicitações pendentes
          loadPendingRequests()
        }
      } catch (error) {
        console.error('Erro ao processar notificação:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Erro nas notificações:', error)
    }

    return () => {
      eventSource.close()
    }
  }, [coordinatorId, soundEnabled])

  // Carregar dados iniciais
  useEffect(() => {
    loadPendingRequests()
  }, [coordinatorId])

  // Função para calcular tempo de espera
  const getWaitingTime = (timestamp: string) => {
    const now = new Date()
    const requested = new Date(timestamp)
    const diffMs = now.getTime() - requested.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 1) return 'agora mesmo'
    if (diffMinutes === 1) return '1 minuto'
    if (diffMinutes < 60) return `${diffMinutes} minutos`

    const hours = Math.floor(diffMinutes / 60)
    const remainingMinutes = diffMinutes % 60

    if (hours === 1 && remainingMinutes === 0) return '1 hora'
    if (hours === 1) return `1h ${remainingMinutes}min`
    if (remainingMinutes === 0) return `${hours} horas`
    return `${hours}h ${remainingMinutes}min`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      {/* LADO ESQUERDO - Solicitações Pendentes */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Solicitações Pendentes
              {totalPendingCount > 0 && (
                <Badge variant="destructive">{totalPendingCount}</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPendingRequests}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma solicitação pendente</p>
                <p className="text-sm">As novas solicitações aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                      selectedRequest?.id === request.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{request.user_name || 'Cliente'}</h4>
                            <p className="text-xs text-gray-500">{request.user_email}</p>
                          </div>
                        </div>

                        {request.last_message && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {request.last_message.content}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600">
                              Aguardando há {getWaitingTime(request.human_request_timestamp || request.created_at)}
                            </span>
                          </div>
                          {request.unread_count && request.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {request.unread_count} não lida{request.unread_count > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedRequest?.id === request.id && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            acceptChatRequest(request)
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            rejectChatRequest(request)
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* LADO DIREITO - Chat Ativo */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {activeChat ? (
                <span>Chat com {activeChat.user_name || 'Cliente'}</span>
              ) : (
                <span>Selecione uma solicitação</span>
              )}
            </CardTitle>
            {activeChat && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTransferDialog(true)}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Transferir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={endChat}
                >
                  Finalizar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        {activeChat ? (
          <>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'coordinator' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender_type === 'coordinator'
                            ? 'bg-blue-600 text-white'
                            : message.sender_type === 'user'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-green-100 text-green-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender_type === 'coordinator' ? (
                            <UserCheck className="h-3 w-3" />
                          ) : message.sender_type === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.sender_name || message.sender_type}
                          </span>
                        </div>

                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>

                        <div className="text-xs opacity-50 mt-2">
                          {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">Enviando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum chat ativo</h3>
              <p>Selecione uma solicitação pendente à esquerda para iniciar o atendimento</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dialog de Transferência */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Coordenador de destino:</label>
              <Select value={selectedCoordinator} onValueChange={setSelectedCoordinator}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um coordenador" />
                </SelectTrigger>
                <SelectContent>
                  {availableCoordinators.map((coordinator) => (
                    <SelectItem key={coordinator.id} value={coordinator.id}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${coordinator.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span>{coordinator.name}</span>
                        <span className="text-xs text-gray-500">({coordinator.specialties.join(', ')})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Motivo da transferência (opcional):</label>
              <Textarea
                value={transferReason}
                onChange={(e) => setTransferReason(e.target.value)}
                placeholder="Ex: Especialização em MEI, melhor disponibilidade..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTransferDialog(false)
                  setTransferReason('')
                  setSelectedCoordinator('')
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={transferChat}
                disabled={!selectedCoordinator}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Transferir Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audio para notificações */}
      <audio ref={notificationAudioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwmmgfCDBrxPDCaiIDF0PV8N5QQAoTV6jn77BdGQhDo+LvlkshBjWQ3/LNeSsFJXfH8N2QQAoUXrTp66hVFApGn+DwmmgfCDBrxPDCaiIDF0PV8N5QQAoTNwgZaLvt559NEAxQp+Puu2EcBjqe2O7IsWgfCTBvyOvObiEIRzLhub+dRgwZaL3uxKc0CwAA" type="audio/wav" />
      </audio>
    </div>
  )
}