import { NextRequest, NextResponse } from 'next/server'

interface Attendance {
  id: string
  protocol: string
  studentName: string
  studentEmail: string
  clientName: string
  clientDocument: string
  serviceType: string
  status: string
  date: string
  time: string
  duration: number
  description: string
  isValidated: boolean
  validatedBy?: string
  validatedAt?: string
  createdAt: string
}


export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Simular dados para funcionamento sem autenticação por enquanto
    const userRole = 'COORDINATOR'

    // Dados simulados de atendimentos baseados no papel do usuário
    let attendances: Attendance[] = []

    if (userRole === 'COORDINATOR') {
      attendances = [
        {
          id: '1',
          protocol: 'ATD-2025-0001',
          studentName: 'João Silva',
          studentEmail: 'joao.silva@naf.teste',
          clientName: 'Ana Maria Santos',
          clientDocument: '123.456.789-01',
          serviceType: 'Cadastro CPF',
          status: 'concluido',
          date: '2025-01-03',
          time: '14:30',
          duration: 45,
          description: 'Orientação para primeira via do CPF para menor de idade',
          isValidated: true,
          validatedBy: 'Prof. Carlos',
          validatedAt: '2025-01-03T16:00:00Z',
          createdAt: '2025-01-03T14:00:00Z'
        },
        {
          id: '2',
          protocol: 'ATD-2025-0002',
          studentName: 'Maria Costa',
          studentEmail: 'maria.costa@naf.teste',
          clientName: 'Pedro Oliveira',
          clientDocument: '987.654.321-02',
          serviceType: 'MEI - Abertura',
          status: 'em_andamento',
          date: '2025-01-04',
          time: '09:00',
          duration: 60,
          description: 'Abertura de MEI para atividade de design gráfico',
          isValidated: false,
          createdAt: '2025-01-04T08:30:00Z'
        },
        {
          id: '3',
          protocol: 'ATD-2025-0003',
          studentName: 'Carlos Ferreira',
          studentEmail: 'carlos.ferreira@naf.teste',
          clientName: 'Lucia Souza',
          clientDocument: '456.789.123-03',
          serviceType: 'Imposto de Renda',
          status: 'agendado',
          date: '2025-01-05',
          time: '10:30',
          duration: 90,
          description: 'Primeira declaração de IR - pessoa física',
          isValidated: false,
          createdAt: '2025-01-04T11:00:00Z'
        }
      ]
    } else if (userRole === 'TEACHER') {
      attendances = [
        {
          id: '2',
          protocol: 'ATD-2025-0002',
          studentName: 'Maria Costa',
          studentEmail: 'maria.costa@naf.teste',
          clientName: 'Pedro Oliveira',
          clientDocument: '987.654.321-02',
          serviceType: 'MEI - Abertura',
          status: 'em_andamento',
          date: '2025-01-04',
          time: '09:00',
          duration: 60,
          description: 'Abertura de MEI para atividade de design gráfico',
          isValidated: false,
          createdAt: '2025-01-04T08:30:00Z'
        },
        {
          id: '4',
          protocol: 'ATD-2025-0004',
          studentName: 'Ana Silva',
          studentEmail: 'ana.silva@naf.teste',
          clientName: 'Roberto Lima',
          clientDocument: '789.123.456-04',
          serviceType: 'ICMS - Inscrição',
          status: 'pendente_validacao',
          date: '2025-01-04',
          time: '15:00',
          duration: 75,
          description: 'Inscrição estadual para empresa de comércio',
          isValidated: false,
          createdAt: '2025-01-04T14:30:00Z'
        }
      ]
    } else if (userRole === 'STUDENT') {
      attendances = [
        {
          id: '5',
          protocol: 'ATD-2025-0005',
          studentName: 'Estudante Teste',
          studentEmail: 'estudante@teste.com',
          clientName: 'Fernanda Costa',
          clientDocument: '321.654.987-05',
          serviceType: 'ITR - Declaração',
          status: 'concluido',
          date: '2025-01-02',
          time: '11:00',
          duration: 120,
          description: 'Declaração de ITR para propriedade rural em São José',
          isValidated: true,
          validatedBy: 'Prof. Maria',
          validatedAt: '2025-01-02T14:00:00Z',
          createdAt: '2025-01-02T10:30:00Z'
        },
        {
          id: '6',
          protocol: 'ATD-2025-0006',
          studentName: 'Estudante Teste',
          studentEmail: 'estudante@teste.com',
          clientName: 'José Santos',
          clientDocument: '654.321.987-06',
          serviceType: 'Consulta Tributária',
          status: 'em_andamento',
          date: '2025-01-04',
          time: '16:30',
          duration: 60,
          description: 'Dúvidas sobre regime tributário para empresa',
          isValidated: false,
          createdAt: '2025-01-04T16:00:00Z'
        }
      ]
    } else {
      // Usuário comum - não vê atendimentos internos
      attendances = []
    }

    // Aplicar filtros se fornecidos
    if (status) {
      attendances = attendances.filter(att => att.status === status)
    }

    return NextResponse.json({
      attendances,
      total: attendances.length,
      success: true,
      userRole
    })
  } catch (error) {
    console.error('Erro ao buscar atendimentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', attendances: [], total: 0 },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validações básicas
    if (!data.clientName || !data.serviceType || !data.description) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Simular criação de atendimento
    const newAttendance: Attendance = {
      id: Date.now().toString(),
      protocol: `ATD-2025-${String(Date.now()).slice(-4)}`,
      studentName: 'Usuário Teste',
      studentEmail: 'usuario@teste.com',
      clientName: data.clientName,
      clientDocument: data.clientDocument || '',
      serviceType: data.serviceType,
      status: 'em_andamento',
      date: data.date || new Date().toISOString().split('T')[0],
      time: data.time || new Date().toTimeString().slice(0, 5),
      duration: data.duration || 60,
      description: data.description,
      isValidated: false,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Atendimento registrado com sucesso',
      attendance: newAttendance,
      success: true
    })
  } catch (error) {
    console.error('Erro ao criar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, status, validatedBy } = data

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID e status são obrigatórios' },
        { status: 400 }
      )
    }

    // Simular atualização do atendimento
    const updatedAttendance = {
      id,
      status,
      validatedBy: validatedBy || 'Usuário Teste',
      validatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Atendimento atualizado com sucesso',
      attendance: updatedAttendance,
      success: true
    })
  } catch (error) {
    console.error('Erro ao atualizar atendimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
