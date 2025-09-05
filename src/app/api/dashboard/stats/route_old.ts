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

    const userId = session.user.id
    const userRole = session.user.role

    // Buscar estatísticas baseadas no role
    let stats

    if (userRole === 'COORDINATOR') {
      // Coordenador vê todos os dados - usando dados simulados pois não temos tabelas ainda
      stats = {
        totalAttendances: 158,
        totalDemands: 42,
        pendingValidations: 8,
        monthlyHours: 65,
        totalUsers: await prisma.user.count(),
        activeUsers: await prisma.user.count({ where: { role: { not: 'USER' } } }),
        newUsersThisMonth: 12,
        completionRate: 85.5,
        newUsersCount: await prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])

      stats = {
        totalAttendances,
        totalDemands,
        pendingValidations,
        monthlyHours: monthlyAttendances._sum.hours || 0,
        recentDemands: await prisma.demand.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        }),
        recentAttendances: await prisma.attendance.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        })
      }
    } else if (userRole === 'TEACHER') {
      // Professor vê dados dos alunos supervisionados e suas validações
      const [myValidations, studentsAttendances, studentsHours] = await Promise.all([
        prisma.attendance.count({ where: { isValidated: false } }),
        prisma.attendance.count(),
        prisma.attendance.aggregate({
          _sum: { hours: true },
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])

      stats = {
        totalAttendances: studentsAttendances,
        totalDemands: await prisma.demand.count(),
        pendingValidations: myValidations,
        monthlyHours: studentsHours._sum.hours || 0,
        recentDemands: await prisma.demand.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        }),
        recentAttendances: await prisma.attendance.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
          where: { isValidated: false }
        })
      }
    } else if (userRole === 'STUDENT') {
      // Aluno vê apenas seus próprios dados
      const [myAttendances, myDemands, pendingValidations, myHours] = await Promise.all([
        prisma.attendance.count({ where: { userId } }),
        prisma.demand.count({ where: { userId } }),
        prisma.attendance.count({ where: { userId, isValidated: false } }),
        prisma.attendance.aggregate({
          _sum: { hours: true },
          where: {
            userId,
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        })
      ])

      stats = {
        totalAttendances: myAttendances,
        totalDemands: myDemands,
        pendingValidations: pendingValidations,
        monthlyHours: myHours._sum.hours || 0,
        recentDemands: await prisma.demand.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        }),
        recentAttendances: await prisma.attendance.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        })
      }
    } else {
      // Usuário comum vê apenas suas demandas
      const [myDemands] = await Promise.all([
        prisma.demand.count({ where: { userId } })
      ])

      stats = {
        totalAttendances: 0,
        totalDemands: myDemands,
        pendingValidations: 0,
        monthlyHours: 0,
        recentDemands: await prisma.demand.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } }
        }),
        recentAttendances: []
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
