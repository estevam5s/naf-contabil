import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/students/register - Iniciando cadastro')
    const data = await request.json()
    console.log('📋 Dados recebidos (sem senha):', { ...data, password: '[HIDDEN]' })

    // Validações básicas
    if (!data.email || !data.password || !data.name || !data.course || !data.semester) {
      return NextResponse.json(
        { message: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar senha
    if (data.password.length < 6) {
      return NextResponse.json(
        { message: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se CPF já existe (se fornecido)
    if (data.document) {
      const { data: existingCPF } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('document', data.document.replace(/\D/g, ''))
        .single()

      if (existingCPF) {
        return NextResponse.json(
          { message: 'CPF já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Verificar se matrícula já existe
    if (data.registrationNumber) {
      const { data: existingReg } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('registration_number', data.registrationNumber)
        .single()

      if (existingReg) {
        return NextResponse.json(
          { message: 'Número de matrícula já cadastrado' },
          { status: 400 }
        )
      }
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, 12)

    // Preparar dados para inserção
    const studentData = {
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      name: data.name,
      phone: data.phone || null,
      document: data.document ? data.document.replace(/\D/g, '') : null,
      course: data.course,
      semester: data.semester,
      registration_number: data.registrationNumber || null,
      birth_date: data.birthDate || null,
      address: data.address ? {
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zipcode: data.address.zipcode.replace(/\D/g, '')
      } : null,
      emergency_contact: data.emergencyContact ? {
        name: data.emergencyContact.name,
        phone: data.emergencyContact.phone,
        relationship: data.emergencyContact.relationship
      } : null,
      specializations: [],
      available_hours: [],
      status: 'ATIVO'
    }

    // Inserir estudante no banco
    console.log('💾 Tentando inserir no banco...')
    const { data: newStudent, error: insertError } = await supabaseAdmin
      .from('students')
      .insert(studentData)

    console.log('📊 Resultado da inserção:', { data: newStudent, error: insertError })

    if (insertError) {
      console.error('❌ Erro ao inserir estudante:', insertError)
      return NextResponse.json(
        { message: 'Erro ao criar conta', details: insertError.message || String(insertError) },
        { status: 500 }
      )
    }

    if (!newStudent) {
      console.error('❌ Nenhum estudante retornado')
      return NextResponse.json(
        { message: 'Erro ao criar conta - dados não retornados' },
        { status: 500 }
      )
    }

    // Inserir registro na tabela student_performance
    await supabaseAdmin
      .from('student_performance')
      .insert({
        student_name: newStudent.name,
        course: newStudent.course,
        total_attendances: 0,
        avg_rating: 0.0,
        last_activity: new Date().toISOString()
      })

    // Log da atividade
    await supabaseAdmin
      .from('student_activity_logs')
      .insert({
        student_id: newStudent.id,
        activity_type: 'REGISTRATION',
        activity_data: {
          registration_date: new Date().toISOString(),
          course: newStudent.course,
          semester: newStudent.semester
        },
        ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || ''
      })

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      student: {
        id: newStudent.id,
        email: newStudent.email,
        name: newStudent.name,
        course: newStudent.course,
        semester: newStudent.semester,
        status: newStudent.status
      }
    })

  } catch (error) {
    console.error('Erro no registro:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}