import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST - Criar notificação usando template
export async function POST(request: NextRequest) {
  try {
    const {
      templateName,
      recipientId,
      recipientType,
      variables = {},
      metadata = {},
      recipientEmail
    } = await request.json()

    if (!templateName || !recipientId || !recipientType) {
      return NextResponse.json({
        error: 'templateName, recipientId e recipientType são obrigatórios'
      }, { status: 400 })
    }

    // Buscar o template
    const { data: template, error: templateError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('template_name', templateName)
      .eq('user_type', recipientType)
      .eq('is_active', true)
      .single()

    if (templateError || !template) {
      console.error('Template not found:', templateError)
      return NextResponse.json({
        error: `Template '${templateName}' não encontrado para o tipo de usuário '${recipientType}'`
      }, { status: 404 })
    }

    // Processar template - substituir variáveis
    let title = template.title_template
    let message = template.message_template

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`
      title = title.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value))
      message = message.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value))
    })

    // Calcular expiração se configurada no template
    const expiresAt = template.default_expires_hours
      ? new Date(Date.now() + template.default_expires_hours * 60 * 60 * 1000).toISOString()
      : null

    // Criar a notificação
    const { data: notification, error: notificationError } = await supabase
      .from('notifications')
      .insert({
        recipient_id: recipientId,
        recipient_type: recipientType,
        recipient_email: recipientEmail,
        title,
        message,
        notification_type: template.notification_type,
        priority: template.default_priority,
        icon: template.default_icon,
        color: template.default_color,
        send_email: template.default_send_email,
        send_push: template.default_send_push,
        send_sms: template.default_send_sms,
        is_persistent: template.is_persistent,
        expires_at: expiresAt,
        metadata: {
          ...metadata,
          template_name: templateName,
          variables
        }
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return NextResponse.json({
        error: 'Erro ao criar notificação'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notificação criada com sucesso usando template',
      notification,
      template_used: templateName
    }, { status: 201 })

  } catch (error) {
    console.error('Error in template notification POST:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// GET - Listar templates disponíveis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userType = searchParams.get('userType')

    let query = supabase
      .from('notification_templates')
      .select('template_name, notification_type, user_type, title_template, message_template, default_priority, default_icon, default_color')
      .eq('is_active', true)
      .order('template_name')

    if (userType) {
      query = query.eq('user_type', userType)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error('Error fetching templates:', error)
      return NextResponse.json({
        error: 'Erro ao buscar templates'
      }, { status: 500 })
    }

    return NextResponse.json({
      templates: templates || []
    })

  } catch (error) {
    console.error('Error in templates GET:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}