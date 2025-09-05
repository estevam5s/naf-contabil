'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  category?: string
  confidence?: number
  source?: string
}

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! 👋 Sou o assistente virtual do NAF. Posso ajudar você com dúvidas sobre:\n\n• MEI e DAS\n• Imposto de Renda\n• Cadastro de CPF/CNPJ\n• Certidões e Regularizações\n• Legislações Fiscais\n\nQual é sua dúvida?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: 'MEI', label: 'MEI', icon: '🏪' },
    { value: 'Imposto de Renda', label: 'Imposto de Renda', icon: '💰' },
    { value: 'Cadastros', label: 'Cadastros', icon: '📋' },
    { value: 'Certidões', label: 'Certidões', icon: '📄' },
    { value: 'Comércio Exterior', label: 'Comércio Exterior', icon: '🌐' },
    { value: 'Outros', label: 'Outros', icon: '❓' }
  ]

  const quickQuestions = [
    'Como emitir DAS do MEI?',
    'Preciso declarar IR?',
    'Como regularizar CPF?',
    'Emitir certidão negativa',
    'Cadastrar CNPJ'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim()
    if (!message) return

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      category: selectedCategory
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Chamar API de legislações
      const response = await fetch('/api/legislation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          category: selectedCategory || 'Outros'
        })
      })

      const data = await response.json()

      let botResponse = ''
      let confidence = 0
      let source = ''

      if (data.success) {
        botResponse = data.answer
        confidence = data.confidence || 0
        source = data.source || ''

        if (data.sourceUrl) {
          botResponse += `\n\n📎 **Fonte oficial:** [${data.title || 'Receita Federal'}](${data.sourceUrl})`
        }
      } else {
        botResponse = 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente ou entre em contato com nosso suporte.'
      }

      // Adicionar resposta do bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isUser: false,
        timestamp: new Date(),
        confidence,
        source
      }

      setMessages(prev => [...prev, botMessage])

      // Sugerir perguntas relacionadas se a confiança for baixa
      if (confidence < 0.5) {
        setTimeout(() => {
          const suggestionMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: 'Posso ajudar com algumas dessas dúvidas comuns:\n\n' + 
                    quickQuestions.map(q => `• ${q}`).join('\n'),
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, suggestionMessage])
        }, 1000)
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes.',
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const startNewConversation = () => {
    setMessages([{
      id: '1',
      content: 'Nova conversa iniciada! 🆕 Como posso ajudar você?',
      isUser: false,
      timestamp: new Date()
    }])
    setSelectedCategory('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardHeader className="border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <CardTitle className="text-lg">Assistente NAF</CardTitle>
                <p className="text-blue-100 text-sm">Orientações Fiscais e Contábeis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={startNewConversation}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                🆕 Nova Conversa
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Seletor de Categoria */}
        <div className="border-b p-3 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Categoria da sua dúvida:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                size="sm"
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
                className="text-xs"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Mensagens */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.confidence !== undefined && !message.isUser && (
                    <div className="flex items-center space-x-1">
                      {message.source && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {message.source === 'faq' ? 'FAQ' : 
                           message.source === 'legislation' ? 'Lei' : 'Padrão'}
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        message.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                        message.confidence > 0.5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round(message.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Pensando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Perguntas Rápidas */}
        <div className="border-t p-3 bg-gray-50">
          <p className="text-xs font-medium text-gray-600 mb-2">Perguntas frequentes:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                onClick={() => sendMessage(question)}
                className="text-xs"
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedCategory ? 
                `Faça sua pergunta sobre ${selectedCategory}...` : 
                "Digite sua dúvida sobre questões fiscais..."
              }
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={() => sendMessage()} 
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? '⏳' : '📤'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Selecione uma categoria acima para respostas mais precisas
          </p>
        </div>
      </Card>
    </div>
  )
}
