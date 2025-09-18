import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

// Mock data for testing
const mockStudents = [
  {
    id: '1',
    email: 'ana.santos@estudante.edu.br',
    name: 'Ana Carolina Santos',
    phone: '(11) 99999-0001',
    course: 'Ciências Contábeis',
    semester: '6º Semestre',
    registration_number: '2024001001',
    specializations: ['Imposto de Renda', 'MEI', 'Pessoa Física'],
    status: 'ATIVO'
  }
]

const mockAttendances = [
  {
    id: '1',
    protocol: 'ATD-2025-0001',
    client_name: 'Maria da Silva',
    client_email: 'maria.silva@email.com',
    client_phone: '(11) 99999-9999',
    service_type: 'Declaração de Imposto de Renda',
    service_description: 'Cliente precisa de ajuda com declaração de IR 2024.',
    scheduled_date: '2025-01-20',
    scheduled_time: '09:00',
    status: 'CONCLUIDO',
    urgency: 'MEDIA',
    is_online: false,
    client_satisfaction_rating: 5,
    supervisor_validation: true
  },
  {
    id: '2',
    protocol: 'ATD-2025-0002',
    client_name: 'João Santos',
    client_email: 'joao@email.com',
    client_phone: '(11) 88888-8888',
    service_type: 'Orientação MEI',
    service_description: 'Orientação sobre obrigações do MEI.',
    scheduled_date: '2025-01-22',
    scheduled_time: '14:00',
    status: 'AGENDADO',
    urgency: 'BAIXA',
    is_online: true,
    supervisor_validation: false
  }
]

const mockTrainings = [
  {
    id: '1',
    training_id: '1',
    is_completed: true,
    score: 95,
    started_at: '2025-01-10',
    completed_at: '2025-01-12',
    training: {
      id: '1',
      title: 'Fundamentos da Legislação Tributária',
      description: 'Conceitos básicos sobre legislação tributária brasileira',
      duration_minutes: 150,
      difficulty: 'BÁSICO',
      topics: ['CTN', 'Tributos Federais', 'ICMS', 'ISS'],
      is_mandatory: true
    }
  },
  {
    id: '2',
    training_id: '2',
    is_completed: false,
    started_at: '2025-01-15',
    training: {
      id: '2',
      title: 'Declaração de Imposto de Renda PF',
      description: 'Curso completo sobre DIRPF e suas particularidades',
      duration_minutes: 255,
      difficulty: 'INTERMEDIÁRIO',
      topics: ['DIRPF', 'Deduções', 'Dependentes', 'Bens e Direitos'],
      is_mandatory: true
    }
  }
]

async function verifyStudentToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    ) as any

    if (!decoded.studentId || decoded.role !== 'student') {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const studentAuth = await verifyStudentToken(token)

    if (!studentAuth) {
      return NextResponse.json(
        { message: 'Token inválido' },
        { status: 401 }
      )
    }

    // Find student
    const student = mockStudents.find(s => s.id === studentAuth.studentId)
    if (!student) {
      return NextResponse.json(
        { message: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Calculate statistics
    const totalAttendances = mockAttendances.length
    const completedAttendances = mockAttendances.filter(a => a.status === 'CONCLUIDO').length
    const avgRating = mockAttendances
      .filter(a => a.client_satisfaction_rating)
      .reduce((sum, a) => sum + (a.client_satisfaction_rating || 0), 0) / mockAttendances.filter(a => a.client_satisfaction_rating).length || 0

    const completedTrainings = mockTrainings.filter(t => t.is_completed).length
    const totalTrainings = mockTrainings.length

    const responseData = {
      profile: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        course: student.course,
        semester: student.semester,
        registrationNumber: student.registration_number,
        specializations: student.specializations || [],
        status: student.status
      },
      stats: {
        totalAttendances,
        completedAttendances,
        avgRating: Math.round(avgRating * 10) / 10,
        completedTrainings,
        totalTrainings
      },
      attendances: mockAttendances,
      trainings: mockTrainings
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}