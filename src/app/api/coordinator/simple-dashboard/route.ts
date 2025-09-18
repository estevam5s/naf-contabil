import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Mock coordinator dashboard data
const mockDashboardData = {
  mainMetrics: {
    atendimentosMensais: 89,
    taxaConclusao: 87.5,
    tempoMedio: 45,
    satisfacao: 4.6
  },
  services: [
    {
      service_name: 'Declaração de Imposto de Renda',
      service_description: 'Orientação completa para declaração do IR',
      service_category: 'Tributário',
      service_difficulty: 'Intermediário',
      is_featured: true,
      requests_count: 45,
      completed_count: 38,
      pending_count: 7,
      avg_duration_minutes: 60,
      satisfaction_rating: 4.8,
      views_count: 120
    },
    {
      service_name: 'Orientação MEI',
      service_description: 'Orientação sobre MEI e suas obrigações',
      service_category: 'Empresarial',
      service_difficulty: 'Básico',
      is_featured: false,
      requests_count: 32,
      completed_count: 28,
      pending_count: 4,
      avg_duration_minutes: 35,
      satisfaction_rating: 4.5,
      views_count: 85
    }
  ],
  students: [
    {
      student_name: 'Ana Carolina Santos',
      course: 'Ciências Contábeis',
      total_attendances: 15,
      avg_rating: 4.8
    },
    {
      student_name: 'João Silva',
      course: 'Administração',
      total_attendances: 12,
      avg_rating: 4.5
    }
  ],
  weeklyData: [
    { day: 'Seg', atendimentos: 12, agendamentos: 15 },
    { day: 'Ter', atendimentos: 18, agendamentos: 20 },
    { day: 'Qua', atendimentos: 15, agendamentos: 18 },
    { day: 'Qui', atendimentos: 22, agendamentos: 25 },
    { day: 'Sex', atendimentos: 20, agendamentos: 22 },
    { day: 'Sáb', atendimentos: 8, agendamentos: 10 },
    { day: 'Dom', atendimentos: 3, agendamentos: 5 }
  ],
  publicoAlvo: [
    { categoria: 'Pessoa Física', quantidade: 145, percentual: 45 },
    { categoria: 'MEI', quantidade: 98, percentual: 30 },
    { categoria: 'Empresarial', quantidade: 52, percentual: 16 },
    { categoria: 'Rural', quantidade: 29, percentual: 9 }
  ],
  fiscalAppointments: {
    totalAppointments: 156,
    pendingAppointments: 23,
    confirmedAppointments: 89,
    completedAppointments: 34,
    urgentAppointments: 12,
    serviceBreakdown: {
      'ir-pf': {
        service_type: 'ir-pf',
        service_title: 'Declaração IR Pessoa Física',
        total: 45,
        pending: 8,
        confirmed: 25,
        completed: 12,
        urgent: 3
      },
      'mei': {
        service_type: 'mei',
        service_title: 'Orientação MEI',
        total: 32,
        pending: 5,
        confirmed: 18,
        completed: 9,
        urgent: 2
      }
    },
    recentAppointments: [
      {
        protocol: 'FIS-2025-001',
        client_name: 'Maria Silva',
        service_title: 'Declaração IR',
        status: 'PENDENTE',
        urgency_level: 'NORMAL',
        created_at: '2025-01-18T10:30:00Z'
      }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // Para o teste, vamos retornar os dados mock sempre
    // Em produção, aqui verificaria a autenticação do coordenador
    return NextResponse.json(mockDashboardData)

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}