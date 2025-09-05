import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Forçar rota dinâmica
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'general'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = searchParams.get('format') || 'json'

    let dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    let whereClause: any = {}
    if (Object.keys(dateFilter).length > 0) {
      whereClause.createdAt = dateFilter
    }

    // Filtros baseados no role do usuário
    if (session.user.role === 'STUDENT') {
      whereClause.userId = session.user.id
    }

    switch (type) {
      case 'attendances': {
        const attendances = await prisma.attendance.findMany({
          where: whereClause,
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            },
            demand: {
              include: {
                service: {
                  select: { name: true, category: true }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        const stats = {
          totalAttendances: attendances.length,
          totalHours: attendances.reduce((sum: number, att: any) => sum + att.hours, 0),
          validatedAttendances: attendances.filter((att: any) => att.isValidated).length,
          pendingValidation: attendances.filter((att: any) => !att.isValidated).length,
          byService: attendances.reduce((acc: Record<string, number>, att: any) => {
            const serviceName = att.demand.service.name
            acc[serviceName] = (acc[serviceName] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          byUser: attendances.reduce((acc: Record<string, number>, att: any) => {
            const userName = att.user.name
            acc[userName] = (acc[userName] || 0) + att.hours
            return acc
          }, {} as Record<string, number>),
          monthlyTrend: await getMonthlyTrend('attendance', whereClause)
        }

        if (format === 'pdf') {
          return generatePDFReport('Relatório de Atendimentos', { attendances, stats })
        }

        return NextResponse.json({ attendances, stats })
      }

      case 'demands': {
        const demands = await prisma.demand.findMany({
          where: whereClause,
          include: {
            user: {
              select: { id: true, name: true, email: true, role: true }
            },
            service: {
              select: { name: true, category: true }
            },
            attendances: {
              select: { id: true, hours: true, isValidated: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        })

        const stats = {
          totalDemands: demands.length,
          byStatus: demands.reduce((acc: Record<string, number>, demand: any) => {
            acc[demand.status] = (acc[demand.status] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          byPriority: demands.reduce((acc: Record<string, number>, demand: any) => {
            acc[demand.priority] = (acc[demand.priority] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          byService: demands.reduce((acc: Record<string, number>, demand: any) => {
            const serviceName = demand.service.name
            acc[serviceName] = (acc[serviceName] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          averageResolutionTime: calculateAverageResolutionTime(demands),
          monthlyTrend: await getMonthlyTrend('demand', whereClause)
        }

        if (format === 'pdf') {
          return generatePDFReport('Relatório de Demandas', { demands, stats })
        }

        return NextResponse.json({ demands, stats })
      }

      case 'services': {
        const services = await prisma.service.findMany({
          include: {
            demands: {
              where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
              select: { id: true, status: true, createdAt: true }
            }
          }
        })

        const stats = {
          totalServices: services.length,
          activeServices: services.filter((s: any) => s.isActive).length,
          inactiveServices: services.filter((s: any) => !s.isActive).length,
          serviceUsage: services.map((service: any) => ({
            name: service.name,
            category: service.category,
            totalRequests: service.demands.length,
            pendingRequests: service.demands.filter((d: any) => d.status === 'PENDING').length,
            completedRequests: service.demands.filter((d: any) => d.status === 'COMPLETED').length
          })),
          byCategory: services.reduce((acc: Record<string, number>, service: any) => {
            acc[service.category] = (acc[service.category] || 0) + service.demands.length
            return acc
          }, {} as Record<string, number>)
        }

        if (format === 'pdf') {
          return generatePDFReport('Relatório de Serviços', { services, stats })
        }

        return NextResponse.json({ services, stats })
      }

      case 'users': {
        // Apenas coordenadores podem ver relatório de usuários
        if (session.user.role !== 'COORDINATOR') {
          return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
        }

        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            demands: {
              select: { id: true, status: true }
            },
            attendances: {
              select: { id: true, hours: true, isValidated: true }
            }
          },
          where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
        })

        const stats = {
          totalUsers: users.length,
          byRole: users.reduce((acc: Record<string, number>, user: any) => {
            acc[user.role] = (acc[user.role] || 0) + 1
            return acc
          }, {} as Record<string, number>),
          activeUsers: users.filter((u: any) => u.demands.length > 0 || u.attendances.length > 0).length,
          userActivity: users.map((user: any) => ({
            name: user.name,
            email: user.email,
            role: user.role,
            totalDemands: user.demands.length,
            totalHours: user.attendances.reduce((sum: number, att: any) => sum + att.hours, 0),
            validatedHours: user.attendances.filter((att: any) => att.isValidated).reduce((sum: number, att: any) => sum + att.hours, 0)
          }))
        }

        if (format === 'pdf') {
          return generatePDFReport('Relatório de Usuários', { users, stats })
        }

        return NextResponse.json({ users, stats })
      }

      case 'general':
      default: {
        const [totalUsers, totalServices, totalDemands, totalAttendances] = await Promise.all([
          prisma.user.count(),
          prisma.service.count(),
          prisma.demand.count({ where: whereClause }),
          prisma.attendance.count({ where: whereClause })
        ])

        const recentActivity = await prisma.demand.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { name: true } },
            service: { select: { name: true } }
          }
        })

        const stats = {
          overview: {
            totalUsers,
            totalServices,
            totalDemands,
            totalAttendances
          },
          recentActivity: recentActivity.map((demand: any) => ({
            id: demand.id,
            protocol: demand.protocolNumber,
            user: demand.user.name,
            service: demand.service.name,
            status: demand.status,
            createdAt: demand.createdAt
          })),
          monthlyTrend: await getMonthlyTrend('general', whereClause)
        }

        if (format === 'pdf') {
          return generatePDFReport('Relatório Geral NAF', { stats })
        }

        return NextResponse.json(stats)
      }
    }
  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function getMonthlyTrend(type: string, whereClause: any) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return {
      month: date.toLocaleString('pt-BR', { month: 'short', year: 'numeric' }),
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }
  }).reverse()

  const trend = await Promise.all(
    last6Months.map(async ({ month, start, end }) => {
      let count = 0
      
      if (type === 'attendance') {
        count = await prisma.attendance.count({
          where: {
            ...whereClause,
            createdAt: { gte: start, lte: end }
          }
        })
      } else if (type === 'demand') {
        count = await prisma.demand.count({
          where: {
            ...whereClause,
            createdAt: { gte: start, lte: end }
          }
        })
      } else {
        count = await prisma.demand.count({
          where: { createdAt: { gte: start, lte: end } }
        })
      }

      return { month, count }
    })
  )

  return trend
}

function calculateAverageResolutionTime(demands: any[]) {
  const completedDemands = demands.filter(d => d.status === 'COMPLETED' && d.updatedAt)
  
  if (completedDemands.length === 0) return 0

  const totalTime = completedDemands.reduce((sum, demand) => {
    const resolutionTime = new Date(demand.updatedAt).getTime() - new Date(demand.createdAt).getTime()
    return sum + resolutionTime
  }, 0)

  return Math.round(totalTime / completedDemands.length / (1000 * 60 * 60 * 24)) // dias
}

function generatePDFReport(title: string, data: any) {
  // Simulação de geração de PDF
  const pdfContent = `
    Relatório NAF - ${title}
    Gerado em: ${new Date().toLocaleString('pt-BR')}
    
    ${JSON.stringify(data, null, 2)}
  `

  return new NextResponse(pdfContent, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${title.replace(/\s+/g, '_')}.pdf"`
    }
  })
}
