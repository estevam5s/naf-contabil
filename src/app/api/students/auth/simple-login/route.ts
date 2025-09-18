import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

// Mock student data for testing
const mockStudents = [
  {
    id: '1',
    email: 'ana.santos@estudante.edu.br',
    password: '123456',
    name: 'Ana Carolina Santos',
    phone: '(11) 99999-0001',
    course: 'Ciências Contábeis',
    semester: '6º Semestre',
    registration_number: '2024001001',
    specializations: ['Imposto de Renda', 'MEI', 'Pessoa Física'],
    status: 'ATIVO'
  },
  {
    id: '2',
    email: 'joao.silva@estudante.edu.br',
    password: '123456',
    name: 'João Silva',
    phone: '(11) 99999-0002',
    course: 'Administração',
    semester: '4º Semestre',
    registration_number: '2024001002',
    specializations: ['MEI', 'Consultoria Empresarial'],
    status: 'ATIVO'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Find student
    const student = mockStudents.find(s =>
      s.email.toLowerCase() === email.toLowerCase() &&
      s.password === password
    )

    if (!student) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        studentId: student.id,
        email: student.email,
        role: 'student'
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    )

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      token,
      student: {
        id: student.id,
        email: student.email,
        name: student.name,
        course: student.course,
        semester: student.semester,
        phone: student.phone,
        registrationNumber: student.registration_number,
        specializations: student.specializations,
        status: student.status
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}