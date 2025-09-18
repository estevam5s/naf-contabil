import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Mock para simular chat funcionando
let mockChatData = {
  conversations: new Map(),
  messages: new Map()
}

// POST - Aceitar ou rejeitar chat com cliente (versão simplificada)
export async function POST(request: NextRequest) {
  try {
    const { conversation_id, coordinator_id, coordinator_name, action } = await request.json()

    if (!conversation_id || !coordinator_id || !action) {
      return NextResponse.json(
        { error: 'conversation_id, coordinator_id e action são obrigatórios' },
        { status: 400 }
      )
    }

    if (action === 'accept') {
      // Simular aceitar o chat
      const conversation = {
        id: conversation_id,
        chat_accepted_by: coordinator_id,
        chat_accepted_at: new Date().toISOString(),
        status: 'active_human',
        coordinator_id: coordinator_id,
        user_id: 'user-123',
        created_at: new Date().toISOString()
      }

      // Armazenar conversa mock
      mockChatData.conversations.set(conversation_id, conversation)

      // Adicionar mensagem mock
      const message = {
        id: Date.now().toString(),
        conversation_id,
        content: `👋 **${coordinator_name || 'Coordenador'} entrou no chat**\n\nOlá! Sou um especialista do NAF e estou aqui para ajudá-lo. Como posso ajudar você hoje?`,
        sender_type: 'coordinator',
        sender_id: coordinator_id,
        sender_name: coordinator_name || 'Coordenador',
        is_ai_response: false,
        is_read: true,
        created_at: new Date().toISOString()
      }

      if (!mockChatData.messages.has(conversation_id)) {
        mockChatData.messages.set(conversation_id, [])
      }
      mockChatData.messages.get(conversation_id)?.push(message)

      return NextResponse.json({
        success: true,
        conversation,
        message: 'Chat aceito com sucesso'
      })

    } else if (action === 'reject') {
      // Simular rejeitar o chat
      const conversation = {
        id: conversation_id,
        human_requested: false,
        human_request_timestamp: null,
        status: 'active',
        user_id: 'user-123',
        created_at: new Date().toISOString()
      }

      mockChatData.conversations.set(conversation_id, conversation)

      // Adicionar mensagem de rejeição
      const message = {
        id: Date.now().toString(),
        conversation_id,
        content: '😔 **Coordenadores indisponíveis no momento**\n\nInfelizmente nossos especialistas estão ocupados no momento. Você pode:\n\n• Continuar conversando comigo (assistente virtual)\n• Tentar novamente mais tarde\n• Ligar para (48) 98461-4449\n• Agendar um horário específico\n\nComo posso ajudá-lo agora?',
        sender_type: 'assistant',
        sender_name: 'Assistente NAF',
        is_ai_response: false,
        is_read: true,
        created_at: new Date().toISOString()
      }

      if (!mockChatData.messages.has(conversation_id)) {
        mockChatData.messages.set(conversation_id, [])
      }
      mockChatData.messages.get(conversation_id)?.push(message)

      return NextResponse.json({
        success: true,
        conversation,
        message: 'Chat rejeitado - retornou para modo AI'
      })

    } else {
      return NextResponse.json(
        { error: 'Ação inválida. Use "accept" ou "reject"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Erro ao processar ação do chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}