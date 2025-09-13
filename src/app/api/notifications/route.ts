import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Buscar notificações do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')
    const status = searchParams.get('status') // unread, read, all
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId || !userType) {
      return NextResponse.json({
        error: 'userId e userType são obrigatórios'
      }, { status: 400 })
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .eq('recipient_type', userType)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por status se especificado
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filtrar notificações não expiradas
    query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

    const { data: notifications, error } = await query

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({
        error: 'Erro ao buscar notificações'
      }, { status: 500 })
    }

    // Buscar contagem total para paginação
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('recipient_type', userType)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())

    return NextResponse.json({
      notifications: notifications || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('Error in notifications GET:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// POST - Criar nova notificação
export async function POST(request: NextRequest) {
  try {
    const {
      recipientId,
      recipientType,
      title,
      message,
      notificationType,
      priority = 'medium',
      icon,
      color,
      actionUrl,
      actionLabel,
      metadata = {},
      sendEmail = false,
      isPersistent = false,
      expiresHours
    } = await request.json()

    if (!recipientId || !recipientType || !title || !message || !notificationType) {
      return NextResponse.json({
        error: 'Campos obrigatórios: recipientId, recipientType, title, message, notificationType'
      }, { status: 400 })
    }

    const expiresAt = expiresHours
      ? new Date(Date.now() + expiresHours * 60 * 60 * 1000).toISOString()
      : null

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        recipient_type: recipientType,
        title,
        message,
        notification_type: notificationType,
        priority,
        icon,
        color,
        action_url: actionUrl,
        action_label: actionLabel,
        metadata,
        send_email: sendEmail,
        is_persistent: isPersistent,
        expires_at: expiresAt
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notification:', error)
      return NextResponse.json({
        error: 'Erro ao criar notificação'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notificação criada com sucesso',
      notification: data
    }, { status: 201 })

  } catch (error) {
    console.error('Error in notifications POST:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}