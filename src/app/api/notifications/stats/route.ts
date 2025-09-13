import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET - Estatísticas de notificações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userType = searchParams.get('userType')

    if (!userId || !userType) {
      return NextResponse.json({
        error: 'userId e userType são obrigatórios'
      }, { status: 400 })
    }

    // Buscar estatísticas básicas
    const { data: stats, error: statsError } = await supabase
      .from('notifications')
      .select('status, priority, notification_type, created_at')
      .eq('recipient_id', userId)
      .eq('recipient_type', userType)

    if (statsError) {
      console.error('Error fetching stats:', statsError)
      return NextResponse.json({
        error: 'Erro ao buscar estatísticas'
      }, { status: 500 })
    }

    // Processar estatísticas
    const totalNotifications = stats?.length || 0
    const unreadCount = stats?.filter(n => n.status === 'unread').length || 0
    const readCount = stats?.filter(n => n.status === 'read').length || 0
    const archivedCount = stats?.filter(n => n.status === 'archived').length || 0

    // Contar por prioridade
    const priorityStats = {
      urgent: stats?.filter(n => n.priority === 'urgent').length || 0,
      high: stats?.filter(n => n.priority === 'high').length || 0,
      medium: stats?.filter(n => n.priority === 'medium').length || 0,
      low: stats?.filter(n => n.priority === 'low').length || 0
    }

    // Contar por tipo
    const typeStats: Record<string, number> = {}
    stats?.forEach(notification => {
      const type = notification.notification_type
      typeStats[type] = (typeStats[type] || 0) + 1
    })

    // Notificações das últimas 24h
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recent = stats?.filter(n => n.created_at >= last24h).length || 0

    // Notificações da última semana
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const weeklyCount = stats?.filter(n => n.created_at >= lastWeek).length || 0

    return NextResponse.json({
      summary: {
        total: totalNotifications,
        unread: unreadCount,
        read: readCount,
        archived: archivedCount,
        recent_24h: recent,
        weekly: weeklyCount
      },
      priority_breakdown: priorityStats,
      type_breakdown: typeStats,
      engagement: {
        read_rate: totalNotifications > 0 ? Math.round((readCount / totalNotifications) * 100) : 0,
        unread_percentage: totalNotifications > 0 ? Math.round((unreadCount / totalNotifications) * 100) : 0
      }
    })

  } catch (error) {
    console.error('Error in notifications stats GET:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}