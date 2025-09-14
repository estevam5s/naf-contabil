import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Aceitar ou rejeitar chat com cliente
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
      // Aceitar o chat
      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .update({
          chat_accepted_by: coordinator_id,
          chat_accepted_at: new Date().toISOString(),
          status: 'active_human',
          coordinator_id: coordinator_id
        })
        .eq('id', conversation_id)
        .eq('human_requested', true)
        .is('chat_accepted_by', null)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Este chat já foi aceito por outro coordenador ou não está disponível' },
            { status: 409 }
          )
        }
        throw error
      }

      // Adicionar mensagem informando que o coordenador entrou no chat
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id,
          content: `👋 **${coordinator_name || 'Coordenador'} entrou no chat**\n\nOlá! Sou um especialista do NAF e estou aqui para ajudá-lo. Como posso ajudar você hoje?`,
          sender_type: 'coordinator',
          sender_id: coordinator_id,
          sender_name: coordinator_name || 'Coordenador',
          is_ai_response: false,
          is_read: true
        })

      if (msgError) throw msgError

      return NextResponse.json({
        success: true,
        conversation,
        message: 'Chat aceito com sucesso'
      })

    } else if (action === 'reject') {
      // Rejeitar o chat (voltar para modo AI)
      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .update({
          human_requested: false,
          human_request_timestamp: null,
          status: 'active'
        })
        .eq('id', conversation_id)
        .eq('human_requested', true)
        .is('chat_accepted_by', null)
        .select()
        .single()

      if (error) throw error

      // Adicionar mensagem informando que não há coordenadores disponíveis
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id,
          content: '😔 **Coordenadores indisponíveis no momento**\n\nInfelizmente nossos especialistas estão ocupados no momento. Você pode:\n\n• Continuar conversando comigo (assistente virtual)\n• Tentar novamente mais tarde\n• Ligar para (48) 98461-4449\n• Agendar um horário específico\n\nComo posso ajudá-lo agora?',
          sender_type: 'assistant',
          sender_name: 'Assistente NAF',
          is_ai_response: false,
          is_read: true
        })

      if (msgError) throw msgError

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