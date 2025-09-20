'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  RefreshCw,
  Phone,
  Calendar
} from 'lucide-react'

// Função para gerar UUID simples
const generateId = () => {
  return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

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
  status: string
  is_online?: boolean
  unread_count?: number
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId] = useState(() => `user_${generateId()}`)
  const [requestHumanAgent, setRequestHumanAgent] = useState(false)
  const [chatStatus, setChatStatus] = useState<'ai' | 'waiting_human' | 'active_human' | 'ended'>('ai')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !conversation) {
      initializeConversation()
    }
  }, [isOpen])

  const initializeConversation = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          user_name: 'Visitante',
          user_email: null
        })
      })

      const data = await response.json()
      if (data.conversation) {
        setConversation(data.conversation)
        // Enviar mensagem de boas-vindas
        await sendWelcomeMessage(data.conversation.id)
      }
    } catch (error) {
      console.error('Erro ao inicializar conversa:', error)
    }
  }

  const sendWelcomeMessage = async (conversationId: string) => {
    const welcomeMessage = `👋 **Olá! Bem-vindo ao NAF Estácio Florianópolis!**

Sou seu assistente virtual e estou aqui para ajudar com suas dúvidas sobre:

• **📊 Declaração de Imposto de Renda**
• **🏢 Formalização MEI e CNPJ**
• **💼 Consultoria fiscal básica**
• **📈 Planejamento tributário**
• **📋 Orientação contábil**
• **🎯 Serviços empresariais**

Como posso ajudar você hoje?

---
💡 *Dica: Se precisar de atendimento personalizado, clique em "Falar com especialista" ou digite sua solicitação!*`

    const message: Message = {
      id: generateId(),
      content: welcomeMessage,
      sender_type: 'assistant',
      sender_name: 'Assistente NAF',
      is_ai_response: true,
      created_at: new Date().toISOString(),
      is_read: true
    }

    setMessages([message])

    // Salvar no banco
    await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        content: welcomeMessage,
        sender_type: 'assistant',
        sender_name: 'Assistente NAF',
        is_ai_response: true
      })
    })
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !conversation) return

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      sender_type: 'user',
      sender_name: 'Você',
      created_at: new Date().toISOString(),
      is_read: true
    }

    const messageToSend = inputValue
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Salvar mensagem do usuário
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          content: userMessage.content,
          sender_type: 'user',
          sender_id: userId,
          sender_name: 'Usuário'
        })
      })

      // Verificar status da conversa para determinar se deve responder com IA
      if (chatStatus === 'active_human' || chatStatus === 'ended') {
        // Se o chat está com humano ou finalizado, não buscar resposta da IA
        return
      }

      // Se solicitou agente humano apenas em modo AI, marcar flag
      if (chatStatus === 'ai') {
        const messageContent = messageToSend.toLowerCase()
        const wantsHuman = messageContent.includes('falar com') ||
                           messageContent.includes('agente') ||
                           messageContent.includes('atendente') ||
                           messageContent.includes('pessoa') ||
                           messageContent.includes('humano') ||
                           messageContent.includes('especialista')

        if (wantsHuman) {
          await requestHumanSupport()
          return
        }
      }

      // Buscar resposta da IA apenas se ainda estiver em modo AI
      const aiResponse = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          message: messageToSend
        })
      })

      if (!aiResponse.ok) {
        throw new Error(`HTTP error! status: ${aiResponse.status}`)
      }

      const aiData = await aiResponse.json()

      const assistantMessage: Message = {
        id: generateId(),
        content: aiData.response,
        sender_type: 'assistant',
        sender_name: 'Assistente NAF',
        is_ai_response: true,
        created_at: new Date().toISOString(),
        is_read: true
      }

      setMessages(prev => [...prev, assistantMessage])

      // Salvar resposta da IA
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          content: assistantMessage.content,
          sender_type: 'assistant',
          sender_name: 'Assistente NAF',
          is_ai_response: true
        })
      })

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      const errorMessage: Message = {
        id: generateId(),
        content: '🚨 **Erro Temporário**\n\nDesculpe, ocorreu um erro temporário. Tente:\n\n• Enviar novamente sua mensagem\n• Atualizar a página\n• Entrar em contato: (48) 98461-4449\n\n*Nossa equipe está trabalhando para resolver o problema.*',
        sender_type: 'assistant',
        sender_name: 'Sistema NAF',
        created_at: new Date().toISOString(),
        is_read: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const requestHumanSupport = async () => {
    if (!conversation) return

    try {
      const response = await fetch('/api/chat/human-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          user_id: userId
        })
      })

      const data = await response.json()
      if (data.success) {
        setRequestHumanAgent(true)
        setChatStatus('waiting_human')

        const humanRequestMessage: Message = {
          id: generateId(),
          content: `🤝 **Solicitação Enviada!**

Sua solicitação de atendimento humano foi enviada aos nossos coordenadores.

⏳ **Status:** Aguardando especialista

📞 **Alternativas:**
• Telefone: (48) 98461-4449
• Horário: Segunda a Sexta, 8h às 18h

Em breve um especialista entrará neste chat para ajudá-lo!`,
          sender_type: 'assistant',
          sender_name: 'Sistema NAF',
          is_ai_response: false,
          created_at: new Date().toISOString(),
          is_read: true
        }

        setMessages(prev => [...prev, humanRequestMessage])
      }
    } catch (error) {
      console.error('Erro ao solicitar atendimento humano:', error)
    }
  }

  const submitFeedback = async (rating: number, comment?: string) => {
    if (!conversation) return

    try {
      const response = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversation.id,
          user_id: userId,
          rating,
          feedback_text: comment,
          coordinator_id: conversation.coordinator_id
        })
      })

      const data = await response.json()
      if (data.success) {
        setShowFeedback(false)
        // Recarregar mensagens para mostrar agradecimento
        setTimeout(() => {
          if (conversation) {
            loadMessages(conversation.id)
          }
        }, 500)
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`)
      const data = await response.json()
      if (data.messages) {
        const currentMessagesLength = messages.length
        const newMessagesLength = data.messages.length

        // Só atualizar se houver mudanças para evitar re-renders desnecessários
        if (newMessagesLength !== currentMessagesLength ||
            JSON.stringify(messages) !== JSON.stringify(data.messages)) {
          setMessages(data.messages)
        }

        // Verificar se há mensagens de coordenador
        const hasCoordinatorMessages = data.messages.some(
          (msg: Message) => msg.sender_type === 'coordinator'
        )

        if (hasCoordinatorMessages && chatStatus !== 'active_human' && chatStatus !== 'ended') {
          setChatStatus('active_human')
          setRequestHumanAgent(false)
        }

        // Verificar se o chat foi finalizado
        const hasFinalMessage = data.messages.some(
          (msg: Message) => msg.content.includes('Chat finalizado') || msg.content.includes('**Por favor, avalie nosso atendimento:**')
        )

        if (hasFinalMessage && chatStatus !== 'ended') {
          setChatStatus('ended')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    }
  }

  const checkConversationStatus = async () => {
    if (!conversation) return

    try {
      const response = await fetch(`/api/chat/conversations?user_id=${userId}`)
      const data = await response.json()
      if (data.conversation) {
        const conv = data.conversation

        // Atualizar status baseado no status da conversa
        if (conv.status === 'ended' && chatStatus !== 'ended') {
          setChatStatus('ended')
        } else if (conv.status === 'active_human' && chatStatus !== 'active_human') {
          setChatStatus('active_human')
          setRequestHumanAgent(false)
        } else if (conv.chat_accepted_by && conv.coordinator_id && chatStatus !== 'active_human') {
          // Se foi aceito por um coordenador, considerar como ativo mesmo que status não esteja atualizado
          setChatStatus('active_human')
          setRequestHumanAgent(false)
        } else if (conv.status === 'waiting_human' && chatStatus !== 'waiting_human' && !conv.chat_accepted_by) {
          // Só mostrar como waiting se realmente não foi aceito por ninguém
          setChatStatus('waiting_human')
        }

        // Sempre carrega mensagens para pegar novas mensagens do coordenador
        loadMessages(conversation.id)
      }
    } catch (error) {
      console.error('Erro ao verificar status da conversa:', error)
    }
  }

  // Polling para verificar mudanças de status e novas mensagens
  useEffect(() => {
    if (!conversation) return

    const interval = setInterval(() => {
      if (chatStatus === 'ai') {
        // Verificar apenas status quando em modo AI
        checkConversationStatus()
      } else {
        // Verificar mensagens e status quando em chat humano
        checkConversationStatus()
      }
    }, 2000) // Reduzido para 2 segundos para melhor responsividade

    return () => clearInterval(interval)
  }, [conversation, chatStatus])

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`w-[480px] max-w-[95vw] shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[650px] max-h-[85vh]'
        }`}>
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Chat NAF</CardTitle>
                  <p className="text-xs opacity-90">
                    {requestHumanAgent ? 'Aguardando especialista...' : 'Assistente Virtual'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isMinimized ? maximizeChat : minimizeChat}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-8 w-8 p-0 hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[570px] max-h-[calc(85vh-80px)]">
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.sender_type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.sender_type === 'coordinator'
                            ? 'bg-green-100 text-green-900 border border-green-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender_type === 'user' ? (
                            <User className="h-3 w-3" />
                          ) : message.sender_type === 'coordinator' ? (
                            <User className="h-3 w-3 text-green-600" />
                          ) : (
                            <Bot className="h-3 w-3 text-blue-600" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.sender_name}
                          </span>
                          {message.sender_type === 'coordinator' && (
                            <Badge variant="outline" className="text-xs">
                              Especialista
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-50 mt-1">
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
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">Digitando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={isLoading || chatStatus === 'ended'}
                  />
                  {chatStatus !== 'ended' && (
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex flex-wrap gap-2">
                    {chatStatus === 'ai' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={requestHumanSupport}
                        className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Falar com especialista
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => window.open('tel:+5548984614449')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      (48) 98461-4449
                    </Button>
                    {chatStatus !== 'active_human' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                        onClick={() => window.open('/agendamento', '_blank')}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Agendar presencial
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {chatStatus === 'waiting_human' && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600">
                        Aguardando especialista
                      </Badge>
                    )}
                    {chatStatus === 'active_human' && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-600">
                        Especialista online
                      </Badge>
                    )}
                    {chatStatus === 'ended' && (
                      <Button
                        size="sm"
                        onClick={() => setShowFeedback(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        ⭐ Avaliar atendimento
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Modal de Feedback */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Avalie nosso atendimento</h3>
            <p className="text-gray-600 mb-4">Como você avalia o atendimento recebido?</p>

            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ⭐
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFeedback(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => submitFeedback(feedbackRating)}
                disabled={feedbackRating === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Enviar Avaliação
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}