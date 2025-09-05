import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar dados para gerar notificações dinâmicas
    const [
      demandasPendentes,
      atendimentosAgendados,
      novosUsuarios,
      servicosAtivos
    ] = await Promise.all([
      prisma.demand.count({ where: { status: 'PENDING' } }),
      prisma.attendance.count({ 
        where: { 
          status: 'SCHEDULED',
          scheduledAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // próximos 7 dias
          }
        } 
      }),
      prisma.user.count({ 
        where: { 
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // últimas 24h
          }
        } 
      }),
      prisma.service.count()
    ])

    const notifications: Notification[] = []

    // Gerar notificações baseadas nos dados
    if (demandasPendentes > 0) {
      notifications.push({
        id: `demandas-${Date.now()}`,
        type: 'warning',
        title: 'Demandas pendentes',
        message: `${demandasPendentes} demanda${demandasPendentes > 1 ? 's' : ''} aguardando atendimento`,
        timestamp: new Date(),
        read: false,
        action: {
          label: 'Ver demandas',
          url: '/demands'
        }
      })
    }

    if (atendimentosAgendados > 0) {
      notifications.push({
        id: `agendamentos-${Date.now()}`,
        type: 'info',
        title: 'Atendimentos agendados',
        message: `${atendimentosAgendados} atendimento${atendimentosAgendados > 1 ? 's' : ''} agendado${atendimentosAgendados > 1 ? 's' : ''} para esta semana`,
        timestamp: new Date(),
        read: false,
        action: {
          label: 'Ver agenda',
          url: '/schedule'
        }
      })
    }

    if (novosUsuarios > 0) {
      notifications.push({
        id: `usuarios-${Date.now()}`,
        type: 'success',
        title: 'Novos cadastros',
        message: `${novosUsuarios} novo${novosUsuarios > 1 ? 's' : ''} usuário${novosUsuarios > 1 ? 's' : ''} cadastrado${novosUsuarios > 1 ? 's' : ''} hoje`,
        timestamp: new Date(),
        read: false,
        action: {
          label: 'Ver usuários',
          url: '/users'
        }
      })
    }

    // Notificação de sistema funcionando
    if (servicosAtivos > 0) {
      notifications.push({
        id: `sistema-${Date.now()}`,
        type: 'success',
        title: 'Sistema operacional',
        message: `${servicosAtivos} serviços ativos e funcionando corretamente`,
        timestamp: new Date(),
        read: false
      })
    }

    return NextResponse.json(notifications)

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { action, notificationId } = await request.json()

    if (action === 'markAsRead') {
      // Aqui você poderia salvar o estado da notificação no banco
      // Por enquanto, apenas retornamos sucesso
      return NextResponse.json({ success: true })
    }

    if (action === 'markAllAsRead') {
      // Marcar todas as notificações como lidas
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Ação não reconhecida' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erro ao processar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
