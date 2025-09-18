import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Mock coordinator dashboard data
const mockDashboardData = {
  stats: {
    totalDemands: 156,
    totalAttendances: 89,
    totalStudents: 12,
    totalTeachers: 8,
    pendingValidations: 5,
    completedThisMonth: 34,
    averageResponseTime: 2.3,
    satisfactionScore: 4.6,
    conversionRate: 78.5,
    studentPerformance: 87.2
  },
  recentAttendances: [
    {
      id: '1',
      protocol: 'ATD-2025-0001',
      client_name: 'Maria da Silva',
      student_name: 'Ana Carolina Santos',
      service_type: 'Declaração de Imposto de Renda',
      status: 'CONCLUIDO',
      scheduled_date: '2025-01-20',
      client_satisfaction_rating: 5,
      supervisor_validation: true
    },
    {
      id: '2',
      protocol: 'ATD-2025-0002',
      client_name: 'João Santos',
      student_name: 'João Silva',
      service_type: 'Orientação MEI',
      status: 'EM_ANDAMENTO',
      scheduled_date: '2025-01-22',
      supervisor_validation: false
    }
  ],
  studentPerformance: [
    {
      student_name: 'Ana Carolina Santos',
      total_attendances: 15,
      avg_rating: 4.8,
      completed_trainings: 5,
      last_activity: '2025-01-20'
    },
    {
      student_name: 'João Silva',
      total_attendances: 12,
      avg_rating: 4.5,
      completed_trainings: 3,
      last_activity: '2025-01-22'
    }
  ],
  monthlyTrends: {
    labels: ['Nov', 'Dez', 'Jan'],
    attendances: [45, 52, 34],
    satisfaction: [4.2, 4.4, 4.6],
    completion_rate: [85, 87, 89]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação do coordenador
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'COORDINATOR') {
      return NextResponse.json(
        { message: 'Acesso negado' },
        { status: 403 }
      )
    }

    return NextResponse.json(mockDashboardData)

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}