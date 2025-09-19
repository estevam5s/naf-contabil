import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET - Buscar notificações para um coordenador
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coordinatorId = searchParams.get('coordinator_id')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!coordinatorId) {
      return NextResponse.json(
        { error: 'coordinator_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar notificações recentes
    const notifications = []

    try {
      // 1. Novas solicitações de chat pendentes
      const { data: pendingChats } = await supabaseAdmin
        .from('chat_conversations')
        .select('id, user_name, user_email, human_request_timestamp, created_at')
        .eq('human_requested', true)
        .is('chat_accepted_by', null)
        .eq('status', 'waiting_human')
        .order('human_request_timestamp', { ascending: false })
        .limit(10)

      if (pendingChats) {
        pendingChats.forEach(chat => {
          notifications.push({
            id: `chat_request_${chat.id}`,
            type: 'chat_request',
            title: 'Nova solicitação de chat',
            message: `${chat.user_name || 'Cliente'} está aguardando atendimento`,
            timestamp: chat.human_request_timestamp || chat.created_at,
            urgency: getUrgencyLevel(chat.human_request_timestamp || chat.created_at),
            data: {
              conversation_id: chat.id,
              user_name: chat.user_name,
              user_email: chat.user_email
            }
          })
        })
      }

      // 2. Mensagens não lidas em chats ativos do coordenador
      const { data: activeChats } = await supabaseAdmin
        .from('chat_conversations')
        .select(`
          id, user_name, user_email,
          messages:chat_messages(id, content, created_at, sender_type, is_read)
        `)
        .eq('coordinator_id', coordinatorId)
        .eq('status', 'active_human')
        .order('updated_at', { ascending: false })
        .limit(5)

      if (activeChats) {
        activeChats.forEach(chat => {
          const unreadMessages = chat.messages?.filter(
            msg => msg.sender_type === 'user' && !msg.is_read
          ) || []

          if (unreadMessages.length > 0) {
            const lastMessage = unreadMessages[unreadMessages.length - 1]
            notifications.push({
              id: `unread_messages_${chat.id}`,
              type: 'unread_messages',
              title: 'Mensagens não lidas',
              message: `${unreadMessages.length} mensagem(ns) de ${chat.user_name || 'Cliente'}`,
              timestamp: lastMessage.created_at,
              urgency: 'medium',
              data: {
                conversation_id: chat.id,
                user_name: chat.user_name,
                unread_count: unreadMessages.length,
                last_message: lastMessage.content.substring(0, 50) + '...'
              }
            })
          }
        })
      }

    } catch (supabaseError) {
      console.error('Erro ao buscar dados do Supabase:', supabaseError)
      // Retorna array vazio se houver erro - sem fallback mock
    }

    // Ordenar por timestamp e limitar
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const limitedNotifications = notifications.slice(0, limit)

    return NextResponse.json({
      notifications: limitedNotifications,
      total: notifications.length,
      unread_count: limitedNotifications.filter(n => n.urgency === 'high').length
    })

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Marcar notificação como lida
export async function POST(request: NextRequest) {
  try {
    const { notification_id, coordinator_id } = await request.json()

    if (!notification_id || !coordinator_id) {
      return NextResponse.json(
        { error: 'notification_id e coordinator_id são obrigatórios' },
        { status: 400 }
      )
    }

    // Para notificações de mensagens, marcar mensagens como lidas
    if (notification_id.startsWith('unread_messages_')) {
      const conversationId = notification_id.replace('unread_messages_', '')

      try {
        await supabaseAdmin
          .from('chat_messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'user')
          .eq('is_read', false)
      } catch (error) {
        console.error('Erro ao marcar mensagens como lidas:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notificação marcada como lida'
    })

  } catch (error) {
    console.error('Erro ao marcar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para determinar urgência baseada no tempo
function getUrgencyLevel(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMinutes = (now.getTime() - time.getTime()) / (1000 * 60)

  if (diffMinutes > 15) return 'high'
  if (diffMinutes > 5) return 'medium'
  return 'low'
}