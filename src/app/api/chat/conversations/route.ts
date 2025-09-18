import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Buscar conversas (para coordenador)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coordinatorId = searchParams.get('coordinator_id')
    const userId = searchParams.get('user_id')

    if (coordinatorId) {
      // Coordenador buscando todas as conversas
      const { data: conversations, error } = await supabaseAdmin
        .from('chat_conversations')
        .select(`
          *,
          messages:chat_messages(
            id,
            content,
            sender_type,
            created_at,
            is_read
          )
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Calcular mensagens não lidas para cada conversa
      const conversationsWithUnread = conversations?.map(conv => {
        const unreadCount = conv.messages?.filter(
          (msg: any) => msg.sender_type === 'user' && !msg.is_read
        ).length || 0

        return {
          ...conv,
          unread_count: unreadCount,
          last_message: conv.messages?.[0] || null
        }
      }) || []

      return NextResponse.json({ conversations: conversationsWithUnread })
    }

    if (userId) {
      // Usuário buscando sua conversa
      const { data: conversation, error } = await supabaseAdmin
        .from('chat_conversations')
        .select(`
          *,
          messages:chat_messages(*)
        `)
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return NextResponse.json({ conversation })
    }

    return NextResponse.json(
      { error: 'Parâmetros inválidos' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao buscar conversas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova conversa
export async function POST(request: NextRequest) {
  try {
    const { user_id, user_name, user_email } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma conversa para este usuário
    const { data: existingConv } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (existingConv) {
      return NextResponse.json({ conversation: existingConv })
    }

    // Criar nova conversa
    const { data: conversation, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert({
        user_id,
        user_name: user_name || 'Usuário',
        user_email,
        status: 'active',
        is_online: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ conversation })

  } catch (error) {
    console.error('Erro ao criar conversa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}