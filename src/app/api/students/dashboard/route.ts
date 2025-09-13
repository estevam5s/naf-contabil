import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function verifyStudentToken(token: string): Promise<any> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'your-secret-key'
    ) as any

    if (!decoded.studentId || decoded.role !== 'student') {
      return null
    }

    // Verificar se a sessão existe no banco e não expirou
    const { data: session, error } = await supabase
      .from('student_sessions')
      .select('*')
      .eq('token', token)
      .eq('student_id', decoded.studentId)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
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

    // Buscar dados do estudante
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentAuth.studentId)
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { message: 'Estudante não encontrado' },
        { status: 404 }
      )
    }

    // Buscar atendimentos do estudante
    const { data: attendances, error: attendancesError } = await supabase
      .from('attendances')
      .select('*')
      .eq('student_id', student.id)
      .order('scheduled_date', { ascending: false })
      .limit(10)

    if (attendancesError) {
      throw attendancesError
    }

    // Buscar progresso em treinamentos
    const { data: trainingProgress, error: trainingError } = await supabase
      .from('student_training_progress')
      .select(`
        *,
        training:trainings (*)
      `)
      .eq('student_id', student.id)

    if (trainingError) {
      throw trainingError
    }

    // Buscar todos os treinamentos disponíveis para calcular estatísticas
    const { data: allTrainings, error: allTrainingsError } = await supabase
      .from('trainings')
      .select('id')
      .eq('is_active', true)

    if (allTrainingsError) {
      throw allTrainingsError
    }

    // Calcular estatísticas
    const totalAttendances = attendances?.length || 0
    const completedAttendances = attendances?.filter(a => a.status === 'CONCLUIDO').length || 0
    const ratingsSum = attendances
      ?.filter(a => a.client_satisfaction_rating)
      .reduce((sum, a) => sum + (a.client_satisfaction_rating || 0), 0) || 0
    const ratingsCount = attendances?.filter(a => a.client_satisfaction_rating).length || 0
    const avgRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0

    const completedTrainings = trainingProgress?.filter(tp => tp.is_completed).length || 0
    const totalTrainings = allTrainings?.length || 0

    // Preparar dados de resposta
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
      attendances: attendances || [],
      trainings: trainingProgress || []
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