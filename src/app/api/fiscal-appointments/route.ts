import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      // Dados pessoais
      clientName,
      clientEmail,
      clientPhone,
      clientCpf,
      clientBirthDate,

      // Endereço
      addressStreet,
      addressNumber,
      addressComplement,
      addressNeighborhood,
      addressCity,
      addressState,
      addressZipcode,

      // Serviço
      serviceType,
      serviceTitle,
      serviceCategory,
      urgencyLevel,

      // Agendamento
      preferredDate,
      preferredTime,
      preferredPeriod,

      // Observações
      clientNotes,

      // Campos específicos do serviço
      serviceDetails
    } = body

    // Validações básicas
    if (!clientName || !clientEmail || !clientPhone || !serviceType || !addressCity || !addressState) {
      return NextResponse.json(
        { message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    // Verificar se email já tem agendamento pendente para o mesmo serviço
    const { data: existingAppointment } = await supabase
      .from('fiscal_appointments')
      .select('id')
      .eq('client_email', clientEmail)
      .eq('service_type', serviceType)
      .in('status', ['PENDENTE', 'CONFIRMADO'])
      .single()

    if (existingAppointment) {
      return NextResponse.json(
        { message: 'Você já possui um agendamento pendente para este serviço. Aguarde o contato da equipe.' },
        { status: 409 }
      )
    }

    // Preparar dados para inserção
    const appointmentData = {
      service_type: serviceType,
      service_title: serviceTitle,
      service_category: serviceCategory,

      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone,
      client_cpf: clientCpf || null,
      client_birth_date: clientBirthDate || null,

      address_street: addressStreet || null,
      address_number: addressNumber || null,
      address_complement: addressComplement || null,
      address_neighborhood: addressNeighborhood || null,
      address_city: addressCity,
      address_state: addressState,
      address_zipcode: addressZipcode || null,

      service_details: serviceDetails || {},
      urgency_level: urgencyLevel || 'NORMAL',

      preferred_date: preferredDate || null,
      preferred_time: preferredTime || null,
      preferred_period: preferredPeriod || null,

      client_notes: clientNotes || null,

      status: 'PENDENTE'
    }

    // Inserir agendamento
    const { data: appointment, error: insertError } = await supabase
      .from('fiscal_appointments')
      .insert(appointmentData)
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir agendamento:', insertError)
      return NextResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Resposta de sucesso
    return NextResponse.json({
      message: 'Agendamento solicitado com sucesso!',
      protocol: appointment.protocol,
      appointment: {
        id: appointment.id,
        protocol: appointment.protocol,
        service_title: appointment.service_title,
        status: appointment.status,
        created_at: appointment.created_at
      }
    })

  } catch (error) {
    console.error('Erro no endpoint de agendamentos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')
    const serviceType = searchParams.get('service_type')

    let query = supabase
      .from('fiscal_appointments')
      .select(`
        id,
        service_type,
        service_title,
        service_category,
        client_name,
        client_email,
        client_phone,
        address_city,
        address_state,
        urgency_level,
        preferred_date,
        preferred_period,
        status,
        protocol,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (serviceType) {
      query = query.eq('service_type', serviceType)
    }

    const { data: appointments, error } = await query

    if (error) {
      throw error
    }

    // Buscar estatísticas gerais
    const { data: stats } = await supabase
      .from('fiscal_appointments_summary')
      .select('*')

    return NextResponse.json({
      appointments: appointments || [],
      stats: stats || [],
      pagination: {
        limit,
        offset,
        hasMore: (appointments?.length || 0) === limit
      }
    })

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}