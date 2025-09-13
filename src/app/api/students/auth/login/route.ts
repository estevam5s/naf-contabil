import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar estudante no Supabase
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'ATIVO')
      .single()

    if (error || !student) {
      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, student.password_hash)

    if (!isValidPassword) {
      // Log da tentativa de login falhada
      await supabase
        .from('student_activity_logs')
        .insert({
          student_id: student.id,
          activity_type: 'LOGIN_FAILED',
          activity_data: {
            reason: 'Senha inválida',
            attempted_email: email
          },
          ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
          user_agent: request.headers.get('user-agent') || ''
        })

      return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        studentId: student.id,
        email: student.email,
        role: 'student'
      },
      process.env.NEXTAUTH_SECRET || 'your-secret-key',
      { expiresIn: '8h' }
    )

    // Salvar sessão no banco
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 8)

    await supabase
      .from('student_sessions')
      .insert({
        student_id: student.id,
        token,
        expires_at: expiresAt.toISOString()
      })

    // Atualizar último login
    await supabase
      .from('students')
      .update({ last_login: new Date().toISOString() })
      .eq('id', student.id)

    // Log da tentativa de login bem-sucedida
    await supabase
      .from('student_activity_logs')
      .insert({
        student_id: student.id,
        activity_type: 'LOGIN_SUCCESS',
        activity_data: {
          login_time: new Date().toISOString()
        },
        ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || ''
      })

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
        status: student.status,
        lastLogin: student.last_login
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