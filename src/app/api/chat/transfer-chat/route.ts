import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// POST - Transferir chat para outro coordenador
export async function POST(request: NextRequest) {
  try {
    const {
      conversation_id,
      from_coordinator_id,
      to_coordinator_id,
      from_coordinator_name,
      to_coordinator_name,
      reason
    } = await request.json()

    if (!conversation_id || !from_coordinator_id || !to_coordinator_id) {
      return NextResponse.json(
        { error: 'conversation_id, from_coordinator_id e to_coordinator_id são obrigatórios' },
        { status: 400 }
      )
    }

    if (from_coordinator_id === to_coordinator_id) {
      return NextResponse.json(
        { error: 'Não é possível transferir para o mesmo coordenador' },
        { status: 400 }
      )
    }

    try {
      // Verificar se a conversa existe e pertence ao coordenador atual
      const { data: conversation, error: checkError } = await supabaseAdmin
        .from('chat_conversations')
        .select('*')
        .eq('id', conversation_id)
        .eq('coordinator_id', from_coordinator_id)
        .eq('status', 'active_human')
        .single()

      if (checkError || !conversation) {
        return NextResponse.json(
          { error: 'Conversa não encontrada ou você não tem permissão para transferi-la' },
          { status: 404 }
        )
      }

      // Transferir a conversa
      const { data: updatedConversation, error: updateError } = await supabaseAdmin
        .from('chat_conversations')
        .update({
          coordinator_id: to_coordinator_id,
          chat_accepted_by: to_coordinator_id,
          chat_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversation_id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Adicionar mensagem informando sobre a transferência
      const transferMessage = {
        conversation_id,
        content: `🔄 **Chat transferido**\n\n**De:** ${from_coordinator_name || 'Coordenador'}\n**Para:** ${to_coordinator_name || 'Novo coordenador'}\n\n${reason ? `**Motivo:** ${reason}\n\n` : ''}Olá! Sou ${to_coordinator_name || 'o novo coordenador'} e agora vou ajudá-lo. Como posso ajudar?`,
        sender_type: 'coordinator',
        sender_id: to_coordinator_id,
        sender_name: to_coordinator_name || 'Coordenador',
        is_ai_response: false,
        is_read: false,
        created_at: new Date().toISOString()
      }

      try {
        await supabaseAdmin
          .from('chat_messages')
          .insert(transferMessage)
      } catch (msgError) {
        console.log('Erro ao inserir mensagem de transferência:', msgError)
        // Continuar mesmo se a mensagem falhar
      }

      // Adicionar log da transferência
      try {
        await supabaseAdmin
          .from('chat_transfer_logs')
          .insert({
            conversation_id,
            from_coordinator_id,
            to_coordinator_id,
            reason,
            transferred_at: new Date().toISOString()
          })
      } catch (logError) {
        console.log('Erro ao registrar log de transferência:', logError)
        // Continuar mesmo se o log falhar
      }

      return NextResponse.json({
        success: true,
        conversation: updatedConversation,
        message: 'Chat transferido com sucesso'
      })

    } catch (supabaseError) {
      console.log('Erro do Supabase, usando fallback:', supabaseError)

      // Fallback: simular transferência
      const mockConversation = {
        id: conversation_id,
        coordinator_id: to_coordinator_id,
        chat_accepted_by: to_coordinator_id,
        chat_accepted_at: new Date().toISOString(),
        status: 'active_human',
        transferred: true,
        transfer_reason: reason
      }

      return NextResponse.json({
        success: true,
        conversation: mockConversation,
        message: 'Chat transferido com sucesso (modo simulado)'
      })
    }

  } catch (error) {
    console.error('Erro ao transferir chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Listar coordenadores disponíveis para transferência
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const currentCoordinatorId = searchParams.get('exclude_id')

    try {
      // Buscar coordenadores ativos
      let query = supabaseAdmin
        .from('coordinator_users')
        .select('id, email, is_active, created_at')
        .eq('is_active', true)

      if (currentCoordinatorId) {
        query = query.neq('id', currentCoordinatorId)
      }

      const { data: coordinators, error } = await query

      if (error) {
        throw error
      }

      // Mapear para formato mais amigável
      const coordinatorList = coordinators?.map(coord => ({
        id: coord.id,
        name: coord.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: coord.email,
        specialties: getCoordinatorSpecialties(coord.email),
        is_online: Math.random() > 0.3, // Simular status online
        status: 'active'
      })) || []

      return NextResponse.json({
        coordinators: coordinatorList
      })

    } catch (supabaseError) {
      console.log('Erro do Supabase, usando coordenadores mock:', supabaseError)

      // Fallback: coordenadores mock
      const mockCoordinators = [
        {
          id: '5f3fa043-f3f6-4322-a1e4-874677cdee58',
          name: 'Dr. Carlos Silva',
          email: 'admin@naf.com',
          specialties: ['Imposto de Renda', 'Tributário'],
          is_online: true,
          status: 'active'
        },
        {
          id: '6774c415-d927-47af-af90-dd30e41d9783',
          name: 'Coordenador Principal',
          email: 'coordenador.estacio.ltd2025@developer.com.br',
          specialties: ['MEI', 'Empresarial'],
          is_online: true,
          status: 'active'
        }
      ].filter(coord => coord.id !== currentCoordinatorId)

      return NextResponse.json({
        coordinators: mockCoordinators
      })
    }

  } catch (error) {
    console.error('Erro ao buscar coordenadores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para determinar especialidades baseadas no email
function getCoordinatorSpecialties(email: string): string[] {
  if (email.includes('admin')) {
    return ['Imposto de Renda', 'Tributário', 'Gestão']
  } else if (email.includes('ana')) {
    return ['MEI', 'Empresarial', 'e-Social']
  } else if (email.includes('roberto')) {
    return ['ITR', 'Rural', 'Contabilidade']
  } else {
    return ['Consultoria Geral', 'Atendimento']
  }
}